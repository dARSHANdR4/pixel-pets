/**
 * Pixel Pets - Pet Factory
 * Programmatic pixel art sprite generation for each pet type
 * Generates all animation frames using Canvas
 */

class PetFactory {
  constructor() {
    this.spriteCache = {};
  }

  /**
   * Create a new pet instance with sprite data
   */
  createPet(type, name) {
    const petType = PET_TYPES[type];
    if (!petType) {
      console.error(`[PetFactory] Unknown pet type: ${type}`);
      return null;
    }

    return {
      ...DEFAULT_PET,
      id: `pet-${Date.now()}`,
      type: type,
      name: name || petType.name,
      personality: petType.defaultPersonality,
      stats: { ...DEFAULT_PET.stats, created: Date.now() }
    };
  }

  /**
   * Get available (unlocked) pet types
   */
  getAvailablePets() {
    return Object.values(PET_TYPES).filter(p => p.unlocked);
  }

  /**
   * Get all pet types
   */
  getAllPetTypes() {
    return Object.values(PET_TYPES);
  }

  /**
   * Generate sprite frames for a pet type programmatically
   * Returns an object with animation state names mapped to arrays of ImageData
   */
  generateSprites(petType, size = 32) {
    const cacheKey = `${petType}-${size}`;
    if (this.spriteCache[cacheKey]) {
      return this.spriteCache[cacheKey];
    }

    const colors = PET_TYPES[petType]?.colors;
    if (!colors) return null;

    const type = PET_TYPES[petType];
    let sprites;

    // Determine which drawing method to use based on pet category
    if (petType.startsWith('cat-') || petType === 'cat-classic') {
      sprites = this._generateCatSprites(colors, size, petType);
    } else if (petType === 'puppy') {
      sprites = this._generatePuppySprites(colors, size);
    } else if (petType === 'bunny') {
      sprites = this._generateBunnySprites(colors, size);
    } else if (petType === 'fox') {
      sprites = this._generateFoxSprites(colors, size);
    } else if (petType === 'hamster') {
      sprites = this._generateHamsterSprites(colors, size);
    } else if (petType === 'dragon') {
      sprites = this._generateDragonSprites(colors, size);
    } else if (petType === 'ghost') {
      sprites = this._generateGhostSprites(colors, size);
    } else {
      sprites = this._generateCatSprites(colors, size, petType);
    }

    this.spriteCache[cacheKey] = sprites;
    return sprites;
  }

  // ═══════════════════════════════════════════
  // PIXEL ART DRAWING HELPERS
  // ═══════════════════════════════════════════

  _createCanvas(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    return canvas;
  }

  _drawPixel(ctx, x, y, color, pixelSize = 2) {
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }

  _drawPixelBlock(ctx, pixels, pixelSize = 2) {
    pixels.forEach(([x, y, color]) => {
      this._drawPixel(ctx, x, y, color, pixelSize);
    });
  }

  // ═══════════════════════════════════════════
  // CAT SPRITES
  // ═══════════════════════════════════════════

