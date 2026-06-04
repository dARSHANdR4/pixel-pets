/**
 * Pixel Pets - Service Worker (Background Script)
 * Handles extension lifecycle, messaging, persistence, and achievement evaluation.
 *
 * KEY ARCHITECTURE DECISIONS (post Risk A/B/C fixes):
 *
 * RISK A FIX — Achievement Bypass:
 *   Achievements are now evaluated via chrome.storage.onChanged, which fires
 *   for EVERY write regardless of source (content script, popup, options page).
 *   Evaluation marks achievements as `claimable: true` (threshold met, not yet claimed).
 *   The user must click CLAIM in the options page to permanently unlock an achievement.
 *   This decouples evaluation from the SAVE_PET message pipeline entirely.
 *
 * RISK B FIX — Multi-Tab Playtime:
 *   Playtime is accumulated ONLY in the service worker's mood-decay alarm (every 1 min).
 *   We PING all tabs and only credit playtime to the single tab that responds first.
 *   The content script no longer accumulates totalPlayTime in its game loop.
 *
 * RISK C FIX — Race Conditions:
 *   Handled in storage-manager.js via a write queue mutex. No changes needed here.
 */

// Import constants
importScripts('../lib/constants.js');

// ═══════════════════════════════════════════
// INSTALLATION & UPDATE
// ═══════════════════════════════════════════

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[PixelPets SW] Extension installed/updated:', details.reason);

  if (details.reason === 'install') {
    const defaults = {
      settings: { ...DEFAULT_SETTINGS },
      pets: [{
        ...DEFAULT_PET,
        id: `pet-${Date.now()}`,
        stats: { ...DEFAULT_PET.stats, created: Date.now() }
      }],
      accessories: {
        owned: [],
        unlocked: ['cat-classic', 'cat-black', 'cat-white', 'cat-orange', 'puppy', 'bunny', 'fox']
      },
      // achievements array stores RUNTIME state: { id, claimable, unlocked (timestamp) }
      achievements: [],
      customPets: [],
      version: '1.0.0'
    };

    await chrome.storage.local.set(defaults);
    console.log('[PixelPets SW] Default settings saved');

    chrome.alarms.create('auto-save', { periodInMinutes: 5 });
    chrome.alarms.create('mood-decay', { periodInMinutes: 1 });

  } else if (details.reason === 'update') {
    console.log('[PixelPets SW] Extension updated to version', chrome.runtime.getManifest().version);
  }
});

// ═══════════════════════════════════════════
// ALARM HANDLERS
// ═══════════════════════════════════════════

chrome.alarms.onAlarm.addListener(async (alarm) => {
  switch (alarm.name) {
    case 'auto-save':
      console.log('[PixelPets SW] Auto-save triggered');
      break;

    case 'mood-decay':
      await handleMoodDecayAndPlaytime();
      break;
  }
});

/**
 * RISK B FIX — Single-tab playtime accumulation.
 * Fires every 1 minute. PINGs all tabs, credits 60s of playtime to
 * the FIRST tab that responds (the active tab with a live content script).
 * All other tabs are silently skipped.
 */
async function handleMoodDecayAndPlaytime() {
  try {
    const data = await chrome.storage.local.get('pets');
    if (!data.pets || data.pets.length === 0) return;

    // Apply passive mood/energy decay to all pets
    data.pets.forEach(pet => {
      pet.mood   = Math.max(0, pet.mood   - INTERACTIONS.MOOD_DECAY_RATE);
      pet.energy = Math.max(0, pet.energy - INTERACTIONS.ENERGY_DECAY_RATE);
    });

    // Find the single active tab to credit playtime to
    let activeTabResponded = false;
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      for (const tab of tabs) {
        if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) continue;
        try {
          const ping = await chrome.tabs.sendMessage(tab.id, { type: 'PING' });
          if (ping && ping.alive) {
            // Credit 60 seconds (1 minute alarm interval) to each pet on this active tab
            data.pets.forEach(pet => {
              if (!pet.stats) pet.stats = {};
              pet.stats.totalPlayTime = (pet.stats.totalPlayTime || 0) + 60000;
            });
            activeTabResponded = true;
            console.log(`[PixelPets SW] Playtime credited to tab ${tab.id} (+60s)`);
            break; // Only credit the first responding active tab
          }
        } catch (_) {
          // Tab has no content script — skip
        }
      }
    } catch (_) {
      // Tab query failed — ignore
    }

    if (!activeTabResponded) {
      console.log('[PixelPets SW] No active tab with content script found — playtime not credited.');
    }

    await chrome.storage.local.set({ pets: data.pets });

  } catch (error) {
    console.error('[PixelPets SW] Mood decay/playtime error:', error);
  }
}

