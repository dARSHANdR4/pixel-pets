/**
 * Pixel Pets - Overlay Manager
 * Creates and manages the Shadow DOM overlay for pet rendering
 * Ensures CSS isolation and non-intrusive page interaction
 */

class OverlayManager {
  constructor() {
    this.host = null;
    this.shadowRoot = null;
    this.canvas = null;
    this.ctx = null;
    this.container = null;
    this.popupMenu = null;
    this.isAttached = false;
  }

  /**
   * Create Shadow DOM and attach to page
   */
  createShadowDOM() {
    // Create host element
    this.host = document.createElement('div');
    this.host.id = 'pixel-pets-host';
    this.host.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 2147483647 !important;
      overflow: hidden !important;
    `;

    // Attach shadow DOM
    this.shadowRoot = this.host.attachShadow({ mode: 'closed' });

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        all: initial !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        pointer-events: none !important;
        z-index: 2147483647 !important;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .pixel-pets-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      }

      .pixel-pets-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }

      .pet-clickable {
        position: absolute;
        pointer-events: auto;
        cursor: pointer;
        border-radius: 50%;
      }

      .pet-popup-menu {
        position: absolute;
        pointer-events: auto;
        background: #FFFFFF;
        border: 3px solid #FF1B9C;
        padding: 8px;
        display: none;
        gap: 6px;
        z-index: 10;
        font-family: 'Inter', 'Trebuchet MS', sans-serif;
      }

      .pet-popup-menu.visible {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        animation: popupIn 200ms ease-out;
      }

      .pet-popup-btn {
        background: #2D1B69;
        color: white;
        border: 2px solid #00D9FF;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
        font-family: 'Inter', 'Trebuchet MS', sans-serif;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 150ms ease-out;
        text-align: center;
        pointer-events: auto;
      }

      .pet-popup-btn:hover {
        background: #FF1B9C;
        border-color: #BFFF00;
        transform: scale(1.05);
      }

      .pet-popup-btn:active {
        transform: scale(0.95);
      }

      .pet-popup-close {
        grid-column: span 2;
        background: #1A1A1A;
        border-color: #666666;
        font-size: 12px;
        padding: 4px 8px;
      }

      .pet-popup-close:hover {
        background: #333333;
      }

      .particle {
        position: absolute;
        pointer-events: none;
        font-size: 16px;
        animation: particleFade 1s ease-out forwards;
      }

      .toast-notification {
        position: fixed;
        bottom: 20px;
        left: 20px;
        pointer-events: auto;
        padding: 12px 20px;
        border: 3px solid #00D9FF;
        font-family: 'Inter', 'Trebuchet MS', sans-serif;
        font-weight: 600;
        font-size: 14px;
        z-index: 20;
        animation: slideIn 300ms ease-out;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .toast-success {
        background: #BFFF00;
        color: #1A1A1A;
      }

      .toast-info {
        background: #00D9FF;
        color: #1A1A1A;
        border-color: #2D1B69;
      }

      .toast-error {
        background: #FF6B00;
        color: #FFFFFF;
        border-color: #FF1B9C;
      }

      @keyframes popupIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }

      @keyframes particleFade {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-40px) scale(0.5); }
      }

      @keyframes slideIn {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }

      @keyframes floatUp {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-60px); }
      }
    `;

    this.shadowRoot.appendChild(style);

    // Create container
    this.container = document.createElement('div');
    this.container.className = 'pixel-pets-container';

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'pixel-pets-canvas';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering

    this.container.appendChild(this.canvas);

    // Create popup menu
    this.popupMenu = document.createElement('div');
    this.popupMenu.className = 'pet-popup-menu';
    this.container.appendChild(this.popupMenu);

    this.shadowRoot.appendChild(this.container);

    // Handle resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.ctx.imageSmoothingEnabled = false;
    });

    return this;
  }

  /**
   * Attach the overlay to the page
   */
  attachToPage() {
    if (this.isAttached) return;

    document.documentElement.appendChild(this.host);
    this.isAttached = true;
    console.log('[PixelPets] Overlay attached to page');
  }

  /**
   * Remove overlay from page
   */
  detachFromPage() {
    if (!this.isAttached) return;
    
    this.host.remove();
    this.isAttached = false;
  }

  /**
   * Get the canvas context for rendering
   */
  getCanvasContext() {
    return this.ctx;
  }

  /**
   * Get canvas dimensions
   */
  getCanvasDimensions() {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    };
  }

  /**
   * Clear the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Create a clickable zone for a pet at given position
   */
  createPetClickZone(petId, x, y, size, onClick) {
    let zone = this.container.querySelector(`[data-pet-id="${petId}"]`);
    
    if (!zone) {
      zone = document.createElement('div');
      zone.className = 'pet-clickable';
      zone.dataset.petId = petId;
      zone.addEventListener('click', (e) => {
        e.stopPropagation();
        onClick(e);
      });
      zone.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showPopupMenu(x, y - size - 10, petId);
      });
      this.container.appendChild(zone);
    }

    zone.style.left = `${x - size / 2}px`;
    zone.style.top = `${y - size / 2}px`;
    zone.style.width = `${size}px`;
    zone.style.height = `${size}px`;
  }

  /**
   * Remove a pet's click zone
   */
  removePetClickZone(petId) {
    const zone = this.container.querySelector(`[data-pet-id="${petId}"]`);
    if (zone) zone.remove();
  }

  /**
   * Show popup menu near pet
   */
  showPopupMenu(x, y, petId, callbacks = {}) {
    this.popupMenu.innerHTML = '';
    this.popupMenu.style.left = `${Math.max(10, Math.min(x - 70, window.innerWidth - 160))}px`;
    this.popupMenu.style.top = `${Math.max(10, y - 120)}px`;

    const buttons = [
      { emoji: '🐾', label: 'Pet', action: 'pet' },
      { emoji: '🍖', label: 'Feed', action: 'feed' },
      { emoji: '🎮', label: 'Play', action: 'play' },
      { emoji: '💤', label: 'Sleep', action: 'sleep' }
    ];

    buttons.forEach(btn => {
      const el = document.createElement('button');
      el.className = 'pet-popup-btn';
      el.textContent = `${btn.emoji} ${btn.label}`;
      el.addEventListener('click', () => {
        if (callbacks[btn.action]) callbacks[btn.action]();
        this.hidePopupMenu();
      });
      this.popupMenu.appendChild(el);
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'pet-popup-btn pet-popup-close';
    closeBtn.textContent = '✕ CLOSE';
    closeBtn.addEventListener('click', () => this.hidePopupMenu());
    this.popupMenu.appendChild(closeBtn);

    this.popupMenu.classList.add('visible');
    this.popupMenu.dataset.petId = petId;

    // Close on click outside
    setTimeout(() => {
      const closeHandler = (e) => {
        if (!this.popupMenu.contains(e.target)) {
          this.hidePopupMenu();
          document.removeEventListener('click', closeHandler);
        }
      };
      document.addEventListener('click', closeHandler);
    }, 100);
  }

  /**
   * Hide popup menu
   */
  hidePopupMenu() {
    this.popupMenu.classList.remove('visible');
  }

  /**
   * Create particle effect at position
   */
  createParticles(type, x, y, count = 5) {
    const emojis = {
      hearts: ['❤️', '💕', '💖', '💗', '💝'],
      food: ['⭐', '✨', '🌟'],
      sparkles: ['✨', '⭐', '💫', '🌟'],
      sleep_z: ['💤', 'Z', 'z'],
      stars: ['⭐', '🌟', '✨']
    };

    const particleEmojis = emojis[type] || emojis.sparkles;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.textContent = particleEmojis[Math.floor(Math.random() * particleEmojis.length)];
      
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 30;
      const delay = Math.random() * 300;
      
      particle.style.left = `${x + offsetX}px`;
      particle.style.top = `${y + offsetY}px`;
      particle.style.animationDelay = `${delay}ms`;
      particle.style.fontSize = `${14 + Math.random() * 10}px`;

      this.container.appendChild(particle);

      // Remove after animation
      setTimeout(() => particle.remove(), 1300 + delay);
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-100%)';
      toast.style.transition = 'all 300ms ease-in';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Show Neo-Brutalism Achievement Toast
   */
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

    // Add keyframes to the shadow DOM if not already present
    if (!this.shadowRoot.querySelector('#achievement-styles')) {
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
      this.shadowRoot.appendChild(style);
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

    this.container.appendChild(toast);

    // Remove after 5 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 300ms ease-in forwards';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = OverlayManager;
}
