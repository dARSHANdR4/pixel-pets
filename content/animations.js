/**
 * Pixel Pets - Animation Controller
 * Manages sprite animation states, frame selection, and transitions
 */

class AnimationController {
  constructor() {
    this.currentState = ANIMATION_STATES.IDLE;
    this.previousState = ANIMATION_STATES.IDLE;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.sprites = null;
    this.facingRight = true;
    this.animationSpeed = 1.0;
    this.isPlaying = true;
    this.onAnimationComplete = null;
    this.queuedState = null;
  }

  /**
   * Set the sprite data for this controller
   */
  setSprites(sprites) {
    this.sprites = sprites;
  }

  /**
   * Set animation speed multiplier
   */
  setAnimationSpeed(speed) {
    this.animationSpeed = Math.max(0.1, Math.min(3.0, speed));
  }

  /**
   * Play a specific animation state
   */
  play(stateName, onComplete = null) {
    if (!this.sprites || !this.sprites[stateName]) {
      console.warn(`[Animation] State "${stateName}" not found`);
      return;
    }

    // Don't restart same looping animation
    if (stateName === this.currentState && ANIMATION_CONFIG[stateName]?.loop) {
      return;
    }

    this.previousState = this.currentState;
    this.currentState = stateName;
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.onAnimationComplete = onComplete;
    this.isPlaying = true;
  }

  /**
   * Queue an animation to play after the current one
   */
  queue(stateName) {
    this.queuedState = stateName;
  }

  /**
   * Stop the current animation
   */
  stop() {
    this.isPlaying = false;
  }

  /**
   * Resume the current animation
   */
  resume() {
    this.isPlaying = true;
  }

  /**
   * Update animation frame based on elapsed time
   */
  update(deltaTime) {
    if (!this.isPlaying || !this.sprites) return;

    const config = ANIMATION_CONFIG[this.currentState];
    if (!config) return;

    const frameRate = config.frameRate * this.animationSpeed;
    const frameDuration = 1 / frameRate;

    this.frameTimer += deltaTime;

    if (this.frameTimer >= frameDuration) {
      this.frameTimer -= frameDuration;
      this.currentFrame++;

      const frames = this.sprites[this.currentState];
      if (!frames) return;

      if (this.currentFrame >= frames.length) {
        if (config.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = frames.length - 1;
          this.isPlaying = false;

          // Handle animation complete callback
          if (this.onAnimationComplete) {
            const callback = this.onAnimationComplete;
            this.onAnimationComplete = null;
            callback();
          }

          // Play queued animation
          if (this.queuedState) {
            const nextState = this.queuedState;
            this.queuedState = null;
            this.play(nextState);
          } else {
            // Return to idle
            this.play(ANIMATION_STATES.IDLE);
          }
        }
      }
    }
  }

  /**
   * Get the current frame canvas to draw
   */
  getCurrentFrame() {
    if (!this.sprites || !this.sprites[this.currentState]) {
      return null;
    }

    const frames = this.sprites[this.currentState];
    const frameIndex = Math.min(this.currentFrame, frames.length - 1);
    return frames[frameIndex] || null;
  }

  /**
   * Set the facing direction
   */
  setDirection(facingRight) {
    this.facingRight = facingRight;
  }

  /**
   * Get the current animation state
   */
  getState() {
    return this.currentState;
  }

  /**
   * Check if a specific animation is currently playing
   */
  isPlayingState(state) {
    return this.currentState === state && this.isPlaying;
  }

  /**
   * Get animation progress (0 to 1)
   */
  getProgress() {
    const frames = this.sprites?.[this.currentState];
    if (!frames || frames.length <= 1) return 1;
    return this.currentFrame / (frames.length - 1);
  }

  /**
   * Render the current frame to a canvas context
   */
  render(ctx, x, y, size, opacity = 1.0) {
    const frame = this.getCurrentFrame();
    if (!frame) return;

    ctx.save();
    ctx.globalAlpha = opacity;

    if (!this.facingRight) {
      // Flip horizontally
      ctx.translate(x + size, y);
      ctx.scale(-1, 1);
      ctx.drawImage(frame, 0, 0, size, size);
    } else {
      ctx.drawImage(frame, x, y, size, size);
    }

    ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationController;
}