// ═══════════════════════════════════════════
// MESSAGE HANDLING
// ═══════════════════════════════════════════

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {

    // ── Settings ────────────────────────────────────────────────────────────
    case 'GET_SETTINGS':
      chrome.storage.local.get('settings', (data) => {
        sendResponse(data.settings || DEFAULT_SETTINGS);
      });
      return true;

    case 'SAVE_SETTINGS':
      chrome.storage.local.get('settings', (data) => {
        const updated = { ...data.settings, ...message.settings };
        chrome.storage.local.set({ settings: updated }, () => {
          broadcastToTabs({ type: 'UPDATE_SETTINGS', settings: updated });
          sendResponse({ success: true });
        });
      });
      return true;

    // ── Pets ─────────────────────────────────────────────────────────────────
    case 'GET_ALL_PETS':
      chrome.storage.local.get('pets', (data) => {
        sendResponse(data.pets || []);
      });
      return true;

    case 'SAVE_PET':
      // Still supported for backwards compat with popup fallback path,
      // but achievement evaluation now happens via storage.onChanged — not here.
      chrome.storage.local.get('pets', (data) => {
        const pets = data.pets || [];
        const index = pets.findIndex(p => p.id === message.pet.id);
        if (index >= 0) {
          pets[index] = { ...pets[index], ...message.pet };
        } else {
          pets.push(message.pet);
        }
        chrome.storage.local.set({ pets }, () => {
          sendResponse({ success: true });
        });
      });
      return true;

    case 'REMOVE_PET':
      chrome.storage.local.get('pets', (data) => {
        let pets = data.pets || [];
        pets = pets.filter(p => p.id !== message.petId);
        chrome.storage.local.set({ pets }, () => {
          broadcastToTabs({ type: 'REMOVE_PET', petId: message.petId });
          sendResponse({ success: true });
        });
      });
      return true;

    // ── Achievements ─────────────────────────────────────────────────────────
    case 'GET_ACHIEVEMENTS':
      chrome.storage.local.get('achievements', (data) => {
        sendResponse(data.achievements || []);
      });
      return true;

    /**
     * EVALUATE_ACHIEVEMENTS — triggered by pet-engine after every interaction.
     * Re-computes which achievements are now claimable based on current pet stats.
     * Broadcasts CLAIMABLE_ACHIEVEMENT to tabs if any newly become claimable.
     */
    case 'EVALUATE_ACHIEVEMENTS':
      chrome.storage.local.get(['pets', 'achievements'], (data) => {
        const pets = data.pets || [];
        const achievements = data.achievements || [];
        const pet = pets.find(p => p.id === message.petId) || pets[0];
        if (!pet) { sendResponse({ success: true }); return; }

        const newlyClaimable = markClaimableAchievements(pet, pets.length, achievements);

        if (newlyClaimable.length > 0) {
          chrome.storage.local.set({ achievements }, () => {
            newlyClaimable.forEach(ach => {
              console.log('[PixelPets SW] Achievement now claimable:', ach.id);
              broadcastToTabs({ type: 'ACHIEVEMENT_CLAIMABLE', achievement: ach });
            });
            sendResponse({ success: true, newlyClaimable });
          });
        } else {
          sendResponse({ success: true, newlyClaimable: [] });
        }
      });
      return true;

    /**
     * CLAIM_ACHIEVEMENT — user clicked the CLAIM button in options page.
     * Verifies the pet still meets the condition, permanently sets unlocked timestamp,
     * and processes any pet unlock rewards.
     */
    case 'CLAIM_ACHIEVEMENT':
      chrome.storage.local.get(['pets', 'achievements', 'accessories'], (data) => {
        const pets = data.pets || [];
        const achievements = data.achievements || [];
        const accessories = data.accessories || { owned: [], unlocked: [] };

        const achievementDef = ACHIEVEMENTS.find(a => a.id === message.achievementId);
        if (!achievementDef) { sendResponse({ success: false, reason: 'Unknown achievement' }); return; }

        // Find runtime record
        let record = achievements.find(a => a.id === message.achievementId);

        // Don't allow double-claiming
        if (record && record.unlocked) {
          sendResponse({ success: false, reason: 'Already claimed' });
          return;
        }

        // Final server-side stat verification before claiming
        const pet = pets[0]; // Check primary pet stats
        if (!pet) { sendResponse({ success: false, reason: 'No pet found' }); return; }

        const isStillEligible = checkEligibility(achievementDef, pet, pets.length);
        if (!isStillEligible) {
          sendResponse({ success: false, reason: 'Threshold not yet met' });
          return;
        }

        // Mark as permanently claimed
        const claimedAt = Date.now();
        if (record) {
          record.unlocked = claimedAt;
          record.claimable = false;
        } else {
          achievements.push({
            id: achievementDef.id,
            tier: achievementDef.tier,
            claimable: false,
            unlocked: claimedAt
          });
        }

        // Process pet unlock reward if applicable
        if (achievementDef.rewardPetUnlock) {
          if (!accessories.unlocked.includes(achievementDef.rewardPetUnlock)) {
            accessories.unlocked.push(achievementDef.rewardPetUnlock);
            console.log(`[PixelPets SW] Pet unlocked as reward: ${achievementDef.rewardPetUnlock}`);
          }
        }

        chrome.storage.local.set({ achievements, accessories }, () => {
          const payload = {
            ...achievementDef,
            unlocked: claimedAt,
            petUnlocked: achievementDef.rewardPetUnlock || null
          };
          broadcastToTabs({ type: 'ACHIEVEMENT_UNLOCKED', achievement: payload });
          sendResponse({ success: true, achievement: payload });
        });
      });
      return true;

    case 'GET_UNLOCKED_PETS':
      chrome.storage.local.get('accessories', (data) => {
        sendResponse(data.accessories?.unlocked || []);
      });
      return true;
  }
});

