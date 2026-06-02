/**
 * Pixel Pets - Popup Dashboard Logic
 * Handles popup UI interactions, pet display, and message passing
 */

document.addEventListener('DOMContentLoaded', () => {
  const popup = new PopupController();
  popup.initialize();
});

class PopupController {
  constructor() {
    this.currentPet = null;
    this.allPets = [];
    this.settings = null;
    this.isEnabled = true;
  }

  async initialize() {
    try {
      // Load settings
      this.settings = await this.sendMessage({ type: 'GET_SETTINGS' });
      this.isEnabled = this.settings?.enabled !== false;

      // Load pets
      this.allPets = await this.sendMessage({ type: 'GET_ALL_PETS' }) || [];
      this.currentPet = this.allPets.find(p => p.active) || this.allPets[0];

      // Also try to get live state from content script
      try {
        const liveState = await this.sendToActiveTab({ type: 'GET_PET_STATE' });
        if (liveState?.pets?.length > 0) {
          // Merge live stats with stored data
          liveState.pets.forEach(livePet => {
            const stored = this.allPets.find(p => p.id === livePet.id);
            if (stored) {
              stored.mood = livePet.mood;
              stored.energy = livePet.energy;
              stored.stats = livePet.stats;
            }
          });
        }
      } catch (e) {
        // Content script might not be loaded on this page
      }

      // Update UI
      this.updatePetDisplay();
      this.updateStats();
      this.updateToggle();
      this.updatePetList();

      // Render pet preview
      this.renderPetPreview();

      // Bind events
      this.bindEvents();

    } catch (error) {
      console.error('[PixelPets Popup] Init error:', error);
    }
  }

