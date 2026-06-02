/**
 * Pixel Pets - Service Worker (Background Script)
 * Handles extension lifecycle, messaging, and persistence
 */

// Import constants
importScripts('../lib/constants.js');

// ═══════════════════════════════════════════
// INSTALLATION & UPDATE
// ═══════════════════════════════════════════

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[PixelPets SW] Extension installed/updated:', details.reason);

  if (details.reason === 'install') {
    // First time install - set defaults
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
      achievements: [],
      customPets: [],
      version: '1.0.0'
    };

    await chrome.storage.local.set(defaults);
    console.log('[PixelPets SW] Default settings saved');

    // Set up periodic auto-save alarm
    chrome.alarms.create('auto-save', { periodInMinutes: 5 });
    chrome.alarms.create('mood-decay', { periodInMinutes: 1 });

  } else if (details.reason === 'update') {
    // Handle data migration for updates
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
      // Apply passive mood/energy decay
      try {
        const data = await chrome.storage.local.get('pets');
        if (data.pets) {
          data.pets.forEach(pet => {
            pet.mood = Math.max(0, pet.mood - INTERACTIONS.MOOD_DECAY_RATE);
            pet.energy = Math.max(0, pet.energy - INTERACTIONS.ENERGY_DECAY_RATE);
          });
          await chrome.storage.local.set({ pets: data.pets });
        }
      } catch (error) {
        console.error('[PixelPets SW] Mood decay error:', error);
      }
      break;
  }
});

// ═══════════════════════════════════════════
// MESSAGE HANDLING
// ═══════════════════════════════════════════

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_SETTINGS':
      chrome.storage.local.get('settings', (data) => {
        sendResponse(data.settings || DEFAULT_SETTINGS);
      });
      return true;

    case 'SAVE_SETTINGS':
      chrome.storage.local.get('settings', (data) => {
        const updated = { ...data.settings, ...message.settings };
        chrome.storage.local.set({ settings: updated }, () => {
          // Broadcast settings change to all content scripts
          broadcastToTabs({ type: 'UPDATE_SETTINGS', settings: updated });
          sendResponse({ success: true });
        });
      });
      return true;

    case 'GET_ALL_PETS':
      chrome.storage.local.get('pets', (data) => {
        sendResponse(data.pets || []);
      });
      return true;

    case 'SAVE_PET':
      chrome.storage.local.get(['pets', 'achievements'], (data) => {
        const pets = data.pets || [];
        const index = pets.findIndex(p => p.id === message.pet.id);
        if (index >= 0) {
          pets[index] = { ...pets[index], ...message.pet };
        } else {
          pets.push(message.pet);
        }
        chrome.storage.local.set({ pets }, () => {
          // Evaluate Achievements after saving
          evaluateAchievements(pets[index] || message.pet, pets.length, data.achievements || []);
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

    case 'GET_ACHIEVEMENTS':
      chrome.storage.local.get('achievements', (data) => {
        sendResponse(data.achievements || []);
      });
      return true;

    case 'UNLOCK_ACHIEVEMENT':
      chrome.storage.local.get('achievements', (data) => {
        const achievements = data.achievements || [];
        if (!achievements.find(a => a.id === message.achievementId)) {
          const def = ACHIEVEMENTS.find(a => a.id === message.achievementId);
          if (def) {
            achievements.push({ ...def, unlocked: Date.now() });
            chrome.storage.local.set({ achievements });
          }
        }
        sendResponse({ success: true, achievements });
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
// HELPERS
// ═══════════════════════════════════════════

/**
 * Evaluate and unlock achievements based on pet stats
 */
function evaluateAchievements(pet, totalPets, currentAchievements) {
  const unlockedIds = currentAchievements.map(a => a.id);
  const newUnlocks = [];

  const stats = pet.stats || {};
  
  // Define check conditions
  const conditions = {
    'first-pet': true, // Getting here means they spawned a pet
    'caretaker': (stats.feedCount || 0) >= 10,
    'playmate': (stats.playCount || 0) >= 20,
    'collector': totalPets >= 3,
    'night-owl': (stats.totalPlayTime || 0) >= 36000000,
    'best-friend': (stats.petCount || 0) >= 100,
    'gourmet': (stats.feedCount || 0) >= 50,
    'energizer': pet.energy >= 90,
    'happy-pet': pet.mood >= 100,
    'dreamer': (stats.sleepCount || 0) >= 10
  };

  // Check all achievements
  ACHIEVEMENTS.forEach(achievement => {
    if (!unlockedIds.includes(achievement.id) && conditions[achievement.id]) {
      const unlocked = { ...achievement, unlocked: Date.now() };
      currentAchievements.push(unlocked);
      newUnlocks.push(unlocked);
    }
  });

  // Save and broadcast new unlocks
  if (newUnlocks.length > 0) {
    chrome.storage.local.set({ achievements: currentAchievements }, () => {
      newUnlocks.forEach(achievement => {
        console.log('[PixelPets SW] Achievement Unlocked!', achievement.title);
        broadcastToTabs({ type: 'ACHIEVEMENT_UNLOCKED', achievement });
      });
    });
  }
}

/**
 * Broadcast a message to all active tabs
 */
async function broadcastToTabs(message) {
  try {
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {
        // Tab might not have content script - ignore
      });
    });
  } catch (error) {
    console.error('[PixelPets SW] Broadcast error:', error);
  }
}

// ═══════════════════════════════════════════
// STORAGE CHANGE LISTENER
// ═══════════════════════════════════════════

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;

  if (changes.settings) {
    console.log('[PixelPets SW] Settings changed:', changes.settings.newValue);
  }
});

console.log('[PixelPets SW] Service Worker loaded');