  _generateCatSprites(colors, size) {
    const ps = Math.max(1, Math.floor(size / 16)); // pixel size
    const sprites = {};

    // IDLE frames
    sprites.idle = [];
    for (let f = 0; f < 4; f++) {
      const canvas = this._createCanvas(size);
      const ctx = canvas.getContext('2d');
      this._drawCatBody(ctx, colors, ps, f, 'idle');
      sprites.idle.push(canvas);
    }

    // WALKING frames
    sprites.walking = [];
    for (let f = 0; f < 4; f++) {
      const canvas = this._createCanvas(size);
      const ctx = canvas.getContext('2d');
      this._drawCatBody(ctx, colors, ps, f, 'walking');
      sprites.walking.push(canvas);
    }

    // RUNNING frames
    sprites.running = [];
    for (let f = 0; f < 4; f++) {
      const canvas = this._createCanvas(size);
      const ctx = canvas.getContext('2d');
      this._drawCatBody(ctx, colors, ps, f, 'running');
      sprites.running.push(canvas);
    }

    // SLEEPING frames
    sprites.sleeping = [];
    for (let f = 0; f < 2; f++) {
      const canvas = this._createCanvas(size);
      const ctx = canvas.getContext('2d');
      this._drawCatSleeping(ctx, colors, ps, f);
      sprites.sleeping.push(canvas);
    }

    // SITTING frames
    sprites.sitting = [];
    for (let f = 0; f < 2; f++) {
      const canvas = this._createCanvas(size);
      const ctx = canvas.getContext('2d');
      this._drawCatSitting(ctx, colors, ps, f);
      sprites.sitting.push(canvas);
    }

    // HAPPY frames
    sprites.happy = [];
    for (let f = 0; f < 4; f++) {
      const canvas = this._createCanvas(size);
      const ctx = canvas.getContext('2d');
      this._drawCatHappy(ctx, colors, ps, f);
      sprites.happy.push(canvas);
    }

    // EATING frames
    sprites.eating = [];
    for (let f = 0; f < 4; f++) {
      const canvas = this._createCanvas(size);
      const ctx = canvas.getContext('2d');
      this._drawCatEating(ctx, colors, ps, f);
      sprites.eating.push(canvas);
    }

    // JUMPING frames
    sprites.jumping = [];
    for (let f = 0; f < 4; f++) {
      const canvas = this._createCanvas(size);
      const ctx = canvas.getContext('2d');
      this._drawCatBody(ctx, colors, ps, f, 'jumping');
      sprites.jumping.push(canvas);
    }

    // LOOKING AROUND frames
    sprites.looking_around = [];
    for (let f = 0; f < 4; f++) {
      const canvas = this._createCanvas(size);
      const ctx = canvas.getContext('2d');
      this._drawCatBody(ctx, colors, ps, f, 'looking_around');
      sprites.looking_around.push(canvas);
    }

    // CHASING frames  
    sprites.chasing = sprites.running;

    return sprites;
  }

  _drawCatBody(ctx, colors, ps, frame, state) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const bounce = state === 'idle' ? (frame % 2 === 0 ? 0 : -1) : 0;
    const walkOffset = state === 'walking' ? Math.sin(frame * Math.PI / 2) * 1 : 0;
    const runOffset = state === 'running' ? Math.cos(frame * Math.PI / 2) * 2 : 0;
    const jumpOffset = state === 'jumping' ? -[0, -3, -4, -2][frame] : 0;
    const yOff = bounce + Math.round(walkOffset) + Math.round(runOffset) + jumpOffset;

    // Ears
    p(4, 1 + yOff, colors.body);
    p(5, 1 + yOff, colors.body);
    p(9, 1 + yOff, colors.body);
    p(10, 1 + yOff, colors.body);
    p(4, 2 + yOff, colors.body);
    p(5, 2 + yOff, colors.bodyLight);
    p(9, 2 + yOff, colors.bodyLight);
    p(10, 2 + yOff, colors.body);

    // Head
    for (let x = 3; x <= 11; x++) {
      p(x, 3 + yOff, colors.body);
      p(x, 4 + yOff, colors.body);
    }
    for (let x = 4; x <= 10; x++) {
      p(x, 5 + yOff, colors.body);
    }

    // Eyes
    if (state === 'looking_around') {
      const eyeShift = frame < 2 ? 0 : 1;
      p(5 + eyeShift, 4 + yOff, colors.eyes);
      p(9 + eyeShift, 4 + yOff, colors.eyes);
    } else {
      p(5, 4 + yOff, colors.eyes);
      p(9, 4 + yOff, colors.eyes);
    }

    // Nose
    p(7, 5 + yOff, colors.nose);

    // Body
    for (let x = 4; x <= 10; x++) {
      p(x, 6 + yOff, colors.body);
      p(x, 7 + yOff, colors.body);
      p(x, 8 + yOff, colors.body);
    }
    // Belly highlight
    for (let x = 5; x <= 9; x++) {
      p(x, 7 + yOff, colors.bodyLight);
    }

