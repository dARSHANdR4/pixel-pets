# APP FLOW & USER JOURNEY DOCUMENT
## Pixel Pets - Chrome Extension

**Version:** 1.0  
**Last Updated:** June 2024  
**Format:** Detailed User Flows with State Diagrams  

---

## 1. INSTALLATION & FIRST-TIME SETUP FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                 USER INSTALLS EXTENSION                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Extension Active    │
         │  (Service Worker +    │
         │   Content Scripts)    │
         └────────┬──────────────┘
                  │
                  ▼
    ┌─────────────────────────────┐
    │  Onboarding Popup Shows     │
    │  "Welcome to Pixel Pets"    │
    │  [Tutorial] [Skip] [Start]  │
    └────────┬────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
  ┌────────┐   ┌──────────┐
  │Tutorial│   │ Skip to  │
  │Shows   │   │Pet Select│
  │Basics  │   │Screen    │
  └────┬───┘   └────┬─────┘
       │            │
       └─────┬──────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Pet Selection Screen        │
    │  Choose from 10 preset pets: │
    │  - Classic Cat               │
    │  - Black Cat                 │
    │  - Puppy                     │
    │  - ... (more pets)           │
    │  [Upload Custom Pet] [Next]  │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Basic Customization         │
    │  Size:  [====•======] 80px   │
    │  Speed: [====•======] 1.0x   │
    │  Name:  [Whiskers      ]     │
    │  [Browse Settings] [Done]    │
    └────────┬─────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Pet Spawns on Active Tab    │
    │  Sidebar popup can be opened │
    │  Settings available in       │
    │  extension icon right-click  │
    └──────────────────────────────┘
```

---

## 2. MAIN BROWSING EXPERIENCE FLOW

```
┌────────────────────────────────────────────────────────┐
│              USER BROWSING WEBPAGE                     │
└───────────────────┬────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
  ┌──────────────┐      ┌──────────────────┐
  │ Pet Visible  │      │ Popup Menu Open? │
  │ On Page      │      └────────┬─────────┘
  │ Following    │               │
  │ Cursor       │         ┌─────┴──────┐
  └──────┬───────┘         │            │
         │            ┌────▼─┐      ┌──┴────┐
         │            │ Close│      │ Open  │
         │            │Popup │      │Popup  │
         │            └──────┘      │Menu   │
         │                          └───┬───┘
         │                              │
         │                    ┌─────────▼────────┐
         │                    │   Popup Shows:   │
         │                    │ [Pet] [Feed]     │
         │                    │ [Play] [Toys]    │
         │                    │ [Mute] [Settings]│
         │                    └─────────┬────────┘
         │                              │
    ┌────┴──────────────────────┬───────┴──────┐
    │                           │              │
    ▼                      ┌────▼────┐    ┌───▼────┐
 ┌──────────────┐         │Selecting│    │Opening │
 │Pet Animates  │         │an Action│    │Settings│
 │(Idle/Walk/   │         └────┬────┘    └───┬────┘
 │Run states)   │              │             │
 └──────────────┘    ┌─────────┴──────┬──────┴──────────┐
                     │                │                │
                  ┌──▼───┐        ┌───▼──┐        ┌────▼────┐
                  │ PETTING │   │ FEEDING │     │NAVIGATED│
                  │ Pet     │   │ Treat    │     │TO       │
                  │Reacts   │   │Selection │     │SETTINGS │
                  │Happy    │   │Screen    │     │PAGE     │
                  └─────────┘   └────┬─────┘     └────┬────┘
                                     │                │
                            ┌────────▼──────────┐    │
                            │ Pet Eats & React  │    │
                            │ Happy/Sleepy      │    │
                            └───────────────────┘    │
                                                      ▼
