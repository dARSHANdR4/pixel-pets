/**
 * Pixel Pets - Shared Constants
 * Central configuration for all extension modules
 */

// ═══════════════════════════════════════════
// COLOR PALETTE (Neo-Brutalism)
// ═══════════════════════════════════════════
const COLORS = {
  PRIMARY: {
    MAGENTA: '#FF1B9C',
    CYAN: '#00D9FF',
    LIME: '#BFFF00',
    PURPLE: '#2D1B69'
  },
  SECONDARY: {
    YELLOW: '#FFD700',
    ORANGE: '#FF6B00',
    NEON_PINK: '#FF00FF',
    TEAL: '#00CED1'
  },
  NEUTRAL: {
    WHITE: '#FFFFFF',
    OFF_WHITE: '#F5F5F5',
    CHARCOAL: '#1A1A1A',
    DARK_GRAY: '#333333',
    MEDIUM_GRAY: '#666666',
    LIGHT_GRAY: '#EEEEEE'
  }
};

// ═══════════════════════════════════════════
// DEFAULT SETTINGS
// ═══════════════════════════════════════════
const DEFAULT_SETTINGS = {
  enabled: true,
  autoStartup: true,
  soundEnabled: false,
  soundVolume: 50,
  performanceMode: false,
  debugMode: false
};

// ═══════════════════════════════════════════
// DEFAULT PET CONFIG
// ═══════════════════════════════════════════
const DEFAULT_PET = {
  id: 'pet-1',
  name: 'Whiskers',
  type: 'cat-classic',
  active: true,
  position: { x: 200, y: 200 },
  size: 64,
  speed: 1.0,
  opacity: 1.0,
  animationSpeed: 1.0,
  personality: 'loyal',
  mood: 75,
  energy: 80,
  lastFed: Date.now(),
  stats: {
    totalPlayTime: 0,
    petCount: 0,
    feedCount: 0,
    playCount: 0,
    created: Date.now()
  },
  accessories: []
};

// ═══════════════════════════════════════════
// PET TYPE DEFINITIONS
// ═══════════════════════════════════════════
const PET_TYPES = {
  'cat-classic': {
    id: 'cat-classic',
    name: 'Classic Cat',
    emoji: '🐱',
    description: 'A friendly orange tabby cat',
    defaultPersonality: 'loyal',
    unlocked: true,
    colors: {
      body: '#F4A460',
      bodyDark: '#CD853F',
      bodyLight: '#FFDEAD',
      eyes: '#2E8B57',
      nose: '#FF69B4',
      accent: '#DEB887'
    }
  },
  'cat-black': {
    id: 'cat-black',
    name: 'Black Cat',
    emoji: '🐈‍⬛',
    description: 'A mysterious black cat',
    defaultPersonality: 'curious',
    unlocked: true,
    colors: {
      body: '#2C2C2C',
      bodyDark: '#1A1A1A',
      bodyLight: '#444444',
      eyes: '#FFD700',
      nose: '#FF69B4',
      accent: '#333333'
    }
  },
  'cat-white': {
    id: 'cat-white',
    name: 'White Cat',
    emoji: '🐱',
    description: 'An elegant white cat',
    defaultPersonality: 'lazy',
    unlocked: true,
    colors: {
      body: '#F5F5F5',
      bodyDark: '#E0E0E0',
      bodyLight: '#FFFFFF',
      eyes: '#4169E1',
      nose: '#FFB6C1',
      accent: '#DCDCDC'
    }
  },
  'cat-orange': {
    id: 'cat-orange',
    name: 'Orange Cat',
    emoji: '🐱',
    description: 'A chubby orange cat',
    defaultPersonality: 'lazy',
    unlocked: true,
    colors: {
      body: '#FF8C00',
      bodyDark: '#E07000',
      bodyLight: '#FFA540',
      eyes: '#32CD32',
      nose: '#FF69B4',
      accent: '#FF9F00'
    }
  },
  'puppy': {
    id: 'puppy',
    name: 'Puppy',
    emoji: '🐶',
    description: 'A loyal brown puppy',
    defaultPersonality: 'energetic',
    unlocked: true,
    colors: {
      body: '#8B4513',
      bodyDark: '#6B3410',
      bodyLight: '#A0522D',
      eyes: '#2F4F4F',
      nose: '#1A1A1A',
      accent: '#D2B48C'
    }
  },
  'bunny': {
    id: 'bunny',
    name: 'Bunny',
    emoji: '🐰',
    description: 'A curious white bunny',
    defaultPersonality: 'curious',
    unlocked: true,
    colors: {
      body: '#F5F5F5',
      bodyDark: '#E8E8E8',
      bodyLight: '#FFFFFF',
      eyes: '#FF69B4',
      nose: '#FFB6C1',
      accent: '#FFD1DC'
    }
  },
  'fox': {
    id: 'fox',
    name: 'Fox',
    emoji: '🦊',
    description: 'A sly energetic fox',
    defaultPersonality: 'chaotic',
    unlocked: true,
    colors: {
      body: '#D2691E',
      bodyDark: '#A0522D',
      bodyLight: '#F4A460',
      eyes: '#FFD700',
      nose: '#1A1A1A',
      accent: '#FFFFFF'
    }
  },
  'hamster': {
    id: 'hamster',
    name: 'Hamster',
    emoji: '🐹',
    description: 'A cute golden hamster',
    defaultPersonality: 'energetic',
    unlocked: false,
    colors: {
      body: '#DAA520',
      bodyDark: '#B8860B',
      bodyLight: '#F0E68C',
      eyes: '#1A1A1A',
      nose: '#FF69B4',
      accent: '#FFFACD'
    }
  },
  'dragon': {
    id: 'dragon',
    name: 'Dragon',
    emoji: '🐉',
    description: 'A tiny pixel dragon',
    defaultPersonality: 'chaotic',
    unlocked: false,
    colors: {
      body: '#228B22',
      bodyDark: '#006400',
      bodyLight: '#32CD32',
      eyes: '#FF4500',
      nose: '#FF6347',
      accent: '#90EE90'
    }
  },
  'ghost': {
    id: 'ghost',
    name: 'Pixel Ghost',
    emoji: '👻',
    description: 'A friendly pixel ghost',
    defaultPersonality: 'curious',
    unlocked: false,
    colors: {
      body: '#E8E8FF',
      bodyDark: '#C8C8E8',
      bodyLight: '#FFFFFF',
      eyes: '#4B0082',
      nose: '#9370DB',
      accent: '#DCD0FF'
    }
  }
};

