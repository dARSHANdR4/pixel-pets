# TECHNICAL REQUIREMENTS DOCUMENT (TRD)
## Pixel Pets - Chrome Extension

**Version:** 1.0  
**Last Updated:** June 2024  
**Status:** Active Development  

---

## 1. TECHNICAL OVERVIEW

### Stack Summary
| Component | Technology | Version |
|-----------|-----------|---------|
| **Manifest** | Manifest Version 3 | 3 |
| **Core Language** | JavaScript (ES6+) | ES2020+ |
| **Styling** | CSS3 | CSS Animations/Transitions |
| **Animation** | Canvas/CSS Animation | Native |
| **Storage** | Chrome Storage API | IndexedDB (backup) |
| **Architecture** | Content Scripts + Service Worker | MV3 |

---

## 2. ARCHITECTURE OVERVIEW

### Directory Structure
```
pixel-pets/
│
├── manifest.json                 # Extension configuration
│
├── content/                      # Content script files
│   ├── pet-engine.js            # Main pet logic controller
│   ├── movement.js              # Movement algorithm & pathfinding
│   ├── animations.js            # Animation state management
│   ├── interactions.js          # User interaction handlers
│   ├── overlay.js               # Shadow DOM overlay management
│   └── overlay.css              # Overlay styling
│
├── background/                   # Service worker
│   ├── service-worker.js        # Background service worker
│   ├── alarm-manager.js         # Chrome Alarms API handler
│   └── sync-manager.js          # Settings sync
│
├── popup/                        # Extension popup
│   ├── popup.html               # Popup markup
│   ├── popup.js                 # Popup logic
│   └── popup.css                # Popup styling
│
├── options/                      # Settings page
│   ├── options.html             # Settings markup
│   ├── options.js               # Settings logic
│   └── options.css              # Settings styling
│
├── assets/                       # Static assets
│   ├── pets/                    # Pet sprite sheets
│   │   ├── cat-classic.png
│   │   ├── cat-black.png
│   │   └── ... (other pets)
│   ├── accessories/             # Accessory sprites
│   │   ├── hats/
│   │   ├── glasses/
│   │   └── scarves/
│   ├── icons/                   # UI icons
│   │   ├── icon-16.png
│   │   ├── icon-48.png
│   │   └── icon-128.png
│   └── sounds/                  # Audio files (optional)
│       ├── meow.mp3
│       ├── purr.mp3
│       └── ... (other sounds)
│
├── lib/                          # Shared utilities
│   ├── storage-manager.js       # Chrome Storage wrapper
│   ├── animation-engine.js      # Sprite animation system
│   ├── math-utils.js            # Movement calculations
│   ├── pet-factory.js           # Pet instantiation
│   └── validators.js            # Input validation
│
└── docs/                         # Documentation
    ├── API.md
    ├── SPRITE_FORMAT.md
    └── DEVELOPER_GUIDE.md
```

---

## 3. CORE MODULES

### 3.1 Pet Engine (pet-engine.js)

**Responsibility:** Main orchestrator for pet logic and behavior

**Key Classes:**
```javascript
class PetEngine {
  constructor(petConfig)
  initialize()
  update(deltaTime)
  render(context)
  destroy()
  setPetBehavior(personality)
  setPosition(x, y)
  getState()
  getSpriteContext()
}

class Pet {
  constructor(config)
  update(deltaTime, cursorPos, otherPets)
  animate(state, animationName)
  getCurrentFrame()
  getBounds()
  playSound(soundName)
  react(interactionType)
}
```

**Responsibilities:**
- Manage pet lifecycle
- Coordinate all pet systems
- Handle state transitions
- Update pet position each frame
- Manage animations queue
- Track pet statistics (play time, mood, interactions)

**Key Methods:**
- `initialize()` - Set up pet with config
- `update(deltaTime)` - Main game loop update
- `animate(state)` - Trigger animation
- `interact(type)` - Handle user interactions
- `saveState()` - Persist pet data

---

### 3.2 Movement Module (movement.js)

**Responsibility:** Calculate pet movement and pathfinding