```

---

## 3. POPUP DASHBOARD FLOW

```
┌──────────────────────────────────────────┐
│      EXTENSION ICON CLICKED               │
│      (Opens Popup Menu)                  │
└──────────────┬───────────────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │   POPUP DASHBOARD            │
    │  ╔════════════════════════╗  │
    │  ║  Whiskers          [x] ║  │
    │  ║  🐱 Mood: 75%          ║  │
    │  ║     Energy: 60%        ║  │
    │  ║     Active: 45 min     ║  │
    │  ╠════════════════════════╣  │
    │  ║ [🐾] [🍖] [🎮]        ║  │
    │  ║ Pet  Feed  Play        ║  │
    │  ╠════════════════════════╣  │
    │  ║ [🔊] Mute              ║  │
    │  ║ [⚙️] Settings          ║  │
    │  ║ [➕] New Pet           ║  │
    │  ╚════════════════════════╝  │
    └────┬────┬────┬────┬───┬──┬──┘
         │    │    │    │   │  │
    ┌────▼┐ ┌─▼───┐│    │  │  └──→ [⚙️ Settings Page]
    │ Pet │ │Feed ││    │  │       (see Settings Flow)
    │Click│ │Menu ││    │  │
    │     │ │     ││    │  │
    └─────┘ └─────┘│    │  │
                    │    │  │
                ┌───▼┐ ┌─▼──┴──────────┐
                │Play│ │Mute Toggle    │
                │Toys│ │  Enabled      │
                └────┘ │  Disabled     │
                       └───────────────┘

┌─────────────────────────────────┐
│  PET CLICK - Reaction Menu      │
├─────────────────────────────────┤
│ Petting pet...                  │
│ ♥️ Happy! +15% mood             │
│ [~Purring sound~]               │
│ [Heart animation effect]        │
└─────────────────────────────────┘

┌──────────────────────────────────┐
│  FEED MENU                       │
├──────────────────────────────────┤
│ What would you like to feed?     │
│ [🐠 Fish]                        │
│ [🍪 Snacks]                      │
│ [🥩 Meat]                        │
│ [Cancel]                         │
└──────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Pet is eating...                 │
│ [Eating animation]               │
│ 🐱: "Nom nom!" [Sound]           │
│ Happiness: 75% → 85%             │
│ Sleepiness: 40% → 50%            │
│ [Continue browsing]              │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  PLAY MENU                       │
├──────────────────────────────────┤
│ Pick a toy:                      │
│ [⚽ Ball]                         │
│ [🧶 Yarn]                        │
│ [🪤 Mouse Toy]                   │
│ [💡 Laser Pointer]               │
│ [Cancel]                         │
└──────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Throw toy across page              │
│ [Drag animation to target]         │
│ Pet chases toy                     │
│ [Chase animation] [Sound]          │
│ Energy: 60% → 45% (tired)          │
│ Happiness: 80% → 90%               │
│ [Play Again?] [Done]               │
└────────────────────────────────────┘

┌──────────────────────────────────┐
│  NEW PET BUTTON                  │
├──────────────────────────────────┤
│ Spawn another pet?               │
│ Current: 1/5 pets                │
│ [Choose Pet] [Cancel]            │
└──────────────────────────────────┘
     │
     ▼