  /**
   * Send message to service worker
   */
  sendMessage(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response);
      });
    });
  }

  /**
   * Send message to active tab's content script
   */
  sendToActiveTab(message) {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        // Content scripts cannot run on chrome:// pages or edge:// pages
        if (tab && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
          chrome.tabs.sendMessage(tab.id, message, (response) => {
            // Check for lastError to suppress "Unchecked runtime.lastError" warnings
            if (chrome.runtime.lastError) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        } else {
          resolve(false);
        }
      });
    });
  }

  /**
   * Update pet display info
   */
  updatePetDisplay() {
    if (!this.currentPet) return;

    const petType = PET_TYPES[this.currentPet.type] || PET_TYPES['cat-classic'];
    const personality = PERSONALITIES[this.currentPet.personality] || PERSONALITIES.loyal;

    document.getElementById('pet-name').textContent = (this.currentPet.name || 'Pet').toUpperCase();
    document.getElementById('pet-type').textContent = `${petType.emoji} ${petType.name}`;
    document.getElementById('pet-personality').textContent = `${personality.emoji} ${personality.name}`;
  }

  /**
   * Update stat bars
   */
  updateStats() {
    if (!this.currentPet) return;

    const mood = Math.round(this.currentPet.mood || 0);
    const energy = Math.round(this.currentPet.energy || 0);

    document.getElementById('mood-bar').style.width = `${mood}%`;
    document.getElementById('mood-value').textContent = `${mood}%`;
    document.getElementById('energy-bar').style.width = `${energy}%`;
    document.getElementById('energy-value').textContent = `${energy}%`;
  }

  /**
   * Update toggle button state
   */
  updateToggle() {
    const indicator = document.getElementById('toggle-indicator');
    if (this.isEnabled) {
      indicator.className = 'toggle-indicator active';
    } else {
      indicator.className = 'toggle-indicator inactive';
    }
  }

  /**
   * Update pet list for multi-pet selector
   */
  updatePetList() {
    if (this.allPets.length <= 1) {
      document.getElementById('pet-selector-section').style.display = 'none';
      return;
    }

    document.getElementById('pet-selector-section').style.display = 'block';
    const listEl = document.getElementById('pet-list');
    listEl.innerHTML = '';

    this.allPets.forEach(pet => {
      const petType = PET_TYPES[pet.type] || PET_TYPES['cat-classic'];
      const item = document.createElement('div');
      item.className = `pet-list-item ${pet.id === this.currentPet?.id ? 'active' : ''}`;
      item.innerHTML = `
        <span class="pet-list-item-name">${petType.emoji} ${pet.name}</span>
        <span class="pet-list-item-type">${Math.round(pet.mood || 0)}% mood</span>
      `;
      item.addEventListener('click', () => {
        this.currentPet = pet;
        this.updatePetDisplay();
        this.updateStats();
        this.updatePetList();
        this.renderPetPreview();
      });
      listEl.appendChild(item);
    });
  }

  /**
   * Render pet sprite preview
   */
  renderPetPreview() {
    if (!this.currentPet) return;

    const canvas = document.getElementById('pet-preview-canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 80, 80);

    const factory = new PetFactory();
    const sprites = factory.generateSprites(this.currentPet.type, 80);
    
    if (sprites?.idle?.[0]) {
      ctx.drawImage(sprites.idle[0], 0, 0, 80, 80);
    }
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Toggle extension
    document.getElementById('btn-toggle').addEventListener('click', async () => {
      this.isEnabled = !this.isEnabled;
      await this.sendMessage({ type: 'SAVE_SETTINGS', settings: { enabled: this.isEnabled } });
      this.updateToggle();

      // Notify content scripts
      this.sendToActiveTab({ type: 'UPDATE_SETTINGS', settings: { enabled: this.isEnabled } });
    });

    // Pet action
    document.getElementById('btn-pet').addEventListener('click', () => {
      this.performAction('pet');
      this.animateButton(document.getElementById('btn-pet'));
    });

    // Feed action - toggle submenu
    document.getElementById('btn-feed').addEventListener('click', () => {
      const submenu = document.getElementById('feed-submenu');
      const playSubmenu = document.getElementById('play-submenu');
      playSubmenu.style.display = 'none';
      submenu.style.display = submenu.style.display === 'none' ? 'block' : 'none';
    });

    // Play action - toggle submenu
    document.getElementById('btn-play').addEventListener('click', () => {
      const submenu = document.getElementById('play-submenu');
      const feedSubmenu = document.getElementById('feed-submenu');
      feedSubmenu.style.display = 'none';
      submenu.style.display = submenu.style.display === 'none' ? 'block' : 'none';
    });

    // Feed submenu buttons
    document.querySelectorAll('[data-food]').forEach(btn => {
      btn.addEventListener('click', () => {
        const foodType = btn.dataset.food;
        this.performAction('feed', { foodType });
        document.getElementById('feed-submenu').style.display = 'none';
        this.animateButton(btn);
      });
    });

    // Play submenu buttons
    document.querySelectorAll('[data-toy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const toyType = btn.dataset.toy;
        this.performAction('play', { toyType });
        document.getElementById('play-submenu').style.display = 'none';
        this.animateButton(btn);
      });
    });

    // Mute button
    document.getElementById('btn-mute').addEventListener('click', async () => {
      const soundEnabled = this.settings?.soundEnabled;
      await this.sendMessage({ type: 'SAVE_SETTINGS', settings: { soundEnabled: !soundEnabled } });
      this.settings.soundEnabled = !soundEnabled;
      
      const muteBtn = document.getElementById('btn-mute');
      muteBtn.querySelector('span:first-child').textContent = this.settings.soundEnabled ? '🔊' : '🔇';
    });

    // Settings button
    document.getElementById('btn-settings').addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });

    // New Pet button
    document.getElementById('btn-new-pet').addEventListener('click', () => {
      this.showNewPetModal();
    });
  }

  /**
   * Perform an action on the current pet
   */
  async performAction(action, extra = {}) {
    if (!this.currentPet) return;

    // Send action to content script
    const sentToTab = await this.sendToActiveTab({
      type: 'PET_ACTION',
      petId: this.currentPet.id,
      action: action,
      ...extra
    });

    // Optimistically update local stats
    switch (action) {
      case 'pet':
        this.currentPet.mood = Math.min(100, (this.currentPet.mood || 0) + INTERACTIONS.PET_MOOD_BOOST);
        this.currentPet.stats.petCount = (this.currentPet.stats.petCount || 0) + 1;
        break;
      case 'feed':
        const food = FOOD_TYPES[extra.foodType] || FOOD_TYPES.fish;
        this.currentPet.mood = Math.min(100, (this.currentPet.mood || 0) + food.moodBoost);
        this.currentPet.energy = Math.min(100, (this.currentPet.energy || 0) + food.energyBoost);
        this.currentPet.stats.feedCount = (this.currentPet.stats.feedCount || 0) + 1;
        break;
      case 'play':
        const toy = TOY_TYPES[extra.toyType] || TOY_TYPES.ball;
        this.currentPet.mood = Math.min(100, (this.currentPet.mood || 0) + toy.moodBoost);
        this.currentPet.energy = Math.max(0, (this.currentPet.energy || 0) - toy.energyCost);
        this.currentPet.stats.playCount = (this.currentPet.stats.playCount || 0) + 1;
        break;
    }

    // Fallback: If we couldn't send to a content script (e.g. on Options page), save directly to background
    if (!sentToTab) {
      await this.sendMessage({ type: 'SAVE_PET', pet: this.currentPet });
    }

    this.updateStats();
  }

  /**
   * Animate button click feedback
   */
  animateButton(btn) {
    btn.style.transform = 'scale(1.15)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 150);
  }

  /**
   * Show new pet creation modal
   */
  showNewPetModal() {
    // Check max pets
    if (this.allPets.length >= PERFORMANCE.MAX_PETS) {
      alert(`Maximum ${PERFORMANCE.MAX_PETS} pets allowed!`);
      return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'new-pet-modal';

    let selectedType = 'cat-classic';

    const petOptions = Object.values(PET_TYPES).map(pet => `
      <div class="modal-pet-option ${pet.unlocked ? '' : 'locked'} ${pet.id === selectedType ? 'selected' : ''}" 
           data-type="${pet.id}" 
           ${pet.unlocked ? '' : 'title="Locked - Complete achievements to unlock!"'}>
        <span class="modal-pet-emoji">${pet.emoji}</span>
        <span class="modal-pet-name">${pet.name}</span>
      </div>
    `).join('');

    overlay.innerHTML = `
      <div class="modal-content">
        <h2 class="modal-title">CHOOSE YOUR PET</h2>
        <div class="modal-pet-grid">${petOptions}</div>
        <input type="text" class="modal-input" id="new-pet-name" placeholder="Pet name..." maxlength="20">
        <div class="modal-actions">
          <button class="modal-btn modal-btn-secondary" id="modal-cancel">CANCEL</button>
          <button class="modal-btn modal-btn-primary" id="modal-spawn">SPAWN!</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Pet type selection
    overlay.querySelectorAll('.modal-pet-option').forEach(option => {
      option.addEventListener('click', () => {
        const type = option.dataset.type;
        const petType = PET_TYPES[type];
        if (!petType?.unlocked) return;

        overlay.querySelectorAll('.modal-pet-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedType = type;
      });
    });

    // Cancel
    overlay.querySelector('#modal-cancel').addEventListener('click', () => {
      overlay.remove();
    });

    // Spawn
    overlay.querySelector('#modal-spawn').addEventListener('click', async () => {
      const name = document.getElementById('new-pet-name').value.trim() || PET_TYPES[selectedType].name;
      
      await this.sendToActiveTab({
        type: 'SPAWN_PET',
        petType: selectedType,
        petName: name
      });

      // Refresh pet list
      this.allPets = await this.sendMessage({ type: 'GET_ALL_PETS' }) || [];
      this.currentPet = this.allPets[this.allPets.length - 1];
      this.updatePetDisplay();
      this.updateStats();
      this.updatePetList();
      this.renderPetPreview();

      overlay.remove();
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }
}