**Key Classes:**
```javascript
class MovementController {
  constructor(pet, personality)
  calculateNextPosition(cursorPos, deltaTime)
  getDirectionFacing()
  getMovementState()
  avoidCollisions(otherPets)
}

class PathFinder {
  calculatePath(start, target, personality)
  getSmoothPath(start, target, steps)
}

class PersonalityBehavior {
  constructor(type)
  getTargetPosition(cursor, pet, environment)
  getMovementSpeed()
  getIdleChance()
  getExplorationPattern()
}
```

**Algorithms:**
- **Standard Following:** Direct cursor following with easing
- **Lazy Personality:** Slower speed, meandering paths, sleep checks
- **Energetic Personality:** Fast movement, random direction changes, zoomies
- **Curious Personality:** Explores page edges, investigates elements
- **Loyal Personality:** Maintains close proximity to cursor
- **Chaotic Personality:** Random targets, unexpected direction changes

**Collision Detection:**
- Bounding box collision for multi-pet scenarios
- Separation steering for natural multi-pet movement
- Viewport boundary detection and wrapping

**Performance Optimization:**
- Use simpler algorithms for 3+ simultaneous pets
- Reduce update frequency based on distance
- Lazy calculation for non-active pets

---

### 3.3 Animation Module (animations.js)

**Responsibility:** Manage sprite animation states and frame rendering

**Key Classes:**
```javascript
class SpriteSheet {
  constructor(imageUrl, frameWidth, frameHeight, frameCount)
  getFrame(frameIndex)
  getFrameCount()
  loadImage()
  validateDimensions()
}

class AnimationController {
  constructor(spriteSheet, defaultState)
  play(stateName, duration, loop)
  stop()
  getCurrentFrame()
  getAnimationProgress()
  update(deltaTime)
}

class AnimationState {
  constructor(name, frames, duration, loop)
  getCurrentFrame(progress)
  getDuration()
}
```

**Supported States:**
- `idle` - Standing still (looped)
- `walking` - Moving slowly (looped)
- `running` - Moving fast (looped)
- `sleeping` - Resting (looped)
- `jumping` - Jump animation (non-looped)
- `sitting` - Sitting pose (looped)
- `looking_around` - Head turning (looped)
- `custom_X` - User-defined animations

**Frame Rendering:**
- Source: Sprite sheet image
- Draw region from sheet to canvas
- Support 2D canvas rendering
- Pixel-perfect scaling for retro look

**Animation Blending:**
- Queue next animation
- Smooth transitions between states
- Prevent animation conflicts

---

### 3.4 Interactions Module (interactions.js)

**Responsibility:** Handle user interactions with pet

**Key Classes:**
```javascript
class InteractionHandler {
  constructor(pet)
  onPet(position)
  onToy(toyType, targetPosition)
  onFeed(foodType)
  onTalk()
  onDrag(startPos, endPos)
}

class InteractionReaction {
  constructor(type)
  trigger()
  getAnimationSequence()
  getParticleEffect()
  getSound()
}

class PopupMenu {
  constructor(position)
  show()
  hide()
  onToyClick(toyType)
  onFeedClick(foodType)
  onPlayClick()
}
```

**Interaction Types:**
1. **Petting** (Click)
   - Animation: `happy_pet`
   - Effect: Heart particles
   - Sound: `purr` or `meow_happy`
   - Mood Impact: +15% happiness

2. **Feeding** (Menu -> Food Selection)
   - Animations: `eating`, then `happy`
   - Effects: Food particles
   - Sound: `eating_sound`
   - Mood Impact: +30% happiness, +10% sleepiness

3. **Playing with Toy** (Drag to target)
   - Animation: `chase`
   - Effects: Motion trail
   - Sound: `toy_hit`
   - Mood Impact: +25% energy, +5% happiness

4. **Sleeping** (Long inactivity)
   - Animation: `sleeping`
   - Effects: Z particles
   - Sound: `sleep_sound` (optional)
   - Duration: 2-5 minutes

---

### 3.5 Overlay Module (overlay.js)

**Responsibility:** Manage Shadow DOM overlay and non-intrusive rendering

**Key Classes:**
```javascript
class OverlayManager {
  constructor()
  createShadowDOM()
  attachToPage()
  renderPet(petCanvas)
  showPopupMenu(position, menuItems)
  createParticleEffect(type, position)
}

class ShadowDOMContainer {
  constructor()
  attachTo(host)
  getCanvasContext()
  getContainerElement()
  applyStyles(styleSheet)
}
```