// ═══════════════════════════════════════════
// PERSONALITY DEFINITIONS
// ═══════════════════════════════════════════
const PERSONALITIES = {
  lazy: {
    id: 'lazy',
    name: 'Lazy',
    emoji: '😴',
    description: 'Moves slowly, sleeps frequently',
    speedMultiplier: 0.5,
    idleChance: 0.4,
    sleepChance: 0.15,
    followDistance: 150,
    explorationRange: 50
  },
  energetic: {
    id: 'energetic',
    name: 'Energetic',
    emoji: '⚡',
    description: 'Runs often, random zoomies',
    speedMultiplier: 1.8,
    idleChance: 0.05,
    sleepChance: 0.02,
    followDistance: 80,
    explorationRange: 200
  },
  curious: {
    id: 'curious',
    name: 'Curious',
    emoji: '🔍',
    description: 'Explores page edges, investigates elements',
    speedMultiplier: 1.0,
    idleChance: 0.15,
    sleepChance: 0.05,
    followDistance: 120,
    explorationRange: 300
  },
  loyal: {
    id: 'loyal',
    name: 'Loyal',
    emoji: '❤️',
    description: 'Stays close to cursor',
    speedMultiplier: 1.2,
    idleChance: 0.1,
    sleepChance: 0.05,
    followDistance: 40,
    explorationRange: 30
  },
  chaotic: {
    id: 'chaotic',
    name: 'Chaotic',
    emoji: '🌪️',
    description: 'Random movements, unexpected behaviors',
    speedMultiplier: 1.5,
    idleChance: 0.08,
    sleepChance: 0.03,
    followDistance: 100,
    explorationRange: 400
  }
};

// ═══════════════════════════════════════════
// ANIMATION CONSTANTS
// ═══════════════════════════════════════════
const ANIMATION_STATES = {
  IDLE: 'idle',
  WALKING: 'walking',
  RUNNING: 'running',
  SLEEPING: 'sleeping',
  SITTING: 'sitting',
  JUMPING: 'jumping',
  LOOKING_AROUND: 'looking_around',
  HAPPY: 'happy',
  EATING: 'eating',
  CHASING: 'chasing'
};

const ANIMATION_CONFIG = {
  idle: { frameCount: 4, frameRate: 3, loop: true },
  walking: { frameCount: 4, frameRate: 8, loop: true },
  running: { frameCount: 4, frameRate: 12, loop: true },
  sleeping: { frameCount: 2, frameRate: 1, loop: true },
  sitting: { frameCount: 2, frameRate: 2, loop: true },
  jumping: { frameCount: 4, frameRate: 10, loop: false },
  looking_around: { frameCount: 4, frameRate: 3, loop: true },
  happy: { frameCount: 4, frameRate: 8, loop: false },
  eating: { frameCount: 4, frameRate: 6, loop: false },
  chasing: { frameCount: 4, frameRate: 14, loop: true }
};

// ═══════════════════════════════════════════
// MOVEMENT CONSTANTS
// ═══════════════════════════════════════════
const MOVEMENT = {
  BASE_SPEED: 120,           // pixels per second
  WALK_THRESHOLD: 50,        // distance in px to start walking
  RUN_THRESHOLD: 200,        // distance in px to start running
  STOP_THRESHOLD: 30,        // distance in px to stop
  EASING: 0.08,              // movement easing factor
  GRAVITY: 0,                // no gravity for now
  BOUNDARY_PADDING: 20,      // pixels from edge
  MAX_SPEED: 400             // max pixels per second
};

