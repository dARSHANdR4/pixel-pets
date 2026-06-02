/**
 * Pixel Pets - Movement Controller
 * Handles cursor tracking, movement calculations, and personality-based behaviors
 */

class CursorTracker {
  constructor() {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.prevX = this.x;
    this.prevY = this.y;
    this.velocity = 0;
    this.isActive = true;
    this.lastMoveTime = Date.now();

    this._onMouseMove = this._onMouseMove.bind(this);
    document.addEventListener('mousemove', this._onMouseMove, { passive: true });
  }

  _onMouseMove(e) {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x = e.clientX;
    this.y = e.clientY;
    this.lastMoveTime = Date.now();
    this.isActive = true;

    // Calculate velocity
    const dx = this.x - this.prevX;
    const dy = this.y - this.prevY;
    this.velocity = Math.sqrt(dx * dx + dy * dy);
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getVelocity() {
    return this.velocity;
  }

  getTimeSinceLastMove() {
    return Date.now() - this.lastMoveTime;
  }

  isInactive(thresholdMs = 30000) {
    return Date.now() - this.lastMoveTime > thresholdMs;
  }

  destroy() {
    document.removeEventListener('mousemove', this._onMouseMove);
  }
}

class MovementController {
  constructor(personality = 'loyal') {
    this.personality = PERSONALITIES[personality] || PERSONALITIES.loyal;
    this.velocityX = 0;
    this.velocityY = 0;
    this.movementState = ANIMATION_STATES.IDLE;
    this.facingRight = true;
    this.idleTimer = 0;
    this.explorationTarget = null;
    this.explorationTimer = 0;
    this.zoomieTimer = 0;
    this.isZooming = false;
    this.wanderAngle = 0;
  }

  /**
   * Set the personality type
   */
  setPersonality(personalityType) {
    this.personality = PERSONALITIES[personalityType] || PERSONALITIES.loyal;
  }

  /**
   * Calculate the next position based on cursor, personality, and time
   */
  calculateNextPosition(petX, petY, cursorX, cursorY, deltaTime, petSize) {
    const dx = cursorX - petX;
    const dy = cursorY - petY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Determine movement target based on personality
    let targetX = cursorX;
    let targetY = cursorY;
    let personalityModifier = 1;

    switch (this.personality.id) {
      case 'lazy':
        personalityModifier = this._lazyBehavior(distance, deltaTime);
        break;
      case 'energetic':
        personalityModifier = this._energeticBehavior(distance, deltaTime);
        targetX += (Math.random() - 0.5) * 50 * (this.isZooming ? 3 : 1);
        targetY += (Math.random() - 0.5) * 50 * (this.isZooming ? 3 : 1);
        break;
      case 'curious':
        const explorationResult = this._curiousBehavior(petX, petY, cursorX, cursorY, distance, deltaTime);
        targetX = explorationResult.x;
        targetY = explorationResult.y;
        break;
      case 'loyal':
        // Default - stays close to cursor
        break;
      case 'chaotic':
        const chaosResult = this._chaoticBehavior(petX, petY, cursorX, cursorY, distance, deltaTime);
        targetX = chaosResult.x;
        targetY = chaosResult.y;
        personalityModifier = chaosResult.speed;
        break;
    }

    // Determine movement state
    const stopDist = MOVEMENT.STOP_THRESHOLD + this.personality.followDistance;
    const walkDist = MOVEMENT.WALK_THRESHOLD + this.personality.followDistance;
    const runDist = MOVEMENT.RUN_THRESHOLD + this.personality.followDistance;

    if (distance < stopDist) {
      this.movementState = ANIMATION_STATES.IDLE;
      this.idleTimer += deltaTime;

      // Check for idle behaviors
      if (this.idleTimer > 3 && Math.random() < this.personality.idleChance * deltaTime) {
        this.movementState = ANIMATION_STATES.LOOKING_AROUND;
      }
      if (this.idleTimer > 10 && Math.random() < this.personality.sleepChance * deltaTime) {
        this.movementState = ANIMATION_STATES.SLEEPING;
      }

      return { x: petX, y: petY, state: this.movementState, facingRight: this.facingRight };
    }

    this.idleTimer = 0;

    if (distance > runDist) {
      this.movementState = ANIMATION_STATES.RUNNING;
    } else if (distance > walkDist) {
      this.movementState = ANIMATION_STATES.WALKING;
    } else {
      this.movementState = ANIMATION_STATES.WALKING;
    }

    // Calculate speed
    let speed = MOVEMENT.BASE_SPEED * this.personality.speedMultiplier * personalityModifier;
    if (this.movementState === ANIMATION_STATES.RUNNING) {
      speed *= 1.8;
    }
    speed = Math.min(speed, MOVEMENT.MAX_SPEED);

    // Calculate direction to target
    const tdx = targetX - petX;
    const tdy = targetY - petY;
    const targetDist = Math.sqrt(tdx * tdx + tdy * tdy);

    if (targetDist > 0) {
      const normalX = tdx / targetDist;
      const normalY = tdy / targetDist;

      // Apply easing
      this.velocityX += (normalX * speed - this.velocityX) * MOVEMENT.EASING;
      this.velocityY += (normalY * speed - this.velocityY) * MOVEMENT.EASING;
    }

    // Calculate new position
    let newX = petX + this.velocityX * deltaTime;
    let newY = petY + this.velocityY * deltaTime;

    // Constrain to viewport
    const padding = MOVEMENT.BOUNDARY_PADDING;
    newX = Math.max(padding, Math.min(window.innerWidth - petSize - padding, newX));
    newY = Math.max(padding, Math.min(window.innerHeight - petSize - padding, newY));

    // Determine facing direction
    if (Math.abs(this.velocityX) > 5) {
      this.facingRight = this.velocityX > 0;
    }

    return {
      x: newX,
      y: newY,
      state: this.movementState,
      facingRight: this.facingRight
    };
  }