**Features:**
- Shadow DOM isolation from page CSS
- Canvas-based rendering for pets
- Fixed positioning (viewport-relative)
- Z-index management (ensure visibility without obstruction)
- Event passthrough configuration
- Popup menu isolation

**CSS Isolation:**
- Shadow DOM prevents page styles from affecting extension
- Extension styles don't affect page (intentional)
- Separate stylesheet for overlay elements
- High z-index: 999999 (above most page elements)

**Performance Optimizations:**
- Request Animation Frame for smooth rendering
- Only render pet canvas when changed
- Defer popup menu rendering until needed
- Throttle position updates

---

## 4. CONTENT SCRIPT EXECUTION

### Script Injection Order
1. `overlay.js` - Create and attach Shadow DOM
2. `animations.js` - Initialize animation engine
3. `movement.js` - Set up movement controller
4. `interactions.js` - Bind interaction handlers
5. `pet-engine.js` - Initialize pet and start main loop

### Main Game Loop (pet-engine.js)
```javascript
class GameLoop {
  constructor(canvas, petEngine)
  
  start() {
    this.running = true
    this.lastTime = performance.now()
    this.requestAnimationFrame(this.update.bind(this))
  }
  
  update(currentTime) {
    const deltaTime = (currentTime - this.lastTime) / 1000
    this.lastTime = currentTime
    
    // Update pet logic
    this.petEngine.update(deltaTime)
    
    // Render pet
    this.petEngine.render()
    
    if (this.running) {
      requestAnimationFrame(this.update.bind(this))
    }
  }
  
  stop() {
    this.running = false
  }
}
```

**Update Rate:**
- Target: 60 FPS (16.67ms per frame)
- Fallback: 30 FPS for low-power devices
- Pause when tab inactive (using Page Visibility API)

---

## 5. SERVICE WORKER (Background Script)

**Responsibility:** Handle extension lifecycle, messaging, and persistence

**Key Classes:**
```javascript
class ServiceWorker {
  constructor()
  onInstalled()
  onMessage(message, sender, sendResponse)
  onStorageChanged(changes, areaName)
  scheduleBackup()
}

class AlarmManager {
  constructor()
  createAlarm(name, periodInMinutes)
  cancelAlarm(name)
  onAlarm(alarm)
}
```

**Key Tasks:**
1. Handle extension install/update
2. Listen for messages from content scripts
3. Manage Chrome Storage persistence
4. Schedule periodic tasks (auto-save, health checks)
5. Handle extension uninstall cleanup

**Message Types:**
```javascript
{
  type: 'SAVE_PET_STATE',
  petId: 'pet-1',
  state: { ...petState }
}

{
  type: 'GET_SETTINGS',
  callback: true
}

{
  type: 'UNLOCK_ITEM',
  itemType: 'hat',
  itemId: 'wizard-hat'
}
```

---

## 6. CHROME STORAGE API SCHEMA

### Storage Structure

**chrome.storage.local**
```json
{
  "settings": {
    "enabled": true,
    "autoStartup": true,
    "soundEnabled": false,
    "soundVolume": 50,
    "performanceMode": false
  },
  
  "pets": [
    {
      "id": "pet-1",
      "name": "Whiskers",
      "type": "cat-classic",
      "active": true,
      "position": { "x": 100, "y": 200 },
      "size": 80,
      "speed": 1.0,
      "opacity": 1.0,
      "animationSpeed": 1.0,
      "personality": "loyal",
      "mood": 75,
      "energy": 60,
      "lastFed": 1234567890,
      "stats": {
        "totalPlayTime": 3600000,
        "petCount": 245,
        "feedCount": 89,
        "playCount": 156,
        "created": 1234567890
      },
      "accessories": [
        { "type": "hat", "id": "wizard-hat", "equipped": true },
        { "type": "glasses", "id": "sunglasses", "equipped": false }
      ]
    }
  ],
  
  "accessories": {
    "owned": [
      {
        "id": "wizard-hat",
        "type": "hat",
        "name": "Wizard Hat",
        "spriteUrl": "assets/accessories/hats/wizard.png",
        "acquired": 1234567890,
        "equipped": false
      }
    ],
    "unlocked": ["cat-classic", "puppy", "wizard-hat"]
  },
  
  "achievements": [
    {
      "id": "first-pet",
      "title": "Pet Collector",
      "description": "Spawn your first pet",
      "unlocked": 1234567890,
      "icon": "assets/achievements/first-pet.png"
    }
  ],
  
  "customPets": [
    {
      "id": "custom-1",
      "name": "My Custom Pet",
      "spriteUrl": "blob:...",
      "frameWidth": 32,
      "frameHeight": 32,
      "frameCount": 4,
      "created": 1234567890
    }
  ]
}
```

