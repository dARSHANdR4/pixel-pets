/**
 * Pixel Pets - Settings Page Logic
 * Handles tab navigation, settings persistence, and UI updates
 */

document.addEventListener('DOMContentLoaded', () => {
  const options = new OptionsController();
  options.initialize();
});

class OptionsController {
  constructor() {
    this.settings = {};
    this.pets = [];
    this.achievements = [];
    this.currentPetIndex = 0;
  }

  async initialize() {
    try {
      // Load data
      this.settings = await this.sendMessage({ type: 'GET_SETTINGS' }) || { ...DEFAULT_SETTINGS };
      this.pets = await this.sendMessage({ type: 'GET_ALL_PETS' }) || [];
      this.achievements = await this.sendMessage({ type: 'GET_ACHIEVEMENTS' }) || [];

      // Populate UI
      this.populateGeneralTab();
      this.populatePetsTab();
      this.populateAppearanceTab();
      this.populateAudioTab();
      this.populateAdvancedTab();

      // Bind events
      this.bindTabNavigation();
      this.bindGeneralEvents();
      this.bindPetsEvents();
      this.bindAppearanceEvents();
      this.bindAudioEvents();
      this.bindAdvancedEvents();
      this.bindSaveEvents();

    } catch (error) {
      console.error('[PixelPets Options] Init error:', error);
    }
    
    // Listen for background updates to dynamically refresh UI
    chrome.storage.onChanged.addListener(async (changes, areaName) => {
      if (areaName === 'local') {
        let needsRender = false;
        if (changes.pets) {
          this.pets = changes.pets.newValue || [];
          needsRender = true;
        }
        if (changes.achievements) {
          this.achievements = changes.achievements.newValue || [];
          needsRender = true;
        }
        if (needsRender) {
          // Re-render the active tab sections
          const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
          if (activeTab === 'advanced') {
            this.renderAchievements();
          } else if (activeTab === 'pets') {
            this.renderPetsList();
          }
        }
      }
    });

    // Listen for achievement unlocks specifically for the options page toast
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'ACHIEVEMENT_UNLOCKED') {
        this.showAchievementToast(message.achievement);
      }
    });

    // Listen for storage changes to enable 'soft refresh' of progress bars while page is open
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        let needsRender = false;
        
        if (changes.pets) {
          this.pets = changes.pets.newValue || [];
          needsRender = true;
        }
        
        if (changes.achievements) {
          this.achievements = changes.achievements.newValue || [];
          needsRender = true;
        }

        if (needsRender) {
          const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
          if (activeTab === 'advanced') {
            this.renderAchievements();
          } else if (activeTab === 'pets') {
            this.renderPetsList();
          }
        }
      }
    });
  }

  // ═══════════════════════════════════════════
  // MESSAGE PASSING
  // ═══════════════════════════════════════════

  sendMessage(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response);
      });
    });
  }

  // ═══════════════════════════════════════════
  // TAB NAVIGATION
  // ═══════════════════════════════════════════

  bindTabNavigation() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');
      });
    });
  }

  // ═══════════════════════════════════════════
  // GENERAL TAB
  // ═══════════════════════════════════════════

  populateGeneralTab() {
    document.getElementById('setting-enabled').checked = this.settings.enabled !== false;
    document.getElementById('setting-autostart').checked = this.settings.autoStartup !== false;
    document.getElementById('setting-showname').checked = this.settings.showName !== false;
  }

  bindGeneralEvents() {
    // These are saved via the save button
  }

  // ═══════════════════════════════════════════
  // UI FEEDBACK
  // ═══════════════════════════════════════════

  showSaveStatus(message, type = 'success') {
    const status = document.getElementById('save-status');
    status.textContent = message;
    status.style.background = type === 'success' ? 'var(--lime)' : 'var(--magenta)';
    status.style.color = type === 'success' ? 'var(--charcoal)' : 'var(--off-white)';
    
    // Animate in
    status.style.animation = 'slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

    setTimeout(() => {
      status.style.animation = 'slideOutRight 0.3s ease-in forwards';
    }, 3000);
  }

  showAchievementToast(achievement) {
    const toast = document.createElement('div');
    
    let bg, shadow, badgeColor, textColor;
    switch(achievement.tier) {
      case 'gold':
        bg = '#FFD700'; shadow = '#00D9FF'; badgeColor = '#1A1A1A'; textColor = '#1A1A1A';
        break;
      case 'silver':
        bg = '#C0C0C0'; shadow = '#FF1B9C'; badgeColor = '#FF1B9C'; textColor = '#1A1A1A';
        break;
      case 'bronze':
      default:
        bg = '#CD7F32'; shadow = '#1A1A1A'; badgeColor = '#BFFF00'; textColor = '#FFFFFF';
        break;
    }

    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${bg};
      border: 4px solid #1A1A1A;
      box-shadow: 6px 6px 0 ${shadow};
      color: ${textColor};
      padding: 16px 24px;
      font-family: 'Inter', sans-serif;
      z-index: 9999;
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 16px;
      animation: slideInRight 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    // Ensure keyframes exist in head
    if (!document.getElementById('achievement-styles')) {
      const style = document.createElement('style');
      style.id = 'achievement-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(120%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    toast.innerHTML = `
      <div style="font-size: 32px; background: #FFFFFF; border: 3px solid #1A1A1A; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; box-shadow: 2px 2px 0 #1A1A1A;">
        ${achievement.icon}
      </div>
      <div>
        <div style="font-size: 10px; font-weight: 800; letter-spacing: 2px; color: ${badgeColor}; text-transform: uppercase;">${achievement.tier} UNLOCKED</div>
        <div style="font-size: 18px; font-weight: 800; margin-top: 4px; text-shadow: ${textColor === '#FFFFFF' ? '1px 1px 0 #1A1A1A' : 'none'};">${achievement.title}</div>
      </div>
    `;

    document.body.appendChild(toast);

    // Remove after 5 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 300ms ease-in forwards';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // ═══════════════════════════════════════════
  // PETS TAB
  // ═══════════════════════════════════════════

  populatePetsTab() {
    this.renderPetsList();
    this.renderPetSelectionGrid();
    this.renderPersonalityGrid();
  }

  renderPetsList() {
    const container = document.getElementById('pets-list');
    container.innerHTML = '';

    this.pets.forEach((pet, index) => {
      const petType = PET_TYPES[pet.type] || PET_TYPES['cat-classic'];
      const personality = PERSONALITIES[pet.personality] || PERSONALITIES.loyal;

      const card = document.createElement('div');
      card.className = `pet-list-card ${index === this.currentPetIndex ? 'active' : ''}`;
      card.innerHTML = `
        <div class="pet-list-info">
          <span class="pet-list-emoji">${petType.emoji}</span>
          <div class="pet-list-details">
            <span class="pet-list-name">${pet.name}</span>
            <span class="pet-list-meta">${petType.name} • ${personality.name} • Mood: ${Math.round(pet.mood || 0)}%</span>
          </div>
        </div>
        <div class="pet-list-actions">
          <button class="pet-list-btn" data-action="select" data-index="${index}">SELECT</button>
          ${this.pets.length > 1 ? `<button class="pet-list-btn delete" data-action="delete" data-index="${index}">✕</button>` : ''}
        </div>
      `;
      container.appendChild(card);
    });

    // Bind list actions
    container.querySelectorAll('[data-action="select"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentPetIndex = parseInt(btn.dataset.index);
        this.renderPetsList();
        this.populateAppearanceTab();
      });
    });

    container.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const index = parseInt(btn.dataset.index);
        if (confirm(`Remove ${this.pets[index].name}?`)) {
          await this.sendMessage({
            type: 'REMOVE_PET',
            petId: this.pets[index].id
          });
          this.pets.splice(index, 1);
          if (this.currentPetIndex >= this.pets.length) {
            this.currentPetIndex = Math.max(0, this.pets.length - 1);
          }
          this.renderPetsList();
          this.showSaveStatus('👋 Pet removed', 'success');
        }
      });
    });
  }

  renderPetSelectionGrid() {
    const grid = document.getElementById('pet-selection-grid');
    grid.innerHTML = '';

    const currentPet = this.pets[this.currentPetIndex];

    Object.values(PET_TYPES).forEach(petType => {
      const card = document.createElement('div');
      card.className = `pet-type-card ${currentPet?.type === petType.id ? 'selected' : ''} ${petType.unlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <span class="pet-type-emoji">${petType.emoji}</span>
        <span class="pet-type-name">${petType.name}</span>
        <span class="pet-type-status">${petType.unlocked ? petType.description : '🔒 Locked'}</span>
      `;

      if (petType.unlocked) {
        card.addEventListener('click', () => {
          if (currentPet) {
            currentPet.type = petType.id;
            grid.querySelectorAll('.pet-type-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
          }
        });
      }

      grid.appendChild(card);
    });
  }

  renderPersonalityGrid() {
    const grid = document.getElementById('personality-grid');
    grid.innerHTML = '';

    const currentPet = this.pets[this.currentPetIndex];

    Object.values(PERSONALITIES).forEach(p => {
      const card = document.createElement('div');
      card.className = `personality-card ${currentPet?.personality === p.id ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="personality-emoji">${p.emoji}</div>
        <div class="personality-name">${p.name}</div>
        <div class="personality-desc">${p.description}</div>
      `;

      card.addEventListener('click', () => {
        if (currentPet) {
          currentPet.personality = p.id;
          grid.querySelectorAll('.personality-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        }
      });

      grid.appendChild(card);
    });
  }

  bindPetsEvents() {
    document.getElementById('btn-add-pet').addEventListener('click', async () => {
      if (this.pets.length >= PERFORMANCE.MAX_PETS) {
        this.showSaveStatus(`Max ${PERFORMANCE.MAX_PETS} pets!`, 'error');
        return;
      }

      const name = prompt('Enter pet name:', 'New Pet');
      if (!name) return;

      const newPet = {
        ...DEFAULT_PET,
        id: `pet-${Date.now()}`,
        name: name,
        type: 'cat-classic',
        active: true,
        stats: { ...DEFAULT_PET.stats, created: Date.now() }
      };

      await this.sendMessage({ type: 'SAVE_PET', pet: newPet });
      this.pets.push(newPet);
      this.currentPetIndex = this.pets.length - 1;
      this.renderPetsList();
      this.renderPetSelectionGrid();
      this.renderPersonalityGrid();
      this.showSaveStatus('✅ Pet added!', 'success');
    });
  }

  // ═══════════════════════════════════════════
  // APPEARANCE TAB
  // ═══════════════════════════════════════════

  populateAppearanceTab() {
    const pet = this.pets[this.currentPetIndex];
    if (!pet) return;

    document.getElementById('slider-size').value = pet.size || 64;
    document.getElementById('value-size').textContent = `${pet.size || 64}px`;

    document.getElementById('slider-speed').value = (pet.speed || 1.0) * 100;
    document.getElementById('value-speed').textContent = `${(pet.speed || 1.0).toFixed(1)}x`;

    document.getElementById('slider-animspeed').value = (pet.animationSpeed || 1.0) * 100;
    document.getElementById('value-animspeed').textContent = `${(pet.animationSpeed || 1.0).toFixed(1)}x`;

    document.getElementById('slider-opacity').value = (pet.opacity || 1.0) * 100;
    document.getElementById('value-opacity').textContent = `${Math.round((pet.opacity || 1.0) * 100)}%`;

    document.getElementById('input-petname').value = pet.name || '';
  }

  bindAppearanceEvents() {
    const sliders = [
      { id: 'slider-size', value: 'value-size', format: v => `${v}px`, key: 'size', transform: v => parseInt(v) },
      { id: 'slider-speed', value: 'value-speed', format: v => `${(v / 100).toFixed(1)}x`, key: 'speed', transform: v => v / 100 },
      { id: 'slider-animspeed', value: 'value-animspeed', format: v => `${(v / 100).toFixed(1)}x`, key: 'animationSpeed', transform: v => v / 100 },
      { id: 'slider-opacity', value: 'value-opacity', format: v => `${v}%`, key: 'opacity', transform: v => v / 100 }
    ];

    sliders.forEach(slider => {
      const el = document.getElementById(slider.id);
      const valueEl = document.getElementById(slider.value);

      el.addEventListener('input', () => {
        const val = el.value;
        valueEl.textContent = slider.format(val);

        const pet = this.pets[this.currentPetIndex];
        if (pet) {
          pet[slider.key] = slider.transform(val);
        }
      });
    });

    document.getElementById('btn-rename').addEventListener('click', () => {
      const name = document.getElementById('input-petname').value.trim();
      if (!name) return;

      const pet = this.pets[this.currentPetIndex];
      if (pet) {
        pet.name = name;
        this.renderPetsList();
        this.showSaveStatus('✅ Pet renamed!', 'success');
      }
    });
  }

  // ═══════════════════════════════════════════
  // AUDIO TAB
  // ═══════════════════════════════════════════

  populateAudioTab() {
    document.getElementById('setting-sound').checked = this.settings.soundEnabled || false;
    document.getElementById('slider-volume').value = this.settings.soundVolume || 50;
    document.getElementById('value-volume').textContent = `${this.settings.soundVolume || 50}%`;
  }

  bindAudioEvents() {
    document.getElementById('slider-volume').addEventListener('input', (e) => {
      document.getElementById('value-volume').textContent = `${e.target.value}%`;
    });
  }

  // ═══════════════════════════════════════════
  // ADVANCED TAB
  // ═══════════════════════════════════════════

  populateAdvancedTab() {
    document.getElementById('setting-performance').checked = this.settings.performanceMode || false;
    document.getElementById('setting-debug').checked = this.settings.debugMode || false;

    this.renderAchievements();
  }

  renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';

    const currentPet = this.pets[this.currentPetIndex] || DEFAULT_PET;
    const stats = currentPet.stats || {};
    
    // Calculate total unlocked
    const totalUnlocked = ACHIEVEMENTS.reduce((sum, ach) => {
      return sum + (this.achievements.find(a => a.id === ach.id) ? 1 : 0);
    }, 0);

    // Update Mega Progress Bar
    const megaPercent = (totalUnlocked / ACHIEVEMENTS.length) * 100;
    document.getElementById('mega-progress-text').textContent = `${totalUnlocked} / ${ACHIEVEMENTS.length} Unlocked`;
    document.getElementById('mega-progress-fill').style.width = `${megaPercent}%`;

    ACHIEVEMENTS.forEach(ach => {
      const unlocked = this.achievements.find(a => a.id === ach.id);
      const card = document.createElement('div');
      card.className = `achievement-card tier-${ach.tier || 'bronze'} ${unlocked ? 'unlocked' : 'locked'}`;
      
      // Calculate individual progress
      let progress = 0;
      let currentValue = 0;
      
      if (!unlocked) {
        if (ach.statKey === 'uniquePets') {
          // Special case for collector
          const uniqueIds = new Set(this.pets.map(p => p.type));
          currentValue = uniqueIds.size;
        } else if (ach.statKey === 'energy') {
          currentValue = currentPet.energy || 0;
        } else if (ach.statKey === 'mood') {
          currentValue = currentPet.mood || 0;
        } else {
          currentValue = stats[ach.statKey] || 0;
        }
        
        progress = Math.min(100, (currentValue / ach.max) * 100);
      } else {
        progress = 100;
        currentValue = ach.max;
      }

      // Format value based on type (time vs raw number)
      let displayValue = currentValue;
      let displayMax = ach.max;
      if (ach.statKey === 'totalPlayTime') {
        displayValue = Math.floor(currentValue / 3600000) + 'h';
        displayMax = Math.floor(ach.max / 3600000) + 'h';
      }

      card.innerHTML = `
        <div class="achievement-header">
          <span class="achievement-icon">${unlocked ? ach.icon : '🔒'}</span>
          <div class="achievement-info">
            <div class="achievement-title">
              ${ach.title}
              <span class="achievement-tier">${ach.tier.toUpperCase()}</span>
            </div>
            <span class="achievement-desc">${ach.description}</span>
          </div>
        </div>
        ${!unlocked ? `
        <div class="achievement-progress-bg">
          <div class="achievement-progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="achievement-progress-text">${displayValue} / ${displayMax} (${Math.round(progress)}%)</div>
        ` : `
        <div class="achievement-progress-text" style="color: var(--lime); font-size: 11px; font-weight: bold;">✓ COMPLETED</div>
        `}
      `;
      grid.appendChild(card);
    });
  }

  bindAdvancedEvents() {
    // Export data
    document.getElementById('btn-export').addEventListener('click', async () => {
      const data = await chrome.storage.local.get(null);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pixel-pets-data.json';
      a.click();
      URL.revokeObjectURL(url);
      this.showSaveStatus('📦 Data exported!', 'success');
    });

    // Import data
    document.getElementById('btn-import').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          const text = await file.text();
          const data = JSON.parse(text);
          await chrome.storage.local.set(data);
          this.showSaveStatus('📥 Data imported! Reloading...', 'success');
          setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
          this.showSaveStatus('❌ Invalid file', 'error');
        }
      });
      input.click();
    });

    // Reset all data
    document.getElementById('btn-reset').addEventListener('click', async () => {
      if (confirm('⚠️ This will reset ALL data including pets, achievements, and settings. Are you sure?')) {
        await chrome.storage.local.clear();
        this.showSaveStatus('🗑️ Data reset! Reloading...', 'success');
        setTimeout(() => window.location.reload(), 1500);
      }
    });
  }

  // ═══════════════════════════════════════════
  // SAVE / RESET
  // ═══════════════════════════════════════════

  bindSaveEvents() {
    document.getElementById('btn-save').addEventListener('click', () => this.saveAll());
    document.getElementById('btn-defaults').addEventListener('click', () => this.resetToDefaults());
  }

  async saveAll() {
    try {
      // Collect settings
      const newSettings = {
        enabled: document.getElementById('setting-enabled').checked,
        autoStartup: document.getElementById('setting-autostart').checked,
        showName: document.getElementById('setting-showname').checked,
        soundEnabled: document.getElementById('setting-sound').checked,
        soundVolume: parseInt(document.getElementById('slider-volume').value),
        performanceMode: document.getElementById('setting-performance').checked,
        debugMode: document.getElementById('setting-debug').checked
      };

      // Save settings
      await this.sendMessage({ type: 'SAVE_SETTINGS', settings: newSettings });

      // Save each pet
      for (const pet of this.pets) {
        await this.sendMessage({ type: 'SAVE_PET', pet });
      }

      // Broadcast to content scripts
      try {
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
          try {
            await chrome.tabs.sendMessage(tab.id, { type: 'UPDATE_SETTINGS', settings: newSettings });
            
            // Update each pet in content script
            for (const pet of this.pets) {
              await chrome.tabs.sendMessage(tab.id, {
                type: 'UPDATE_PET',
                petId: pet.id,
                updates: {
                  size: pet.size,
                  speed: pet.speed,
                  opacity: pet.opacity,
                  animationSpeed: pet.animationSpeed,
                  personality: pet.personality,
                  type: pet.type,
                  name: pet.name
                }
              });
            }
          } catch (e) {
            // Tab might not have content script
          }
        }
      } catch (e) { /* ignore */ }

      this.showSaveStatus('✅ Settings saved!', 'success');

    } catch (error) {
      console.error('[PixelPets Options] Save error:', error);
      this.showSaveStatus('❌ Error saving', 'error');
    }
  }

  async resetToDefaults() {
    if (!confirm('Reset all settings to defaults?')) return;

    this.settings = { ...DEFAULT_SETTINGS };
    this.populateGeneralTab();
    this.populateAudioTab();
    this.populateAdvancedTab();

    if (this.pets[this.currentPetIndex]) {
      Object.assign(this.pets[this.currentPetIndex], {
        size: 64,
        speed: 1.0,
        opacity: 1.0,
        animationSpeed: 1.0,
        personality: 'loyal'
      });
      this.populateAppearanceTab();
    }

    this.showSaveStatus('↩️ Reset to defaults (click Save to apply)', 'success');
  }

  showSaveStatus(message, type) {
    const el = document.getElementById('save-status');
    el.textContent = message;
    el.className = `save-status ${type}`;

    setTimeout(() => {
      el.textContent = '';
      el.className = 'save-status';
    }, 4000);
  }
}
