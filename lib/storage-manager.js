/**
 * Pixel Pets - Storage Manager
 * Wrapper around Chrome Storage API with validation and defaults
 */

class StorageManager {
  constructor() {
    this.cache = {};
    this.initialized = false;
    // RISK C FIX — Write queue mutex.
    // All writes chain off this promise so they execute serially.
    // This prevents race conditions when popup and content script
    // both write to chrome.storage.local concurrently.
    this.writeQueue = Promise.resolve();
  }

  /**
   * Initialize storage with defaults if first run
   */
  async initialize() {
    try {
      const data = await this.getAll();
      
      if (!data.settings) {
        await this.setDefaults();
      }
      
      this.cache = await this.getAll();
      this.initialized = true;
      return this.cache;
    } catch (error) {
      console.error('[PixelPets Storage] Initialization error:', error);
      await this.setDefaults();
      this.initialized = true;
      return this.cache;
    }
  }

  /**
   * Set default values for first-time users
   */
  async setDefaults() {
    const defaults = {
      settings: { ...DEFAULT_SETTINGS },
      pets: [{ ...DEFAULT_PET, id: `pet-${Date.now()}`, stats: { ...DEFAULT_PET.stats, created: Date.now() } }],
      accessories: {
        owned: [],
        unlocked: ['cat-classic', 'cat-black', 'cat-white', 'cat-orange', 'puppy', 'bunny', 'fox']
      },
      achievements: [],
      customPets: [],
      version: '1.0.0'
    };

    await this.set(defaults);
    this.cache = defaults;
    return defaults;
  }

  /**
   * Get all stored data
   */
  async getAll() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Get specific key from storage
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key]);
        }
      });
    });
  }

  /**
   * Set data in storage — RISK C FIX: serialized via write queue mutex.
   * All callers (popup, content script, options) share the same queue,
   * ensuring writes never interleave regardless of call timing.
   */
  async set(data) {
    // Chain onto the existing queue — this write won't start until all
    // prior writes in the queue have resolved.
    this.writeQueue = this.writeQueue.then(() => this._rawSet(data));
    return this.writeQueue;
  }

  /**
   * Internal: perform the actual chrome.storage.local.set() call.
   * Never call this directly — always go through set() for serialization.
   */
  _rawSet(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(data, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          // Update local cache
          Object.assign(this.cache, data);
          resolve();
        }
      });
    });
  }


  /**
   * Update specific settings
   */
  async updateSettings(newSettings) {
    const current = await this.get('settings') || { ...DEFAULT_SETTINGS };
    const updated = { ...current, ...newSettings };
    await this.set({ settings: updated });
    return updated;
  }

  /**
   * Get active pets
   */
  async getActivePets() {
    const pets = await this.get('pets') || [];
    return pets.filter(p => p.active);
  }

  /**
   * Get all pets
   */
  async getAllPets() {
    return await this.get('pets') || [];
  }

  /**
   * Update specific pet data
   */
  async updatePet(petId, updates) {
    const pets = await this.get('pets') || [];
    const index = pets.findIndex(p => p.id === petId);
    
    if (index !== -1) {
      pets[index] = { ...pets[index], ...updates };
      await this.set({ pets });
      return pets[index];
    }
    return null;
  }

  /**
   * Add a new pet
   */
  async addPet(petConfig) {
    const pets = await this.get('pets') || [];
    
    if (pets.length >= PERFORMANCE.MAX_PETS) {
      throw new Error(`Maximum ${PERFORMANCE.MAX_PETS} pets allowed`);
    }
    
    const newPet = {
      ...DEFAULT_PET,
      ...petConfig,
      id: `pet-${Date.now()}`,
      stats: { ...DEFAULT_PET.stats, created: Date.now() }
    };
    
    pets.push(newPet);
    await this.set({ pets });
    return newPet;
  }

  /**
   * Remove a pet
   */
  async removePet(petId) {
    let pets = await this.get('pets') || [];
    pets = pets.filter(p => p.id !== petId);
    await this.set({ pets });
    return pets;
  }

  /**
   * Unlock an achievement
   */
  async unlockAchievement(achievementId) {
    const achievements = await this.get('achievements') || [];
    
    if (achievements.find(a => a.id === achievementId)) {
      return null; // Already unlocked
    }
    
    const achievementDef = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievementDef) return null;
    
    const unlocked = {
      ...achievementDef,
      unlocked: Date.now()
    };
    
    achievements.push(unlocked);
    await this.set({ achievements });
    return unlocked;
  }

  /**
   * Get settings
   */
  async getSettings() {
    return await this.get('settings') || { ...DEFAULT_SETTINGS };
  }

  /**
   * Save pet state (position, mood, energy)
   */
  async savePetState(petId, state) {
    return this.updatePet(petId, state);
  }

  /**
   * Increment pet stat
   */
  async incrementStat(petId, statName, amount = 1) {
    const pets = await this.get('pets') || [];
    const pet = pets.find(p => p.id === petId);
    
    if (pet && pet.stats) {
      pet.stats[statName] = (pet.stats[statName] || 0) + amount;
      await this.set({ pets });
      return pet.stats;
    }
    return null;
  }
}

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