// ═══════════════════════════════════════════
// RISK A FIX — storage.onChanged ACHIEVEMENT WATCHER
// Fires for every write to chrome.storage.local, regardless of source.
// This ensures achievement eligibility is always evaluated, even when
// the content script saves directly (bypassing SAVE_PET messaging).
// ═══════════════════════════════════════════

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;

  if (changes.settings) {
    console.log('[PixelPets SW] Settings changed:', changes.settings.newValue);
  }

  // Every time pets data changes, re-evaluate achievement eligibility
  if (changes.pets) {
    const pets = changes.pets.newValue || [];
    if (pets.length === 0) return;

    chrome.storage.local.get('achievements', (data) => {
      const achievements = data.achievements || [];
      const primaryPet = pets[0];
      const newlyClaimable = markClaimableAchievements(primaryPet, pets.length, achievements);

      if (newlyClaimable.length > 0) {
        chrome.storage.local.set({ achievements }, () => {
          newlyClaimable.forEach(ach => {
            console.log('[PixelPets SW] [onChanged] Achievement now claimable:', ach.id);
            broadcastToTabs({ type: 'ACHIEVEMENT_CLAIMABLE', achievement: ach });
          });
        });
      }
    });
  }
});

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

/**
 * Check whether a single achievement's stat condition is met.
 * Returns true if the pet data meets the threshold defined in achievementDef.
 */
function checkEligibility(achievementDef, pet, totalPets) {
  const stats = pet.stats || {};
  switch (achievementDef.statKey) {
    case 'petCount':       return (stats.petCount      || 0) >= achievementDef.max;
    case 'feedCount':      return (stats.feedCount     || 0) >= achievementDef.max;
    case 'playCount':      return (stats.playCount     || 0) >= achievementDef.max;
    case 'sleepCount':     return (stats.sleepCount    || 0) >= achievementDef.max;
    case 'totalPlayTime':  return (stats.totalPlayTime || 0) >= achievementDef.max;
    case 'energy':         return (pet.energy          || 0) >= achievementDef.max;
    case 'mood':           return (pet.mood            || 0) >= achievementDef.max;
    case 'uniquePets':
      // uniquePets is a cross-pet calculation — approximate with totalPets
      return totalPets >= achievementDef.max;
    default:
      return false;
  }
}

/**
 * RISK A FIX — Mark achievements as claimable without unlocking them.
 * Returns array of achievements that became newly claimable in this call.
 * Mutates the `achievements` array in-place (caller must persist to storage).
 */
function markClaimableAchievements(pet, totalPets, achievements) {
  const newlyClaimable = [];

  ACHIEVEMENTS.forEach(def => {
    // Skip already-unlocked (claimed) achievements
    const existing = achievements.find(a => a.id === def.id);
    if (existing && existing.unlocked) return;

    const eligible = checkEligibility(def, pet, totalPets);

    if (eligible) {
      if (!existing) {
        // Create runtime record as claimable
        const record = { id: def.id, tier: def.tier, claimable: true, unlocked: null };
        achievements.push(record);
        newlyClaimable.push({ ...def, ...record });
      } else if (!existing.claimable) {
        // Upgrade existing record to claimable
        existing.claimable = true;
        newlyClaimable.push({ ...def, ...existing });
      }
      // Already claimable — no change needed
    }
  });

  return newlyClaimable;
}

/**
 * Broadcast a message to all active tabs with content scripts.
 */
async function broadcastToTabs(message) {
  try {
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {
        // Tab might not have content script — ignore
      });
    });
  } catch (error) {
    console.error('[PixelPets SW] Broadcast error:', error);
  }
}

console.log('[PixelPets SW] Service Worker loaded (Risk A/B fixes active)');