### Data Validation
- Strict schema validation on load
- Version checking for migrations
- Corruption detection and recovery
- Automatic cleanup of orphaned data

---

## 7. SPRITE SHEET SPECIFICATION

### Format Requirements
**File Type:** PNG, GIF  
**Color Mode:** RGBA (24-bit with alpha)  
**Maximum Size:** 5MB per upload  

### Layout
```
┌─────────────────────────────┐
│ Frame 0 │ Frame 1 │ Frame 2 │
├─────────────────────────────┤
│ Frame 3 │ Frame 4 │ Frame 5 │
└─────────────────────────────┘
```

**Requirements:**
- Frames laid out horizontally or vertically
- Consistent frame dimensions (width x height)
- No gaps between frames (optional padding allowed)
- Transparent background (PNG alpha channel)
- Power-of-2 dimensions recommended (32x32, 64x64)

### Configuration
```json
{
  "frameWidth": 32,
  "frameHeight": 32,
  "frameCount": 8,
  "frameRate": 10,
  "layout": "horizontal",
  "animations": {
    "idle": {
      "frames": [0, 1, 2, 1],
      "frameRate": 10,
      "loop": true
    },
    "walking": {
      "frames": [3, 4, 5],
      "frameRate": 8,
      "loop": true
    }
  }
}
```

---

## 8. SECURITY & PRIVACY