    // Legs
    const legFrame = frame % 4;
    if (state === 'walking' || state === 'running') {
      // Animated legs
      const legOffsets = [
        [[4, 9], [5, 9], [9, 10], [10, 10]],
        [[4, 10], [5, 10], [9, 9], [10, 9]],
        [[4, 9], [5, 9], [9, 10], [10, 10]],
        [[4, 10], [5, 10], [9, 9], [10, 9]]
      ];
      legOffsets[legFrame].forEach(([lx, ly]) => p(lx, ly + yOff, colors.bodyDark));
    } else if (state === 'jumping') {
      // Legs tucked
      if (frame < 2) {
        p(4, 9 + yOff, colors.bodyDark);
        p(5, 9 + yOff, colors.bodyDark);
        p(9, 9 + yOff, colors.bodyDark);
        p(10, 9 + yOff, colors.bodyDark);
      }
    } else {
      // Standing legs
      p(4, 9 + yOff, colors.bodyDark);
      p(5, 9 + yOff, colors.bodyDark);
      p(9, 9 + yOff, colors.bodyDark);
      p(10, 9 + yOff, colors.bodyDark);
    }

    // Tail
    const tailWag = Math.sin(frame * Math.PI / 2) * 1;
    p(11, 6 + yOff, colors.body);
    p(12, 5 + yOff + Math.round(tailWag), colors.body);
    p(13, 4 + yOff + Math.round(tailWag), colors.body);
  }

  _drawCatSleeping(ctx, colors, ps, frame) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const breathe = frame === 0 ? 0 : 1;

    // Curled up body
    for (let x = 3; x <= 11; x++) {
      p(x, 7 + breathe, colors.body);
      p(x, 8 + breathe, colors.body);
    }
    for (let x = 4; x <= 10; x++) {
      p(x, 9 + breathe, colors.body);
    }
    // Head
    for (let x = 3; x <= 7; x++) {
      p(x, 6 + breathe, colors.body);
    }
    // Closed eyes
    p(4, 7 + breathe, colors.bodyDark);
    p(6, 7 + breathe, colors.bodyDark);
    // Belly
    for (let x = 5; x <= 9; x++) {
      p(x, 8 + breathe, colors.bodyLight);
    }
    // Tail curl
    p(10, 9 + breathe, colors.body);
    p(11, 9 + breathe, colors.body);
    p(11, 8 + breathe, colors.body);
  }

  _drawCatSitting(ctx, colors, ps, frame) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const tailWag = frame === 0 ? 0 : 1;

    // Ears
    p(5, 1, colors.body);
    p(6, 1, colors.body);
    p(9, 1, colors.body);
    p(10, 1, colors.body);
    // Head
    for (let x = 4; x <= 10; x++) {
      p(x, 2, colors.body);
      p(x, 3, colors.body);
    }
    // Eyes
    p(6, 3, colors.eyes);
    p(9, 3, colors.eyes);
    // Nose
    p(7, 4, colors.nose);
    // Body (sitting - wider at bottom)
    for (let x = 4; x <= 10; x++) {
      p(x, 4, colors.body);
      p(x, 5, colors.body);
      p(x, 6, colors.body);
    }
    for (let x = 3; x <= 11; x++) {
      p(x, 7, colors.body);
      p(x, 8, colors.body);
    }
    // Belly
    for (let x = 5; x <= 9; x++) {
      p(x, 6, colors.bodyLight);
      p(x, 7, colors.bodyLight);
    }
    // Front paws
    p(4, 9, colors.bodyDark);
    p(5, 9, colors.bodyDark);
    p(9, 9, colors.bodyDark);
    p(10, 9, colors.bodyDark);
    // Tail
    p(11, 8, colors.body);
    p(12, 7 + tailWag, colors.body);
    p(13, 6 + tailWag, colors.body);
  }

  _drawCatHappy(ctx, colors, ps, frame) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const jump = [0, -2, -3, -1][frame];

    // Draw body with jump
    this._drawCatBody(ctx, colors, ps, frame, 'idle');

    // Override eyes with happy squint
    const yOff = frame % 2 === 0 ? 0 : -1;
    p(5, 4 + yOff + jump, colors.bodyDark);
    p(6, 4 + yOff + jump, colors.bodyDark);
    p(8, 4 + yOff + jump, colors.bodyDark);
    p(9, 4 + yOff + jump, colors.bodyDark);
  }

  _drawCatEating(ctx, colors, ps, frame) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const headBob = [0, 1, 0, -1][frame];

    // Body
    for (let x = 4; x <= 10; x++) {
      p(x, 6, colors.body);
      p(x, 7, colors.body);
      p(x, 8, colors.body);
    }
    // Head (lowered for eating)
    for (let x = 3; x <= 9; x++) {
      p(x, 4 + headBob, colors.body);
      p(x, 5 + headBob, colors.body);
    }
    // Eyes looking down
    p(5, 5 + headBob, colors.eyes);
    p(7, 5 + headBob, colors.eyes);
    // Mouth open
    if (frame % 2 === 0) {
      p(6, 6 + headBob, colors.nose);
    }
    // Legs
    p(4, 9, colors.bodyDark);
    p(5, 9, colors.bodyDark);
    p(9, 9, colors.bodyDark);
    p(10, 9, colors.bodyDark);
  }

  // ═══════════════════════════════════════════
  // PUPPY SPRITES
  // ═══════════════════════════════════════════

  _generatePuppySprites(colors, size) {
    const ps = Math.max(1, Math.floor(size / 16));
    const sprites = {};

    for (const state of ['idle', 'walking', 'running', 'sleeping', 'sitting', 'happy', 'eating', 'jumping', 'looking_around', 'chasing']) {
      const frameCount = ANIMATION_CONFIG[state]?.frameCount || 4;
      sprites[state] = [];
      for (let f = 0; f < frameCount; f++) {
        const canvas = this._createCanvas(size);
        const ctx = canvas.getContext('2d');
        this._drawPuppy(ctx, colors, ps, f, state);
        sprites[state].push(canvas);
      }
    }
    return sprites;
  }

  _drawPuppy(ctx, colors, ps, frame, state) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const bounce = state === 'idle' ? (frame % 2 === 0 ? 0 : -1) : 0;
    const walkOff = state === 'walking' ? Math.round(Math.sin(frame * Math.PI / 2)) : 0;
    const jumpOff = state === 'jumping' ? -[0, -3, -4, -2][frame] : 0;
    const yOff = bounce + walkOff + jumpOff;

    if (state === 'sleeping') {
      // Sleeping puppy (lying down)
      for (let x = 3; x <= 12; x++) { p(x, 8, colors.body); p(x, 9, colors.body); }
      for (let x = 3; x <= 7; x++) { p(x, 7, colors.body); }
      p(4, 8, colors.bodyDark); p(6, 8, colors.bodyDark); // closed eyes
      p(12, 7, colors.body); p(13, 7, colors.body); // tail
      p(5, 7, colors.accent); // ear
      return;
    }

    // Ears (floppy)
    p(3, 2 + yOff, colors.bodyDark);
    p(4, 3 + yOff, colors.bodyDark);
    p(10, 2 + yOff, colors.bodyDark);
    p(11, 3 + yOff, colors.bodyDark);

    // Head
    for (let x = 4; x <= 10; x++) { p(x, 2 + yOff, colors.body); p(x, 3 + yOff, colors.body); }
    for (let x = 5; x <= 9; x++) { p(x, 4 + yOff, colors.body); }

    // Eyes
    if (state === 'happy') {
      p(6, 3 + yOff, colors.bodyDark); p(8, 3 + yOff, colors.bodyDark);
    } else {
      p(6, 3 + yOff, colors.eyes); p(8, 3 + yOff, colors.eyes);
    }

    // Nose & tongue
    p(7, 4 + yOff, colors.nose);
    if (state === 'happy' || (state === 'eating' && frame % 2 === 0)) {
      p(7, 5 + yOff, '#FF69B4'); // tongue
    }

    // Body
    for (let x = 4; x <= 10; x++) { p(x, 5 + yOff, colors.body); p(x, 6 + yOff, colors.body); p(x, 7 + yOff, colors.body); }
    // Belly
    for (let x = 5; x <= 9; x++) { p(x, 7 + yOff, colors.accent); }

    // Legs (animated)
    if (state === 'walking' || state === 'running' || state === 'chasing') {
      const offsets = frame % 2 === 0 ? [[4, 8], [5, 8], [9, 9], [10, 9]] : [[4, 9], [5, 9], [9, 8], [10, 8]];
      offsets.forEach(([lx, ly]) => p(lx, ly + yOff, colors.bodyDark));
    } else {
      p(4, 8 + yOff, colors.bodyDark); p(5, 8 + yOff, colors.bodyDark);
      p(9, 8 + yOff, colors.bodyDark); p(10, 8 + yOff, colors.bodyDark);
    }

    // Tail (wagging)
    const tailY = state === 'happy' ? (frame % 2 === 0 ? -2 : -1) : Math.round(Math.sin(frame * Math.PI / 2));
    p(11, 5 + yOff, colors.body);
    p(12, 4 + yOff + tailY, colors.body);
  }

  // ═══════════════════════════════════════════
  // BUNNY SPRITES
  // ═══════════════════════════════════════════

  _generateBunnySprites(colors, size) {
    const ps = Math.max(1, Math.floor(size / 16));
    const sprites = {};
    for (const state of ['idle', 'walking', 'running', 'sleeping', 'sitting', 'happy', 'eating', 'jumping', 'looking_around', 'chasing']) {
      const frameCount = ANIMATION_CONFIG[state]?.frameCount || 4;
      sprites[state] = [];
      for (let f = 0; f < frameCount; f++) {
        const canvas = this._createCanvas(size);
        const ctx = canvas.getContext('2d');
        this._drawBunny(ctx, colors, ps, f, state);
        sprites[state].push(canvas);
      }
    }
    return sprites;
  }

  _drawBunny(ctx, colors, ps, frame, state) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const hop = (state === 'walking' || state === 'running' || state === 'chasing')
      ? [0, -2, 0, -1][frame] : (state === 'idle' ? (frame % 2 === 0 ? 0 : -1) : 0);
    const jumpOff = state === 'jumping' ? -[0, -3, -5, -2][frame] : 0;
    const yOff = hop + jumpOff;

    if (state === 'sleeping') {
      for (let x = 4; x <= 10; x++) { p(x, 8, colors.body); p(x, 9, colors.body); }
      p(5, 7, colors.body); p(6, 7, colors.body); // head
      p(5, 8, colors.bodyDark); // closed eye
      p(5, 5, colors.accent); p(5, 6, colors.accent); // ear down
      return;
    }

    // Long ears
    p(5, 0 + yOff, colors.body); p(5, 1 + yOff, colors.body);
    p(6, 0 + yOff, colors.accent); p(6, 1 + yOff, colors.accent);
    p(9, 0 + yOff, colors.body); p(9, 1 + yOff, colors.body);
    p(10, 0 + yOff, colors.accent); p(10, 1 + yOff, colors.accent);

    // Head
    for (let x = 4; x <= 10; x++) { p(x, 2 + yOff, colors.body); p(x, 3 + yOff, colors.body); }
    for (let x = 5; x <= 9; x++) { p(x, 4 + yOff, colors.body); }

    // Eyes
    p(6, 3 + yOff, state === 'happy' ? colors.bodyDark : colors.eyes);
    p(8, 3 + yOff, state === 'happy' ? colors.bodyDark : colors.eyes);
    // Nose
    p(7, 4 + yOff, colors.nose);

    // Round body
    for (let x = 4; x <= 10; x++) { p(x, 5 + yOff, colors.body); }
    for (let x = 3; x <= 11; x++) { p(x, 6 + yOff, colors.body); p(x, 7 + yOff, colors.body); }
    for (let x = 4; x <= 10; x++) { p(x, 8 + yOff, colors.body); }
    // Belly
    for (let x = 5; x <= 9; x++) { p(x, 7 + yOff, colors.bodyLight); }

    // Tiny tail
    p(11, 6 + yOff, colors.bodyLight);

    // Feet
    p(4, 9 + yOff, colors.bodyDark); p(5, 9 + yOff, colors.bodyDark);
    p(9, 9 + yOff, colors.bodyDark); p(10, 9 + yOff, colors.bodyDark);
  }

  // ═══════════════════════════════════════════
  // FOX SPRITES
  // ═══════════════════════════════════════════

  _generateFoxSprites(colors, size) {
    const ps = Math.max(1, Math.floor(size / 16));
    const sprites = {};
    for (const state of ['idle', 'walking', 'running', 'sleeping', 'sitting', 'happy', 'eating', 'jumping', 'looking_around', 'chasing']) {
      const frameCount = ANIMATION_CONFIG[state]?.frameCount || 4;
      sprites[state] = [];
      for (let f = 0; f < frameCount; f++) {
        const canvas = this._createCanvas(size);
        const ctx = canvas.getContext('2d');
        this._drawFox(ctx, colors, ps, f, state);
        sprites[state].push(canvas);
      }
    }
    return sprites;
  }

  _drawFox(ctx, colors, ps, frame, state) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const bounce = state === 'idle' ? (frame % 2 === 0 ? 0 : -1) : 0;
    const walkOff = (state === 'walking' || state === 'running' || state === 'chasing') ? Math.round(Math.sin(frame * Math.PI / 2)) : 0;
    const jumpOff = state === 'jumping' ? -[0, -3, -4, -2][frame] : 0;
    const yOff = bounce + walkOff + jumpOff;

    if (state === 'sleeping') {
      for (let x = 3; x <= 11; x++) { p(x, 7, colors.body); p(x, 8, colors.body); }
      for (let x = 3; x <= 7; x++) { p(x, 6, colors.body); }
      p(4, 7, colors.bodyDark); p(6, 7, colors.bodyDark);
      p(11, 6, colors.body); p(12, 5, colors.body); p(13, 5, colors.bodyLight);
      return;
    }

    // Pointy ears
    p(4, 0 + yOff, colors.body); p(10, 0 + yOff, colors.body);
    p(4, 1 + yOff, colors.body); p(5, 1 + yOff, colors.bodyLight);
    p(9, 1 + yOff, colors.bodyLight); p(10, 1 + yOff, colors.body);

    // Head
    for (let x = 3; x <= 11; x++) { p(x, 2 + yOff, colors.body); }
    for (let x = 4; x <= 10; x++) { p(x, 3 + yOff, colors.body); }
    for (let x = 5; x <= 9; x++) { p(x, 4 + yOff, colors.body); }

    // White muzzle
    p(6, 4 + yOff, colors.accent); p(7, 4 + yOff, colors.accent); p(8, 4 + yOff, colors.accent);

    // Eyes
    p(5, 3 + yOff, state === 'happy' ? colors.bodyDark : colors.eyes);
    p(9, 3 + yOff, state === 'happy' ? colors.bodyDark : colors.eyes);
    // Nose
    p(7, 4 + yOff, colors.nose);

    // Body
    for (let x = 4; x <= 10; x++) { p(x, 5 + yOff, colors.body); p(x, 6 + yOff, colors.body); p(x, 7 + yOff, colors.body); }
    // White belly
    for (let x = 5; x <= 9; x++) { p(x, 7 + yOff, colors.accent); }

    // Legs
    if (state === 'walking' || state === 'running' || state === 'chasing') {
      const off = frame % 2 === 0;
      p(4, 8 + yOff + (off ? 0 : 1), colors.bodyDark); p(5, 8 + yOff + (off ? 0 : 1), colors.bodyDark);
      p(9, 8 + yOff + (off ? 1 : 0), colors.bodyDark); p(10, 8 + yOff + (off ? 1 : 0), colors.bodyDark);
    } else {
      p(4, 8 + yOff, colors.bodyDark); p(5, 8 + yOff, colors.bodyDark);
      p(9, 8 + yOff, colors.bodyDark); p(10, 8 + yOff, colors.bodyDark);
    }

    // Fluffy tail
    const tailWag = Math.round(Math.sin(frame * Math.PI / 2));
    p(11, 5 + yOff, colors.body);
    p(12, 4 + yOff + tailWag, colors.body);
    p(13, 3 + yOff + tailWag, colors.body);
    p(13, 4 + yOff + tailWag, colors.bodyLight);
  }

  // ═══════════════════════════════════════════
  // HAMSTER SPRITES
  // ═══════════════════════════════════════════

  _generateHamsterSprites(colors, size) {
    const ps = Math.max(1, Math.floor(size / 16));
    const sprites = {};
    for (const state of ['idle', 'walking', 'running', 'sleeping', 'sitting', 'happy', 'eating', 'jumping', 'looking_around', 'chasing']) {
      const frameCount = ANIMATION_CONFIG[state]?.frameCount || 4;
      sprites[state] = [];
      for (let f = 0; f < frameCount; f++) {
        const canvas = this._createCanvas(size);
        const ctx = canvas.getContext('2d');
        this._drawHamster(ctx, colors, ps, f, state);
        sprites[state].push(canvas);
      }
    }
    return sprites;
  }

  _drawHamster(ctx, colors, ps, frame, state) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const wobble = state === 'idle' ? (frame % 2 === 0 ? 0 : -1) : 0;
    const yOff = wobble;

    if (state === 'sleeping') {
      // Round sleeping hamster
      for (let x = 4; x <= 10; x++) { for (let y = 7; y <= 9; y++) { p(x, y, colors.body); } }
      p(5, 7, colors.bodyDark); p(7, 7, colors.bodyDark);
      return;
    }

    // Round ears
    p(4, 2 + yOff, colors.body); p(10, 2 + yOff, colors.body);

    // Round head (hamsters are chubby)
    for (let x = 4; x <= 10; x++) { p(x, 3 + yOff, colors.body); }
    for (let x = 3; x <= 11; x++) { p(x, 4 + yOff, colors.body); p(x, 5 + yOff, colors.body); }

    // Cheek pouches
    p(3, 5 + yOff, colors.bodyLight); p(11, 5 + yOff, colors.bodyLight);

    // Eyes
    p(5, 4 + yOff, state === 'happy' ? colors.bodyDark : colors.eyes);
    p(9, 4 + yOff, state === 'happy' ? colors.bodyDark : colors.eyes);
    p(7, 5 + yOff, colors.nose);

    // Chubby body
    for (let x = 3; x <= 11; x++) { p(x, 6 + yOff, colors.body); p(x, 7 + yOff, colors.body); }
    for (let x = 4; x <= 10; x++) { p(x, 8 + yOff, colors.body); }
    // Belly
    for (let x = 5; x <= 9; x++) { p(x, 7 + yOff, colors.accent); }

    // Tiny feet
    p(4, 9 + yOff, colors.bodyDark); p(5, 9 + yOff, colors.bodyDark);
    p(9, 9 + yOff, colors.bodyDark); p(10, 9 + yOff, colors.bodyDark);
  }

  // ═══════════════════════════════════════════
  // DRAGON SPRITES
  // ═══════════════════════════════════════════

  _generateDragonSprites(colors, size) {
    const ps = Math.max(1, Math.floor(size / 16));
    const sprites = {};
    for (const state of ['idle', 'walking', 'running', 'sleeping', 'sitting', 'happy', 'eating', 'jumping', 'looking_around', 'chasing']) {
      const frameCount = ANIMATION_CONFIG[state]?.frameCount || 4;
      sprites[state] = [];
      for (let f = 0; f < frameCount; f++) {
        const canvas = this._createCanvas(size);
        const ctx = canvas.getContext('2d');
        this._drawDragon(ctx, colors, ps, f, state);
        sprites[state].push(canvas);
      }
    }
    return sprites;
  }

  _drawDragon(ctx, colors, ps, frame, state) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const bounce = state === 'idle' ? (frame % 2 === 0 ? 0 : -1) : 0;
    const yOff = bounce + (state === 'jumping' ? -[0, -3, -4, -2][frame] : 0);

    if (state === 'sleeping') {
      for (let x = 3; x <= 11; x++) { p(x, 7, colors.body); p(x, 8, colors.body); }
      p(4, 6, colors.body); p(5, 6, colors.body);
      p(4, 7, colors.bodyDark); p(6, 7, colors.bodyDark);
      p(11, 6, colors.body); p(12, 5, colors.body);
      return;
    }

    // Horns
    p(4, 0 + yOff, colors.bodyDark); p(10, 0 + yOff, colors.bodyDark);
    p(5, 1 + yOff, colors.bodyDark); p(9, 1 + yOff, colors.bodyDark);

    // Head
    for (let x = 4; x <= 10; x++) { p(x, 2 + yOff, colors.body); p(x, 3 + yOff, colors.body); }
    for (let x = 5; x <= 9; x++) { p(x, 4 + yOff, colors.body); }

    // Eyes (fiery)
    p(5, 3 + yOff, colors.eyes); p(9, 3 + yOff, colors.eyes);
    // Nostril / mouth
    p(7, 4 + yOff, colors.nose);
    // Fire breath on happy
    if (state === 'happy' && frame % 2 === 0) {
      p(7, 5 + yOff, '#FF4500'); p(8, 5 + yOff, '#FF6347');
    }

    // Body
    for (let x = 4; x <= 10; x++) { p(x, 5 + yOff, colors.body); p(x, 6 + yOff, colors.body); p(x, 7 + yOff, colors.body); }
    // Belly
    for (let x = 5; x <= 9; x++) { p(x, 7 + yOff, colors.accent); }

    // Spines on back
    p(6, 4 + yOff, colors.bodyDark); p(7, 3 + yOff, colors.bodyDark); p(8, 4 + yOff, colors.bodyDark);

    // Wings (small)
    p(3, 5 + yOff, colors.bodyLight); p(2, 4 + yOff, colors.bodyLight);
    p(11, 5 + yOff, colors.bodyLight); p(12, 4 + yOff, colors.bodyLight);

    // Legs
    p(4, 8 + yOff, colors.bodyDark); p(5, 8 + yOff, colors.bodyDark);
    p(9, 8 + yOff, colors.bodyDark); p(10, 8 + yOff, colors.bodyDark);

    // Tail
    const tailWag = Math.round(Math.sin(frame * Math.PI / 2));
    p(11, 6 + yOff, colors.body); p(12, 6 + yOff + tailWag, colors.body);
    p(13, 5 + yOff + tailWag, colors.bodyDark);
  }

  // ═══════════════════════════════════════════
  // GHOST SPRITES
  // ═══════════════════════════════════════════

  _generateGhostSprites(colors, size) {
    const ps = Math.max(1, Math.floor(size / 16));
    const sprites = {};
    for (const state of ['idle', 'walking', 'running', 'sleeping', 'sitting', 'happy', 'eating', 'jumping', 'looking_around', 'chasing']) {
      const frameCount = ANIMATION_CONFIG[state]?.frameCount || 4;
      sprites[state] = [];
      for (let f = 0; f < frameCount; f++) {
        const canvas = this._createCanvas(size);
        const ctx = canvas.getContext('2d');
        this._drawGhost(ctx, colors, ps, f, state);
        sprites[state].push(canvas);
      }
    }
    return sprites;
  }

  _drawGhost(ctx, colors, ps, frame, state) {
    const p = (x, y, c) => this._drawPixel(ctx, x, y, c, ps);
    const float = Math.round(Math.sin(frame * Math.PI / 2) * 1.5);
    const yOff = float;

    // Head (round top)
    for (let x = 5; x <= 9; x++) { p(x, 1 + yOff, colors.body); }
    for (let x = 4; x <= 10; x++) { p(x, 2 + yOff, colors.body); p(x, 3 + yOff, colors.body); }
    for (let x = 3; x <= 11; x++) { p(x, 4 + yOff, colors.body); }

    // Eyes
    if (state === 'sleeping') {
      p(5, 3 + yOff, colors.bodyDark); p(9, 3 + yOff, colors.bodyDark);
    } else if (state === 'happy') {
      p(5, 3 + yOff, colors.eyes); p(6, 3 + yOff, colors.eyes);
      p(8, 3 + yOff, colors.eyes); p(9, 3 + yOff, colors.eyes);
    } else {
      p(5, 3 + yOff, colors.eyes); p(6, 3 + yOff, colors.eyes);
      p(8, 3 + yOff, colors.eyes); p(9, 3 + yOff, colors.eyes);
      p(5, 4 + yOff, colors.eyes); p(9, 4 + yOff, colors.eyes);
    }

    // Mouth
    if (state === 'eating') {
      p(7, 5 + yOff, colors.nose);
    }

    // Body (flowing)
    for (let x = 3; x <= 11; x++) { p(x, 5 + yOff, colors.body); p(x, 6 + yOff, colors.body); p(x, 7 + yOff, colors.body); }

    // Wavy bottom
    const wave = frame % 2;
    p(3, 8 + yOff, colors.body);
    p(5, 8 + yOff + wave, colors.body);
    p(7, 8 + yOff, colors.body);
    p(9, 8 + yOff + wave, colors.body);
    p(11, 8 + yOff, colors.body);

    // Blush
    p(4, 5 + yOff, colors.accent); p(10, 5 + yOff, colors.accent);

    // Set opacity for ghost effect
    ctx.globalAlpha = 0.85;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PetFactory;
}
