/**
 * Pixel Pets - Interaction Handler
 * Manages user interactions: petting, feeding, playing, and reactions
 */

class InteractionHandler {
  constructor(overlay) {
    this.overlay = overlay;
    this.feedMenuVisible = false;
    this.toyMenuVisible = false;
    this.interactionCooldown = 0;
    this.callbacks = {};
  }

  /**
   * Register callback for interaction events
   */
  on(event, callback) {
    this.callbacks[event] = callback;
  }

  /**
   * Emit an event
   */
  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event](data);
    }
  }

  /**
   * Handle pet click (petting)
   */
  handlePet(pet) {
    if (this.interactionCooldown > 0) return;
    this.interactionCooldown = 500;

    // Create heart particles
    this.overlay.createParticles('hearts', pet.x + pet.size / 2, pet.y, 6);

    // Update mood
    pet.mood = Math.min(100, pet.mood + INTERACTIONS.PET_MOOD_BOOST);
    pet.stats.petCount++;

    // Trigger happy animation
    this.emit('animation', { petId: pet.id, state: ANIMATION_STATES.HAPPY });
    this.emit('statsUpdate', { petId: pet.id, mood: pet.mood });

    // Show toast on first pet
    if (pet.stats.petCount === 1) {
      this.overlay.showToast('🎉 First pet! Your companion loves you!', 'success');
    }

    return { mood: pet.mood, animation: ANIMATION_STATES.HAPPY };
  }

  /**
   * Handle feeding
   */
  handleFeed(pet, foodType = 'fish') {
    if (this.interactionCooldown > 0) return;
    this.interactionCooldown = 1000;

    const food = FOOD_TYPES[foodType] || FOOD_TYPES.fish;

    // Create food particles
    this.overlay.createParticles('food', pet.x + pet.size / 2, pet.y, 4);

    // Update stats
    pet.mood = Math.min(100, pet.mood + food.moodBoost);
    pet.energy = Math.min(100, pet.energy + food.energyBoost);
    pet.stats.feedCount++;
    pet.lastFed = Date.now();

    // Trigger eating animation
    this.emit('animation', { petId: pet.id, state: ANIMATION_STATES.EATING });
    this.emit('statsUpdate', {
      petId: pet.id,
      mood: pet.mood,
      energy: pet.energy
    });

    this.overlay.showToast(`${food.emoji} ${pet.name} enjoyed the ${food.name}!`, 'success');

    return { mood: pet.mood, energy: pet.energy, animation: ANIMATION_STATES.EATING };
  }

  /**
   * Handle toy playing
   */
  handlePlay(pet, toyType = 'ball') {
    if (this.interactionCooldown > 0) return;
    this.interactionCooldown = 800;

    const toy = TOY_TYPES[toyType] || TOY_TYPES.ball;

    // Check if pet has enough energy
    if (pet.energy < toy.energyCost) {
      this.overlay.showToast(`💤 ${pet.name} is too tired to play!`, 'info');
      return null;
    }

    // Create sparkle particles
    this.overlay.createParticles('sparkles', pet.x + pet.size / 2, pet.y, 5);

    // Update stats
    pet.mood = Math.min(100, pet.mood + toy.moodBoost);
    pet.energy = Math.max(0, pet.energy - toy.energyCost);
    pet.stats.playCount++;

    // Trigger chasing animation
    this.emit('animation', { petId: pet.id, state: ANIMATION_STATES.JUMPING });
    this.emit('statsUpdate', {
      petId: pet.id,
      mood: pet.mood,
      energy: pet.energy
    });

    this.overlay.showToast(`${toy.emoji} ${pet.name} loves the ${toy.name}!`, 'success');

    return { mood: pet.mood, energy: pet.energy, animation: ANIMATION_STATES.JUMPING };
  }

  /**
   * Handle sleep trigger
   */
  handleSleep(pet) {
    this.emit('animation', { petId: pet.id, state: ANIMATION_STATES.SLEEPING });
    
    // Increment sleep count for achievements
    if (pet.stats) {
      pet.stats.sleepCount = (pet.stats.sleepCount || 0) + 1;
    }

    // Create sleep particles periodically
    const sleepInterval = setInterval(() => {
      if (pet.currentAnimation !== ANIMATION_STATES.SLEEPING) {
        clearInterval(sleepInterval);
        return;
      }
      this.overlay.createParticles('sleep_z', pet.x + pet.size / 2, pet.y - 10, 2);
      pet.energy = Math.min(100, pet.energy + 2);
    }, 3000);

    this.overlay.showToast(`💤 ${pet.name} is taking a nap...`, 'info');
    return { animation: ANIMATION_STATES.SLEEPING };
  }

  /**
   * Update cooldown timer
   */
  update(deltaTime) {
    if (this.interactionCooldown > 0) {
      this.interactionCooldown -= deltaTime * 1000;
    }
  }

  /**
   * Show the food selection popup
   */
  showFeedMenu(pet) {
    const menuX = pet.x + pet.size / 2;
    const menuY = pet.y;

    this.overlay.showPopupMenu(menuX, menuY, pet.id, {
      pet: () => this.handlePet(pet),
      feed: () => this.handleFeed(pet, 'fish'),
      play: () => this.handlePlay(pet, 'ball'),
      sleep: () => this.handleSleep(pet)
    });
  }

  /**
   * Check and apply mood/energy decay over time
   */
  applyDecay(pet, deltaTime) {
    const minutesPassed = deltaTime / 60;

    pet.mood = Math.max(0, pet.mood - INTERACTIONS.MOOD_DECAY_RATE * minutesPassed);
    pet.energy = Math.max(0, pet.energy - INTERACTIONS.ENERGY_DECAY_RATE * minutesPassed);

    // Auto-sleep when energy is very low
    if (pet.energy < INTERACTIONS.SLEEP_THRESHOLD) {
      return ANIMATION_STATES.SLEEPING;
    }

    return null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractionHandler;
}
