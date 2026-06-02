/**
 * Pixel Pets - Main Pet Engine
 * Orchestrates all pet systems: rendering, movement, animation, interactions
 * Contains the main game loop using requestAnimationFrame
 */

class PetEngine {
  constructor() {
    this.overlay = null;
    this.petFactory = null;
    this.storage = null;
    this.cursorTracker = null;
    this.pets = [];
    this.running = false;
    this.lastTime = 0;
    this.settings = null;
    this.animationFrameId = null;
    this.initialized = false;
    this.saveTimer = 0;
    this.saveInterval = 30; // Save every 30 seconds
  }

  /**
   * Initialize the pet engine
   */
  async initialize() {
    try {
      console.log('[PixelPets] Initializing Pet Engine...');

      // Initialize storage
      this.storage = new StorageManager();
      await this.storage.initialize();

      // Load settings
      this.settings = await this.storage.getSettings();

      // Check if extension is enabled
      if (!this.settings.enabled) {
        console.log('[PixelPets] Extension is disabled');
        return;
      }

      // Initialize overlay
      this.overlay = new OverlayManager();
      this.overlay.createShadowDOM();
      this.overlay.attachToPage();

      // Initialize pet factory
      this.petFactory = new PetFactory();

      // Initialize cursor tracker
      this.cursorTracker = new CursorTracker();

      // Load pets from storage
      await this.loadPets();

      // Start game loop
      this.start();

      // Listen for messages from popup/options
      this.setupMessageListener();

      // Listen for page visibility changes
      this.setupVisibilityListener();

      // Listen for scroll events (browser-aware behavior)
      this.setupScrollListener();

      this.initialized = true;
      console.log('[PixelPets] Pet Engine initialized successfully!');

    } catch (error) {
      console.error('[PixelPets] Initialization error:', error);
    }
  }

  /**
   * Load pets from storage and create instances
   */
  async loadPets() {
    const petData = await this.storage.getActivePets();
    
    if (petData.length === 0) {
      // Create default pet
      const defaultPet = this.petFactory.createPet('cat-classic', 'Whiskers');
      await this.storage.addPet(defaultPet);
      petData.push(defaultPet);
    }

    this.pets = petData.map(data => this.createPetInstance(data));
    console.log(`[PixelPets] Loaded ${this.pets.length} pet(s)`);
  }

  /**
   * Create a full pet instance with all controllers
   */
  createPetInstance(data) {
    const pet = {
      ...data,
      x: data.position?.x || Math.random() * (window.innerWidth - 100) + 50,
      y: data.position?.y || window.innerHeight - 100,
      stats: {
        petCount: 0,
        feedCount: 0,
        playCount: 0,
        sleepCount: 0,
        totalPlayTime: 0,
        ...(data.stats || {})
      },
      animation: new AnimationController(),
      movement: new MovementController(data.personality || 'loyal'),
      interaction: new InteractionHandler(this.overlay),
      currentAnimation: ANIMATION_STATES.IDLE
    };

    // Generate sprites
    const sprites = this.petFactory.generateSprites(pet.type, pet.size || 64);
    if (sprites) {
      pet.animation.setSprites(sprites);
      pet.animation.setAnimationSpeed(pet.animationSpeed || 1.0);
      pet.animation.play(ANIMATION_STATES.IDLE);
    }

    // Set up interaction callbacks
    pet.interaction.on('animation', (event) => {
      pet.animation.play(event.state);
      pet.currentAnimation = event.state;
    });

    pet.interaction.on('statsUpdate', (event) => {
      if (event.mood !== undefined) pet.mood = event.mood;
      if (event.energy !== undefined) pet.energy = event.energy;
    });

    // Create clickable zone
    this.overlay.createPetClickZone(
      pet.id,
      pet.x, pet.y,
      pet.size || 64,
      () => {
        pet.interaction.handlePet(pet);
      }
    );

    return pet;
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    console.log('[PixelPets] Game loop started');
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.running = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    console.log('[PixelPets] Game loop stopped');
  }