  /**
   * Get the current movement state
   */
  getMovementState() {
    return this.movementState;
  }

  /**
   * Get facing direction
   */
  getDirectionFacing() {
    return this.facingRight ? 'right' : 'left';
  }

  // ═══════════════════════════════════════════
  // PERSONALITY BEHAVIORS
  // ═══════════════════════════════════════════

  _lazyBehavior(distance, deltaTime) {
    // Lazy pets move slower and stop more often
    if (distance < MOVEMENT.RUN_THRESHOLD && Math.random() < 0.01) {
      this.movementState = ANIMATION_STATES.SITTING;
      return 0;
    }
    return 0.6;
  }

  _energeticBehavior(distance, deltaTime) {
    // Random zoomies
    this.zoomieTimer += deltaTime;
    if (!this.isZooming && this.zoomieTimer > 5 && Math.random() < 0.005) {
      this.isZooming = true;
      this.zoomieTimer = 0;
      setTimeout(() => { this.isZooming = false; }, 2000 + Math.random() * 3000);
    }
    return this.isZooming ? 2.5 : 1.2;
  }

  _curiousBehavior(petX, petY, cursorX, cursorY, distance, deltaTime) {
    this.explorationTimer += deltaTime;

    // Periodically explore random edges
    if (!this.explorationTarget || this.explorationTimer > 8) {
      this.explorationTimer = 0;
      const edge = Math.floor(Math.random() * 4);
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      switch (edge) {
        case 0: this.explorationTarget = { x: Math.random() * w, y: 30 }; break;
        case 1: this.explorationTarget = { x: w - 30, y: Math.random() * h }; break;
        case 2: this.explorationTarget = { x: Math.random() * w, y: h - 30 }; break;
        case 3: this.explorationTarget = { x: 30, y: Math.random() * h }; break;
      }
    }

    // Mix between cursor following and exploration
    const exploreMix = distance > 200 ? 0.3 : 0.7;
    return {
      x: cursorX * (1 - exploreMix) + this.explorationTarget.x * exploreMix,
      y: cursorY * (1 - exploreMix) + this.explorationTarget.y * exploreMix
    };
  }

  _chaoticBehavior(petX, petY, cursorX, cursorY, distance, deltaTime) {
    this.wanderAngle += (Math.random() - 0.5) * 2 * deltaTime;

    const chaosRadius = 200;
    const targetX = cursorX + Math.cos(this.wanderAngle) * chaosRadius;
    const targetY = cursorY + Math.sin(this.wanderAngle) * chaosRadius;

    // Random speed bursts
    const speedMod = Math.random() < 0.02 ? 3 : 1.2;

    return { x: targetX, y: targetY, speed: speedMod };
  }

  /**
   * Handle collision avoidance with other pets
   */
  avoidCollisions(petX, petY, petSize, otherPets) {
    let adjustX = 0;
    let adjustY = 0;

    otherPets.forEach(other => {
      const dx = petX - other.x;
      const dy = petY - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = petSize * 1.5;

      if (dist < minDist && dist > 0) {
        const force = (minDist - dist) / minDist;
        adjustX += (dx / dist) * force * 5;
        adjustY += (dy / dist) * force * 5;
      }
    });

    return { x: adjustX, y: adjustY };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CursorTracker, MovementController };
}