[Return to Pet Selection Screen]
```

---

## 4. SETTINGS PAGE FLOW

```
┌─────────────────────────────────────────────┐
│    PIXEL PETS SETTINGS PAGE                 │
│    (chrome-extension://[id]/options.html)   │
└──────────┬────────────────────────────────┬─┘
           │                                │
     [General]  [Pets]  [Appearance]  [Audio]  [Advanced]
           │
           ▼
┌────────────────────────────────────┐
│ ⭐ GENERAL SETTINGS               │
├────────────────────────────────────┤
│ ☑ Enable Pixel Pets                │
│ ☐ Auto-start on startup            │
│ ☑ Performance mode                 │
│   (Reduces effects for low-end      │
│    devices)                         │
│                                     │
│ [Save] [Reset to Defaults]          │
└────────────────────────────────────┘

           │
           ▼
┌────────────────────────────────────┐
│ 🐾 PETS MANAGEMENT                 │
├────────────────────────────────────┤
│ Active Pet: Whiskers (Cat-Classic) │
│                                     │
│ My Pets:                            │
│ ☑ Whiskers (Cat-Classic)           │
│ ☐ Fluffy (Puppy)                   │
│ ☐ Shadow (Black Cat)               │
│ ☐ Sparkles (Dragon)                │
│                                     │
│ [Delete Selected] [Add New Pet]     │
│                                     │
│ ┌─────────────────────────────┐    │
│ │ UPLOAD CUSTOM PET           │    │
│ │                             │    │
│ │ [Choose Image] [⟲ Upload]   │    │
│ │                             │    │
│ │ Frame Width:  [32]          │    │
│ │ Frame Height: [32]          │    │
│ │ Frame Count:  [8]           │    │
│ │ Frame Rate:   [10]          │    │
│ │                             │    │
│ │ [Preview] [Upload]          │    │
│ └─────────────────────────────┘    │
│                                     │
│ [Save] [Reset to Defaults]          │
└────────────────────────────────────┘

           │
           ▼
┌────────────────────────────────────┐
│ 🎨 APPEARANCE SETTINGS             │
├────────────────────────────────────┤
│ Size Slider:                        │
│ [◄ 30px ════•════ 150px ►]         │
│ Current: 80px                       │
│                                     │
│ Speed Multiplier:                   │
│ [◄ 0.5x ═•═ 2.0x ►]                │
│ Current: 1.0x                       │
│                                     │
│ Animation Speed:                    │
│ [◄ 0.5x ═•═ 2.0x ►]                │
│ Current: 1.0x                       │
│                                     │
│ Opacity:                            │
│ [◄ 20% ═•═ 100% ►]                 │
│ Current: 100%                       │
│                                     │
│ ☑ Shadow Effect                    │
│ ☑ Outline Effect                   │
│ ☑ Pixel Scaling (Retro)            │
│                                     │
│ Pet Personality:                    │
│ ◉ Lazy    ○ Energetic               │
│ ○ Curious ○ Loyal                   │
│ ○ Chaotic                           │
│                                     │
│ [Save] [Reset to Defaults]          │
└────────────────────────────────────┘

           │
           ▼
┌────────────────────────────────────┐
│ 🔊 AUDIO SETTINGS                  │
├────────────────────────────────────┤
│ Master Volume:                      │
│ [◄ 0% ═════•═════ 100% ►]          │
│ Current: 50%                        │
│                                     │
│ ☑ Sound Effects Enabled            │
│ ☐ Mute All Sounds                  │
│                                     │
│ Individual Sounds:                  │
│ ☑ Meow      [==•==] 70%            │
│ ☑ Purr      [====•====] 80%        │
│ ☑ Eating    [=•=] 40%              │
│ ☐ Sleep     [====•====] 80%        │
│ ☑ Play      [===•===] 60%          │
│                                     │
│ 🔊 Test Sounds   [Meow] [Purr]     │
│                                     │
│ [Save] [Reset to Defaults]          │
└────────────────────────────────────┘

           │
           ▼
┌────────────────────────────────────┐
│ ⚙️ ADVANCED SETTINGS               │
├────────────────────────────────────┤
│ ☐ Debug Mode (Console logs)         │
│ ☐ Show FPS Counter                  │
│ ☐ Show Collision Boxes              │
│                                     │
│ DATA MANAGEMENT:                    │
│ [📥 Import Settings]                │
│ [📤 Export Settings]                │
│ [🗑️ Clear All Data]                 │
│                                     │
│ BROWSER DETECTION:                  │
│ Detected: Chrome 120.0.1234         │
│ Optimal Render: Canvas 2D           │
│                                     │
│ VERSION:                            │
│ Pixel Pets v1.0.0                   │
│ Last Updated: June 2024             │
│ [Check for Updates]                 │
│                                     │
│ [Save] [Reset to Defaults]          │
└────────────────────────────────────┘
```

---

## 5. ACCESSORY & COSMETICS FLOW

```
┌─────────────────────────────────────┐
│  USER UNLOCKS NEW ITEM              │
│  (Through play, achievements)       │
└────────────┬────────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ UNLOCK NOTIFICATION          │
    │                              │
    │ 🎉 New Item Unlocked!        │
    │    Wizard Hat                │
    │                              │
    │ [Equip Now] [Later]          │
    └────────┬─────────────────────┘
             │
      ┌──────┴────────┐
      │               │
      ▼               ▼
  ┌────────┐  ┌──────────────┐
  │Equipped│  │Saved to      │
  │now on  │  │Inventory     │
  │pet     │  │for later     │
  └────────┘  └───────┬──────┘
                      │
              ┌───────▼──────────┐
              │ Settings Page → │
              │ Appearance Tab  │
              │ Accessories     │
              │ Section         │
              └───────┬──────────┘
                      │
                      ▼
    ┌─────────────────────────────┐
    │  ACCESSORIES MENU           │
    ├─────────────────────────────┤
    │                             │
    │ Current Pet: Whiskers       │
    │ [Change Pet]                │
    │                             │
    │ HATS:                       │
    │ ☑ Wizard Hat (equipped)     │
    │ ☐ Pirate Hat               │
    │ ☐ Crown                    │
    │                             │
    │ GLASSES:                    │
    │ ☐ Sunglasses               │
    │ ☑ Nerd Glasses (equipped)  │
    │ ☐ Heart Glasses            │
    │                             │
    │ SCARVES:                    │
    │ ☐ Red Scarf                │
    │ ☐ Blue Scarf               │
    │ ☐ Striped Scarf            │
    │                             │
    │ [Preview] [Save]            │
    │                             │
    └─────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │ PET PREVIEW                  │
    │                              │
    │      🧙🐱                    │
    │                              │
    │ Whiskers with Wizard Hat     │
    │ and Nerd Glasses             │
    │                              │
    │ [◀ Previous] [Next ▶]        │
    │ [Save & Close]               │
    │                              │
    └──────────────────────────────┘
```

---

## 6. PROGRESSION & ACHIEVEMENTS FLOW

```
┌──────────────────────────────────────┐
│  GAMEPLAY PROGRESS TRACKING          │
│  (Background, automatic)             │
└────────────┬───────────────────────┬─┘
             │                       │
    ┌────────▼─────────┐   ┌────────▼────────┐
    │ Play Time        │   │ Interaction     │
    │ Accumulates      │   │ Count Tracks:   │
    │ each second      │   │ - Pets given    │
    │ pet is active    │   │ - Feeds given   │
    └────────┬─────────┘   │ - Play time     │
             │             │ - Toys thrown   │
             │             └────────┬────────┘
             │                      │
             └──────────┬───────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │  MILESTONE DETECTION        │
         │  (Service Worker checks)    │
         │                             │
         │ IF play_time >= 60 min      │
         │   → UNLOCK "Starter"        │
         │                             │
         │ IF pet_count >= 5           │
         │   → UNLOCK "Collector"      │
         │                             │
         │ IF feed_count >= 10         │
         │   → UNLOCK "Caretaker"      │
         │                             │
         │ IF play_count >= 20         │
         │   → UNLOCK "Playmate"       │
         └────────┬────────────────────┘
                  │
                  ▼
         ┌──────────────────────┐
         │ ACHIEVEMENT UNLOCKED │
         │                      │
         │ 🏆 CARETAKER         │
         │ Fed your pet 10 times│
         │                      │
         │ REWARD:              │
         │ ✓ Chef Hat unlocked  │
         │ ✓ +50 experience     │
         │                      │
         │ [View All Achievements]   │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────────────┐
         │ ACHIEVEMENT DISPLAY          │
         │ (In Popup or Settings)       │
         │                              │
         │ 🏆 ACHIEVEMENTS              │
         │                              │
         │ ✓ First Pet                  │
         │   Spawn your first pet       │
         │   Unlocked: 1 hour ago       │
         │                              │
         │ ✓ Caretaker                  │
         │   Feed your pet 10 times     │
         │   Unlocked: 15 min ago       │
         │   Reward: Chef Hat           │
         │                              │
         │ ◇ Playmate (Locked)          │
         │   Play with pet 20 times     │
         │   Progress: 12/20            │
         │                              │
         │ [View Rewards] [Share]       │
         │                              │
         └──────────────────────────────┘
```

---

## 7. MULTI-PET MANAGEMENT FLOW

```
┌───────────────────────────────────┐
│  USER SPAWNS SECOND PET           │
│  (via popup [➕ New Pet])          │
└──────────────┬────────────────────┘
               │
               ▼
      ┌──────────────────────┐
      │  PET SELECTION       │
      │  Choose from:        │
      │  ☐ Classic Cat       │
      │  ☑ Puppy             │
      │  ☐ Black Cat         │
      │  ☐ Bunny             │
      │  ☐ Fox               │
      │  ... (more)          │
      │  [Upload Custom]     │
      │  [Cancel] [Select]   │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │  NAMING              │
      │  Pet Name:           │
      │  [Max       ]        │
      │  [Cancel] [Create]   │
      └──────────┬───────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │  QUICK CONFIG        │
      │  Size:    [80px  ]   │
      │  Speed:   [1.0x  ]   │
      │  Personality:        │
      │  ◉ Energetic         │
      │  [Create Pet]        │
      └──────────┬───────────┘
                 │
                 ▼
   ┌─────────────────────────────┐
   │  PET 2 SPAWNED              │
   │  Both pets visible on page  │
   │  Moving independently       │
   │                             │
   │  Popup now shows:           │
   │  🐱 Whiskers (Selected)     │
   │  [▼ Switch Pet]             │
   │  🐶 Max (Companion)         │
   │  [▼ Switch Pet]             │
   │                             │
   │  [🐾] [🍖] [🎮] (controls   │
   │        apply to selected)   │
   │                             │
   │  [➕ Add Pet] (up to 5/5)    │
   └─────────────────────────────┘
             │
             ▼
   ┌──────────────────────────┐
   │  MULTI-PET BEHAVIORS    │
   │                          │
   │  Settings → Behavior Tab │
   │  Movement Pattern:       │
   │  ◉ Independent           │
   │  ○ Group Follow          │
   │  ○ Follow Leader (Pet 1) │
   │  [Save]                  │
   └──────────────────────────┘
             │
             ▼
   ┌──────────────────────────┐
   │  PETS INTERACT           │
   │                          │
   │  If "Group Follow"       │
   │  → All pets follow       │
   │     cursor together      │
   │                          │
   │  If "Independent"        │
   │  → Each pet has own      │
   │     movement logic       │
   │                          │
   │  Collision Avoidance:    │
   │  → Pets push each other  │
   │     apart naturally      │
   └──────────────────────────┘
```

---

## 8. INTERACTIVE PLAY SEQUENCES

### 8.1 Petting Sequence
```
User Clicks Pet
     │
     ▼
Detection: Click within pet bounds
     │
     ▼
Animation Start: happy_pet (5 frames, 0.5s)
     │
     ▼
Particle Effect: Hearts spawn at pet position
     │      Duration: 1 second
     │      Fade out smoothly
     │
     ▼
Sound Effect: Purr sound plays (if enabled)
     │      Volume: User setting
     │      Duration: 1.5 seconds
     │
     ▼
Mood Update: +15 happiness points
     │      Update stats display
     │
     ▼
Reaction: Back to idle/walk state
```

### 8.2 Feeding Sequence
```
User Clicks [Feed] in Popup
     │
     ▼
Food Selection Menu Opens
     ├─ 🐠 Fish
     ├─ 🍖 Meat
     ├─ 🍪 Snack
     └─ [Cancel]
     │
     ▼
User Selects Food Item
     │
     ▼
Animation: eating (4 frames, 2 seconds)
     │      Mouth opens/closes
     │      Pet lowers to ground
     │
     ▼
Particle Effect: Food particles float away
     │
     ▼
Sound Effects:
     │ - Eating sounds (chewing, gulping)
     │ - Happy sound after
     │
     ▼
Stats Update:
     │ Happiness: +30 points
     │ Energy: +20 points
     │ Sleepiness: +10 points
     │
     ▼
Reaction: happy_celebration animation
     │      Pet bounces or jumps
     │      Shows "Happy!" emote
     │
     ▼
Return to normal state after 3 seconds
```

### 8.3 Toy Play Sequence
```
User Clicks [Play] in Popup
     │
     ▼
Toy Selection Menu Opens
     ├─ ⚽ Ball
     ├─ 🧶 Yarn
     ├─ 🪤 Mouse
     ├─ 💡 Laser
     └─ [Cancel]
     │
     ▼
User Selects Toy & Drags to Position
     │
     ▼
Animation: Throwing animation (0.3s)
     │      Pet motion toward toy
     │
     ▼
Toy Appears at Target Position
     │
     ▼
Animation: Chase sequence starts
     │ - Pet runs toward toy
     │ - Smooth pathfinding
     │ - Speeds vary by toy type
     │
     ▼
Sound Effects:
     │ - Toy impact sound
     │ - Pet running sounds
     │ - Happy sounds during play
     │
     ▼
Particle Trail: Behind toy/pet
     │
     ▼
Pet Reaches Toy (within 10px)
     │
     ▼
Animation: Play animation
     │      Pouncing, batting, etc.
     │
     ▼
Stats Update:
     │ Energy: -15 points
     │ Happiness: +20 points
     │ Play Count: +1
     │
     ▼
Optional: Pet becomes sleepy
     │      (If energy very low)
     │      May nap for 30-60 seconds
     │
     ▼
Return to idle state
```

---

## 9. CONTEXT-AWARE BEHAVIOR FLOW

```
┌──────────────────────────────┐
│  BROWSER EVENT DETECTED      │
└────┬─────────────────────────┘
     │
     ├─► NEW TAB OPENED
     │   Animation: Wave
     │   Duration: 1 second
     │   Sound: Happy chirp
     │
     ├─► PAGE SCROLLING
     │   Animation: Wobble/lose balance
     │   Duration: 0.5s per scroll
     │   Movement: Pet stumbles
     │
     ├─► RAPID MOUSE MOVEMENT
     │   Speed Boost: 1.5x for 2 seconds
     │   Animation: Running state
     │   Sound: Excited noises
     │
     ├─► INACTIVITY (30+ min)
     │   Animation: Yawn, sleep
     │   Position: Curl up on screen
     │   Duration: Until user moves mouse
     │   Sound: Soft snoring
     │
     ├─► TAB REFOCUS (from sleep)
     │   Animation: Wake up, stretch
     │   Duration: 1.5 seconds
     │   Sound: Yawn sound
     │
     └─► RAPID CLICKING
         Animation: Excited jumps
         Duration: While clicking happens
         Sound: Excited meowing
```

---

## 10. SETTINGS PERSISTENCE FLOW

```
┌────────────────────────────┐
│  USER CHANGES SETTING      │
│  (Any field in settings)   │
└───────────┬────────────────┘
            │
            ▼
     ┌─────────────────┐
     │ Immediate Save  │
     │ (on change)     │
     └────────┬────────┘
              │
              ▼
     ┌────────────────────────────┐
     │ chrome.storage.local.set() │
     │ Updates setting key        │
     └────────┬───────────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ Service Worker         │
     │ Receives message       │
     │ Validates new value    │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ Content Script Updated │
     │ Reads from storage     │
     │ Applies changes live   │
     └────────┬───────────────┘
              │
              ▼
     ┌────────────────────────┐
     │ UI Feedback            │
     │ [✓ Saved]              │
     │ Toast notification     │
     │ Fade after 2 seconds   │
     └────────────────────────┘
```

---

## 11. STATE DIAGRAM: PET LIFECYCLE

```
                 ┌────────────┐
                 │   SPAWN    │
                 └─────┬──────┘
                       │
                       ▼
                   ┌────────┐
    ┌─────────────►│ IDLE   │◄─────────┐
    │              └───┬────┘          │
    │                  │               │
    │          ┌───────┴────────┐      │
    │          │                │      │
    │          ▼                ▼      │
    │       ┌──────────┐    ┌────────┐ │
    │       │ WALKING  │    │RUNNING │ │
    │       └──┬───────┘    └──┬─────┘ │
    │          │               │       │
    │          └───────┬───────┘       │
    │                  │               │
    │                  ▼               │
    │          ┌───────────────┐       │
    │          │ INTERACTIONS  │       │
    │          └───────┬───────┘       │
    │                  │               │
    │         ┌────────┴────────┐      │
    │         │                 │      │
    │         ▼                 ▼      │
    │    ┌────────┐        ┌────────┐  │
    │    │JUMPING │        │SITTING │  │
    │    └────┬───┘        └───┬────┘  │
    │         │                │       │
    │         └────────┬───────┘       │
    │                  │               │
    │                  ▼               │
    │          ┌──────────────┐        │
    │          │  EATING      │        │
    │          └────┬─────────┘        │
    │               │                  │
    │               ▼                  │
    │          ┌──────────────┐        │
    │          │  SLEEPING    │        │
    │          └────┬─────────┘        │
    │               │                  │
    └───────────────┘ (after delay)    │
                                       │
                    ┌──────────────────┘
                    │
                    ▼
                ┌─────────┐
                │ DELETED │
                └─────────┘
```

---

## 12. ERROR RECOVERY FLOW

```
┌─────────────────────────────┐
│  ERROR DETECTED             │
│  (Storage, Animation, etc)  │
└────────────┬────────────────┘
             │
             ▼
     ┌──────────────────┐
     │ Attempt Recovery │
     │ (Retry 3 times)  │
     └────────┬─────────┘
              │
         ┌────┴────┐
         │          │
    YES  ▼          ▼  NO
   ┌────────┐  ┌─────────────┐
   │Success │  │Fallback Mode│
   │        │  │             │
   │Continue│  │Pet becomes  │
   │normally│  │static but   │
   └────────┘  │visible      │
               │             │
               │Settings     │
               │still work   │
               │             │
               │Log error to │
               │console      │
               │(debug mode) │
               └─────────────┘
                     │
                     ▼
           ┌──────────────────┐
           │ Try to Reload    │
           │ on Tab Refocus   │
           └──────────────────┘
```

---

## 13. DATA MIGRATION FLOW (On Extension Update)

```
┌─────────────────────────────┐
│  EXTENSION UPDATES          │
│  (v1.0 → v1.1)             │
└────────────┬────────────────┘
             │
             ▼
    ┌────────────────────┐
    │ onInstalled event  │
    │ triggered          │
    └────────┬───────────┘
             │
             ▼
   ┌─────────────────────────┐
   │ Check storage version   │
   │ Current: v1.0           │
   │ Required: v1.1          │
   └────────┬────────────────┘
            │
            ▼
   ┌─────────────────────┐
   │ Run migrations:     │
   │ 1. Add new fields   │
   │ 2. Transform data   │
   │ 3. Validate schema  │
   └────────┬────────────┘
            │
            ▼
   ┌─────────────────────┐
   │ Update version tag  │
   │ v1.0 → v1.1        │
   └────────┬────────────┘
            │
            ▼
   ┌─────────────────────┐
   │ Notify user         │
   │ (if major version)  │
   │ Changelog popup     │
   └─────────────────────┘
```

---

## 14. EXPORT/IMPORT SETTINGS FLOW

```
┌───────────────────────────────────┐
│  USER CLICKS EXPORT SETTINGS      │
│  (Advanced Settings Tab)          │
└──────────────┬────────────────────┘
               │
               ▼
      ┌──────────────────────┐
      │ Gather all settings: │
      │ - Pet configs        │
      │ - Accessories owned  │
      │ - User settings      │
      │ - Achievements       │
      │ - Stats              │
      └──────────┬───────────┘
                 │
                 ▼
      ┌─────────────────────────┐
      │ Convert to JSON         │
      │ Add version metadata    │
      │ Add export timestamp    │
      └──────────┬──────────────┘
                 │
                 ▼
      ┌──────────────────────────┐
      │ Create Download File     │
      │ pixel-pets-backup.json   │
      │ (Browser download)       │
      │                          │
      │ [Save] [Cancel]          │
      └──────────────────────────┘

┌─────────────────────────────────────┐
│  USER CLICKS IMPORT SETTINGS        │
│  (Advanced Settings Tab)            │
└────────────┬──────────────────────┬─┘
             │                      │
             ▼                      ▼
    ┌─────────────────┐  ┌─────────────────┐
    │ [Choose File]   │  │ Drag & Drop     │
    │ File selector   │  │ JSON file here  │
    │ opens           │  └────────┬────────┘
    └────────┬────────┘           │
             │                    │
             └────────┬───────────┘
                      │
                      ▼
           ┌──────────────────────┐
           │ Parse JSON file      │
           │ Validate schema      │
           │ Check version compat │
           └──────────┬───────────┘
                      │
                 ┌────┴────┐
                 │          │
            VALID          INVALID
                 │          │
                 ▼          ▼
            ┌────────┐   ┌──────────┐
            │Confirm │   │Error     │
            │Replace?│   │Message   │
            └────┬───┘   │Explain   │
                 │       │issue     │
                 ▼       └──────────┘
          ┌──────────────┐
          │Merge/Replace │
          │current data? │
          │              │
          │[Merge]       │
          │[Replace]     │
          │[Cancel]      │
          └──────┬───────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Write to chrome.      │
        │ storage.local        │
        │ Reload content       │
        │ scripts with new     │
        │ settings applied     │
        └──────────────────────┘
```

---

## 15. UNINSTALL CLEANUP FLOW

```
┌────────────────────────────────┐
│  EXTENSION UNINSTALLED         │
└────────────┬───────────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ onUninstalled event  │
    │ Service Worker       │
    │ triggered            │
    └────────┬─────────────┘
             │
             ▼
    ┌───────────────────────────┐
    │ Clean up resources:       │
    │ 1. Clear chrome.storage   │
    │ 2. Remove listeners       │
    │ 3. Terminate loops        │
    │ 4. Cancel alarms          │
    └────────┬──────────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Remove all content     │
    │ scripts from tabs      │
    │ Destroy Shadow DOM     │
    │ Clear canvas elements  │
    └────────┬───────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Optional: Open         │
    │ Feedback/Uninstall    │
    │ Survey Page            │
    │ (request user info)    │
    └────────────────────────┘
```

---

## APPENDIX: QUICK REFERENCE STATE CODES

| State | Code | Duration | Next State |
|-------|------|----------|-----------|
| IDLE | `idle` | Loop | walk/run/sleep |
| WALKING | `walk` | Loop | idle/run |
| RUNNING | `run` | Loop | walk/idle |
| SLEEPING | `sleep` | 2-5 min | idle |
| JUMPING | `jump` | 0.5s | idle |
| EATING | `eat` | 2s | happy |
| HAPPY | `happy` | 1s | idle |
| PLAYING | `play` | Varies | tired |
| TIRED | `tired` | 30s | sleep |