// ═══════════════════════════════════════════
// INTERACTION CONSTANTS
// ═══════════════════════════════════════════
const INTERACTIONS = {
  PET_MOOD_BOOST: 15,
  FEED_MOOD_BOOST: 30,
  FEED_ENERGY_BOOST: 20,
  PLAY_MOOD_BOOST: 25,
  PLAY_ENERGY_COST: 15,
  MOOD_DECAY_RATE: 0.5,     // per minute
  ENERGY_DECAY_RATE: 0.3,    // per minute
  SLEEP_THRESHOLD: 15,       // energy below this triggers sleep
  INACTIVITY_SLEEP_MS: 1800000  // 30 minutes
};

// ═══════════════════════════════════════════
// PARTICLE TYPES
// ═══════════════════════════════════════════
const PARTICLE_TYPES = {
  HEARTS: 'hearts',
  FOOD: 'food',
  SPARKLES: 'sparkles',
  SLEEP_Z: 'sleep_z',
  STARS: 'stars'
};

// ═══════════════════════════════════════════
// PERFORMANCE THRESHOLDS
// ═══════════════════════════════════════════
const PERFORMANCE = {
  TARGET_FPS: 60,
  MIN_FPS: 30,
  MAX_PETS: 5,
  THROTTLE_INTERVAL: 25,    // ms between position updates
  PARTICLE_LIMIT: 50,
  CANVAS_SIZE_MULTIPLIER: 1  // for retina displays
};

// ═══════════════════════════════════════════
// FOOD TYPES
// ═══════════════════════════════════════════
const FOOD_TYPES = {
  fish: { name: 'Fish', emoji: '🐟', moodBoost: 30, energyBoost: 20 },
  meat: { name: 'Meat', emoji: '🍖', moodBoost: 25, energyBoost: 25 },
  treat: { name: 'Treat', emoji: '🍪', moodBoost: 35, energyBoost: 10 },
  milk: { name: 'Milk', emoji: '🥛', moodBoost: 20, energyBoost: 15 }
};

// ═══════════════════════════════════════════
// TOY TYPES
// ═══════════════════════════════════════════
const TOY_TYPES = {
  ball: { name: 'Ball', emoji: '⚽', energyCost: 15, moodBoost: 25 },
  yarn: { name: 'Yarn', emoji: '🧶', energyCost: 10, moodBoost: 20 },
  mouse: { name: 'Mouse Toy', emoji: '🐭', energyCost: 20, moodBoost: 30 },
  laser: { name: 'Laser Pointer', emoji: '🔴', energyCost: 25, moodBoost: 35 }
};

// ═══════════════════════════════════════════
// ACHIEVEMENTS
const ACHIEVEMENTS = [
  { id: 'first-pet', title: 'Pet Parent', description: 'Spawn your first pet', condition: 'petCount >= 1', icon: '🎉', tier: 'bronze', max: 1, statKey: 'petCount' },
  { id: 'caretaker', title: 'Caretaker', description: 'Feed your pet 10 times', condition: 'feedCount >= 10', icon: '🍖', tier: 'bronze', max: 10, statKey: 'feedCount' },
  { id: 'playmate', title: 'Playmate', description: 'Play 20 times', condition: 'playCount >= 20', icon: '🎮', tier: 'bronze', max: 20, statKey: 'playCount' },
  { id: 'dreamer', title: 'Dreamer', description: 'Let your pet sleep 10 times', condition: 'sleepCount >= 10', icon: '💤', tier: 'bronze', max: 10, statKey: 'sleepCount' },
  { id: 'collector', title: 'Collector', description: 'Own 3 different pets', condition: 'uniquePets >= 3', icon: '📦', tier: 'silver', max: 3, statKey: 'uniquePets' },
  { id: 'gourmet', title: 'Gourmet', description: 'Feed 50 times', condition: 'feedCount >= 50', icon: '👨‍🍳', tier: 'silver', max: 50, statKey: 'feedCount' },
  { id: 'energizer', title: 'Energizer', description: 'Keep energy > 90%', condition: 'highEnergy', icon: '⚡', tier: 'silver', max: 90, statKey: 'energy' },
  { id: 'night-owl', title: 'Night Owl', description: 'Be active for 10 hours', condition: 'totalPlayTime >= 36000000', icon: '🦉', tier: 'gold', max: 36000000, statKey: 'totalPlayTime' },
  { id: 'best-friend', title: 'Best Friend', description: 'Pet your companion 100 times', condition: 'petCount >= 100', icon: '💕', tier: 'gold', max: 100, statKey: 'petCount' },
  { id: 'happy-pet', title: 'Happy Pet', description: 'Reach 100% mood', condition: 'mood >= 100', icon: '😊', tier: 'gold', max: 100, statKey: 'mood' }
];

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    COLORS, DEFAULT_SETTINGS, DEFAULT_PET, PET_TYPES, PERSONALITIES,
    ANIMATION_STATES, ANIMATION_CONFIG, MOVEMENT, INTERACTIONS,
    PARTICLE_TYPES, PERFORMANCE, FOOD_TYPES, TOY_TYPES, ACHIEVEMENTS
  };
}