### Content Security Policy
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'",
    "sandbox": "sandbox allow-scripts"
  }
}
```

### Data Privacy
- **No External Communication:** All data stored locally
- **No Analytics:** No user tracking
- **No Ads:** Ad-free experience
- **No Permissions:** Minimal permissions (read page DOM only)
- **User Control:** Full export/import/delete capabilities

### Permissions
```json
{
  "permissions": [
    "storage",
    "alarms",
    "scripting"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "optional_permissions": [
    "activeTab"
  ]
}
```

**Justification:**
- `storage`: Persist user settings and pet data
- `alarms`: Schedule auto-save and health checks
- `scripting`: Inject content scripts on all tabs
- `<all_urls>`: Display pet on all websites
- `activeTab`: Detect active tab for popup

---

## 9. PERFORMANCE REQUIREMENTS

### Target Metrics
| Metric | Target | Maximum |
|--------|--------|---------|
| Initial Load Time | < 500ms | 1s |
| CPU Usage (1 pet) | < 5% | 15% |
| CPU Usage (5 pets) | < 15% | 30% |
| Memory Usage (1 pet) | < 20MB | 50MB |
| Memory Usage (5 pets) | < 50MB | 100MB |
| Animation Frame Rate | 60 FPS | Min 30 FPS |
| Input Latency | < 50ms | 100ms |

### Optimization Techniques

**CPU Optimization:**
- Throttle position updates (25ms intervals)
- Simplify collision detection for 5+ pets
- Use lower-resolution sprites for distant pets
- Disable animations when tab inactive
- Batch DOM operations

**Memory Optimization:**
- Sprite sheet caching (load once)
- Audio file compression (MP3 320kbps max)
- Lazy load unused accessory sprites
- Garbage collection for deleted pets
- Periodic memory cleanup

**Rendering Optimization:**
- Canvas-based rendering (faster than DOM)
- Double buffering for smooth animation
- Only redraw changed regions (if performance critical)
- RequestAnimationFrame for frame pacing
- Disable shadow effects on low-power devices

---

## 10. BROWSER COMPATIBILITY

### Target Browsers
- Chrome 90+
- Chromium 90+
- Edge 90+
- Opera 76+
- Brave 1.30+

### Feature Detection
```javascript
class BrowserCompat {
  static supportsWebGL() { ... }
  static supportsOffscreenCanvas() { ... }
  static getOptimalRenderMethod() { ... }
  static applyBrowserSpecificFix(issue) { ... }
}
```

### Fallbacks
- Canvas 2D rendering (universal)
- No WebGL fallback to Canvas
- No IndexedDB fallback to chrome.storage.local
- No Offscreen Canvas fallback to main thread

---

## 11. TESTING REQUIREMENTS

### Unit Tests
- Movement algorithm calculations
- Animation frame selection
- Collision detection logic
- Storage serialization
- Pet factory creation

**Coverage Target:** 85%+

### Integration Tests
- Content script injection and cleanup
- Service worker messaging
- Storage persistence and retrieval
- Multi-pet interaction
- Settings synchronization

### E2E Tests
- Full user journey (install → customize → play)
- Multi-pet creation and management
- Accessory equipping and animation
- Settings page functionality
- Data persistence across extension restart

### Performance Tests
- CPU usage under load (5 pets)
- Memory leaks over 24-hour session
- Frame rate consistency
- Input responsiveness
- Storage quota usage

---

## 12. DEPLOYMENT & VERSIONING

### Version Numbering
Format: `MAJOR.MINOR.PATCH`  
Example: `1.2.3`

**Rules:**
- MAJOR: Breaking changes, new systems
- MINOR: New features, backwards compatible
- PATCH: Bug fixes, optimizations

### Update Strategy
- **Auto-update:** Chrome handles automatically (24-72 hours)
- **Manual Check:** Available in settings
- **Changelog:** Displayed on update
- **Data Migration:** Automatic schema upgrades

### Release Checklist
- [ ] Code review (2 approvers)
- [ ] All tests passing (unit + integration + E2E)
- [ ] Performance benchmarks met
- [ ] No critical bugs
- [ ] Documentation updated
- [ ] Changelog written
- [ ] Version bumped
- [ ] Build artifacts generated
- [ ] Code signed

---

## 13. TECHNICAL DEBT & KNOWN LIMITATIONS

### Current Limitations
1. **No Firefox Support** - MV3 not fully supported yet
2. **No Offline Detection** - Always assumes online
3. **Limited Storage** - 10MB Chrome storage quota
4. **No Sync** - Settings not synced across devices (Phase 2)
5. **Single Extension Instance** - No cross-profile sync

### Technical Debt
- Sprite loading can be optimized with WebWorkers
- Movement algorithm could use physics engine
- Animation system could benefit from tweening library
- Need refactor of interaction handler (too many methods)

---

## 14. DEPENDENCIES & LIBRARIES

### External Libraries (None Required - Vanilla JS)
- **No framework dependencies** - Pure JavaScript for minimal size
- **No jQuery** - Use native DOM APIs
- **No animation libraries** - Custom animation engine

### Optional Libraries (Evaluated)
| Library | Purpose | Verdict |
|---------|---------|---------|
| Babylon.js | 3D rendering | Rejected (too heavy, unnecessary) |
| Phaser.js | Game engine | Rejected (overkill for this use case) |
| TweenJS | Tweening | Deferred (can use CSS animations) |
| PixiJS | 2D rendering | Deferred (Canvas sufficient) |

---

## 15. MONITORING & DEBUGGING

### Debug Mode
- Toggle in Advanced Settings
- Logs pet state every frame
- Displays FPS counter overlay
- Shows collision boxes
- Logs all messages and storage operations

### Error Handling
```javascript
try {
  // Pet logic
} catch (error) {
  console.error('[PetError]', error)
  // Graceful degradation
  // Pet becomes static but visible
  // Settings still accessible
}
```

### Analytics (Future)
- Anonymized usage patterns
- Feature adoption metrics
- Performance data
- Crash reporting (opt-in)

---

## APPENDIX

### API Reference
See `docs/API.md` for detailed API documentation

### Sprite Format Guide
See `docs/SPRITE_FORMAT.md` for custom pet creation guide

### Developer Guide
See `docs/DEVELOPER_GUIDE.md` for development setup and contribution