  /**
   * Main game loop
   */
  gameLoop(currentTime) {
    if (!this.running) return;

    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap at 100ms
    this.lastTime = currentTime;

    // Update all systems
    this.update(deltaTime);

    // Render
    this.render();

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  /**
   * Update all pet systems
   */
  update(deltaTime) {
    const cursorPos = this.cursorTracker.getPosition();
    const isInactive = this.cursorTracker.isInactive(INTERACTIONS.INACTIVITY_SLEEP_MS);

    // Auto-save timer
    this.saveTimer += deltaTime;
    if (this.saveTimer >= this.saveInterval) {
      this.saveTimer = 0;
      this.savePetStates();
    }

    // Update each pet
    this.pets.forEach((pet, index) => {
      // Update interaction cooldowns
      pet.interaction.update(deltaTime);

      // Apply mood/energy decay
      const decayResult = pet.interaction.applyDecay(pet, deltaTime);
      if (decayResult === ANIMATION_STATES.SLEEPING && pet.currentAnimation !== ANIMATION_STATES.SLEEPING) {
        pet.animation.play(ANIMATION_STATES.SLEEPING);
        pet.currentAnimation = ANIMATION_STATES.SLEEPING;
        this.overlay.createParticles('sleep_z', pet.x + pet.size / 2, pet.y - 10, 2);
      }

      // Handle inactivity
      if (isInactive && pet.currentAnimation !== ANIMATION_STATES.SLEEPING) {
        pet.animation.play(ANIMATION_STATES.SLEEPING);
        pet.currentAnimation = ANIMATION_STATES.SLEEPING;
      }

      // Sync the current animation state (AnimationController might have reverted to IDLE after a non-looping animation)
      pet.currentAnimation = pet.animation.getState();

      // Only move if not in a special animation state
      const specialStates = [
        ANIMATION_STATES.SLEEPING, ANIMATION_STATES.EATING,
        ANIMATION_STATES.HAPPY, ANIMATION_STATES.JUMPING
      ];

      if (!specialStates.includes(pet.currentAnimation)) {
        // Get collision avoidance offsets from other pets
        const otherPets = this.pets
          .filter((_, i) => i !== index)
          .map(p => ({ x: p.x, y: p.y }));
        
        const collision = pet.movement.avoidCollisions(
          pet.x, pet.y, pet.size || 64, otherPets
        );

        // Calculate next position
        const result = pet.movement.calculateNextPosition(
          pet.x, pet.y,
          cursorPos.x + collision.x,
          cursorPos.y + collision.y,
          deltaTime,
          pet.size || 64
        );

        pet.x = result.x;
        pet.y = result.y;
        pet.currentAnimation = result.state;

        // Update animation state
        pet.animation.setDirection(result.facingRight);
        if (result.state !== pet.animation.getState()) {
          pet.animation.play(result.state);
        }
      }

      // Update animation frame
      pet.animation.update(deltaTime);

      // Update click zone position
      this.overlay.createPetClickZone(
        pet.id,
        pet.x, pet.y,
        pet.size || 64,
        () => pet.interaction.handlePet(pet)
      );

      // Update right-click menu
      const clickZone = this.overlay.container?.querySelector(`[data-pet-id="${pet.id}"]`);
      if (clickZone) {
        // Re-attach contextmenu handler
        clickZone.oncontextmenu = (e) => {
          e.preventDefault();
          pet.interaction.showFeedMenu(pet);
        };
      }

      // Update pet play time
      if (pet.stats) {
        pet.stats.totalPlayTime += deltaTime * 1000;
      }
    });
  }

  /**
   * Render all pets
   */
  render() {
    const ctx = this.overlay.getCanvasContext();
    this.overlay.clearCanvas();

    this.pets.forEach(pet => {
      pet.animation.render(
        ctx,
        pet.x,
        pet.y,
        pet.size || 64,
        pet.opacity || 1.0
      );

      // Draw pet name if enabled
      if (this.settings?.showName !== false) {
        ctx.save();
        ctx.font = `bold ${Math.max(10, (pet.size || 64) / 5)}px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#2D1B69';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        const nameX = pet.x + (pet.size || 64) / 2;
        const nameY = pet.y - 8;
        ctx.strokeText(pet.name || 'Pet', nameX, nameY);
        ctx.fillText(pet.name || 'Pet', nameX, nameY);
        ctx.restore();
      }
    });
  }

  /**
   * Save all pet states to storage
   */
  async savePetStates() {
    try {
      for (const pet of this.pets) {
        await this.storage.updatePet(pet.id, {
          position: { x: pet.x, y: pet.y },
          mood: pet.mood,
          energy: pet.energy,
          stats: pet.stats,
          lastFed: pet.lastFed
        });
      }
    } catch (error) {
      if (error && error.toString().includes('Extension context invalidated')) {
        console.log('[PixelPets] Extension updated. Stopping orphaned engine. Please refresh the page.');
        this.stop();
        return;
      }
      console.error('[PixelPets] Error saving pet states:', error);
    }
  }

  /**
   * Set up message listener for popup/options communication
   */
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.type) {
        case 'GET_PET_STATE':
          sendResponse({
            pets: this.pets.map(p => ({
              id: p.id,
              name: p.name,
              type: p.type,
              mood: p.mood,
              energy: p.energy,
              personality: p.personality,
              stats: p.stats,
              active: p.active
            }))
          });
          return true;

        case 'PET_ACTION':
          this.handleRemoteAction(message);
          sendResponse({ success: true });
          return true;

        case 'UPDATE_SETTINGS':
          this.settings = { ...this.settings, ...message.settings };
          if (!this.settings.enabled) {
            this.stop();
            this.overlay.detachFromPage();
          } else if (!this.running) {
            this.overlay.attachToPage();
            this.start();
          }
          sendResponse({ success: true });
          return true;

        case 'SPAWN_PET':
          this.spawnPet(message.petType, message.petName).then(() => {
            sendResponse({ success: true });
          });
          return true;

        case 'CHANGE_PET_TYPE':
          this.changePetType(message.petId, message.newType).then(() => {
            sendResponse({ success: true });
          });
          return true;

        case 'UPDATE_PET':
          this.updatePetConfig(message.petId, message.updates).then(() => {
            sendResponse({ success: true });
          });
          return true;

        case 'REMOVE_PET':
          this.removePet(message.petId).then(() => {
            sendResponse({ success: true });
          });
          return true;

        case 'ACHIEVEMENT_UNLOCKED':
          // Show achievement toast in the overlay!
          this.overlay.showAchievementToast(message.achievement);
          return true;

        case 'PING':
          sendResponse({ alive: true, petCount: this.pets.length });
          return true;
      }
    });
  }

  /**
   * Handle remote actions from popup
   */
  handleRemoteAction(message) {
    const pet = this.pets.find(p => p.id === message.petId) || this.pets[0];
    if (!pet) return;

    // Bypass cooldown for remote popup clicks to allow rapid achievement progression
    pet.interaction.interactionCooldown = 0;

    switch (message.action) {
      case 'pet':
        pet.interaction.handlePet(pet);
        break;
      case 'feed':
        pet.interaction.handleFeed(pet, message.foodType || 'fish');
        break;
      case 'play':
        pet.interaction.handlePlay(pet, message.toyType || 'ball');
        break;
      case 'sleep':
        pet.interaction.handleSleep(pet);
        break;
    }
    
    // Force immediate save to evaluate achievements instantly
    this.savePetStates();
  }

  /**
   * Spawn a new pet
   */
  async spawnPet(petType, petName) {
    if (this.pets.length >= PERFORMANCE.MAX_PETS) {
      this.overlay.showToast(`Max ${PERFORMANCE.MAX_PETS} pets reached!`, 'error');
      return;
    }

    const newPetData = this.petFactory.createPet(petType, petName);
    const saved = await this.storage.addPet(newPetData);
    const petInstance = this.createPetInstance(saved);
    this.pets.push(petInstance);

    this.overlay.showToast(`🎉 ${petInstance.name} has arrived!`, 'success');
    this.overlay.createParticles('sparkles', petInstance.x + 32, petInstance.y, 8);
  }

  /**
   * Change a pet's type
   */
  async changePetType(petId, newType) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return;

    const typeInfo = PET_TYPES[newType];
    if (!typeInfo) return;

    pet.type = newType;
    
    // Regenerate sprites
    const sprites = this.petFactory.generateSprites(newType, pet.size || 64);
    if (sprites) {
      pet.animation.setSprites(sprites);
      pet.animation.play(ANIMATION_STATES.IDLE);
    }

    await this.storage.updatePet(petId, { type: newType });
    this.overlay.showToast(`✨ ${pet.name} transformed!`, 'success');
  }

  /**
   * Update pet configuration (size, speed, opacity, etc.)
   */
  async updatePetConfig(petId, updates) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return;

    // Apply updates
    Object.assign(pet, updates);

    // Regenerate sprites if size changed
    if (updates.size) {
      const sprites = this.petFactory.generateSprites(pet.type, updates.size);
      if (sprites) {
        pet.animation.setSprites(sprites);
      }
    }

    // Update speed
    if (updates.speed) {
      pet.movement.setPersonality(pet.personality);
    }

    // Update animation speed
    if (updates.animationSpeed) {
      pet.animation.setAnimationSpeed(updates.animationSpeed);
    }

    // Update personality
    if (updates.personality) {
      pet.movement.setPersonality(updates.personality);
    }

    await this.storage.updatePet(petId, updates);
  }

  /**
   * Remove a pet
   */
  async removePet(petId) {
    const index = this.pets.findIndex(p => p.id === petId);
    if (index === -1) return;

    const pet = this.pets[index];
    this.overlay.removePetClickZone(petId);
    this.pets.splice(index, 1);
    await this.storage.removePet(petId);

    this.overlay.showToast(`👋 ${pet.name} has left...`, 'info');

    // Ensure at least one pet remains
    if (this.pets.length === 0) {
      await this.spawnPet('cat-classic', 'Whiskers');
    }
  }

  /**
   * Set up page visibility listener
   */
  setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        if (this.settings?.enabled) {
          this.start();
          // Wake up sleeping pets
          this.pets.forEach(pet => {
            if (pet.currentAnimation === ANIMATION_STATES.SLEEPING) {
              pet.animation.play(ANIMATION_STATES.IDLE);
              pet.currentAnimation = ANIMATION_STATES.IDLE;
            }
          });
        }
      }
    });
  }

  /**
   * Set up scroll listener for browser-aware behavior
   */
  setupScrollListener() {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      // Make pets wobble during scroll
      this.pets.forEach(pet => {
        if (pet.currentAnimation !== ANIMATION_STATES.SLEEPING) {
          pet.y += Math.sin(Date.now() / 100) * 2;
        }
      });

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Stabilize after scroll ends
      }, 150);
    }, { passive: true });
  }

  /**
   * Destroy the engine and clean up
   */
  destroy() {
    this.stop();
    this.savePetStates();
    this.cursorTracker?.destroy();
    this.overlay?.detachFromPage();
    this.pets = [];
    this.initialized = false;
  }
}

// ═══════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════

// Wait for DOM to be ready, then initialize
(function() {
  // Check if we should respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const engine = new PetEngine();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      engine.initialize();
    });
  } else {
    engine.initialize();
  }

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    engine.destroy();
  });
})();
