# UI/UX DESIGN BRIEF
## Pixel Pets - Chrome Extension

**Design Style:** Neo Brutalism  
**Version:** 1.0  
**Last Updated:** June 2024  

---

## 1. DESIGN PHILOSOPHY: NEO BRUTALISM

### Core Principles
Neo Brutalism is a modern design movement that combines traditional layout concepts with:
- **Super High Contrast** - Bold, clashing color combinations
- **Solid, Intentional Shapes** - Strong geometric forms, clear boundaries
- **Unrefined Aesthetic** - Raw edges, obvious grid structures, no pseudo-realism
- **Unique Typography** - Distinctive, playful font choices
- **Direct Communication** - No unnecessary embellishment or shadows

### Why Neo Brutalism for Pixel Pets?
1. **Retro Alignment:** Matches pixel art/retro gaming aesthetic
2. **Personality:** Conveys playfulness and distinctiveness
3. **Accessibility:** High contrast ensures readability and accessibility
4. **Modern Feel:** Contradicts nostalgic content with contemporary design
5. **Memorable:** Users remember bold, distinctive interfaces

---

## 2. COLOR PALETTE

### Primary Colors (High Contrast, Clashing)
```
MAGENTA/HOT PINK:    #FF1B9C | RGB(255, 27, 156)
CYAN/TURQUOISE:      #00D9FF | RGB(0, 217, 255)
LIME GREEN:          #BFFF00 | RGB(191, 255, 0)
DEEP PURPLE:         #2D1B69 | RGB(45, 27, 105)
```

### Secondary Colors
```
BRIGHT YELLOW:       #FFD700 | RGB(255, 215, 0)
ELECTRIC ORANGE:     #FF6B00 | RGB(255, 107, 0)
NEON PINK:           #FF00FF | RGB(255, 0, 255)
BRIGHT TEAL:         #00CED1 | RGB(0, 206, 209)
```

### Neutral Colors (For Balance)
```
WHITE:               #FFFFFF | RGB(255, 255, 255)
OFF-WHITE:           #F5F5F5 | RGB(245, 245, 245)
CHARCOAL:            #1A1A1A | RGB(26, 26, 26)
DARK GRAY:           #333333 | RGB(51, 51, 51)
MEDIUM GRAY:         #666666 | RGB(102, 102, 102)
```

### Color Usage Rules
```
Background Pairs (High Contrast):
- CHARCOAL + LIME GREEN
- DEEP PURPLE + CYAN
- WHITE + MAGENTA
- WHITE + DEEP PURPLE
- CHARCOAL + YELLOW

Accent Combinations (Intentional Clashing):
- MAGENTA + CYAN (opposite on color wheel)
- LIME GREEN + MAGENTA (high saturation clash)
- ORANGE + CYAN (complementary)
- PINK + LIME GREEN (playful clash)

Use Rule:
- No neutrals between contrasting colors
- Let colors clash intentionally
- Avoid gradient smoothing (use solid colors)
- Maximum 2-3 colors per component
```

### Accessibility
- All color combinations meet WCAG AAA contrast ratio (7:1+)
- Don't rely on color alone (use icons, labels, patterns)
- High saturation aids visual distinction for colorblind users

---

## 3. TYPOGRAPHY

### Font Families

#### Primary Headline Font
**Name:** JetBrains Mono Bold (or Courier Prime Bold as fallback)  
**Usage:** Page titles, section headers, popup titles  
**Characteristics:**
- Monospace, distinctive, raw
- Bold weight for impact
- All-caps for headers (matching brutalist aesthetic)
- Letter-spacing: +2px (extra space, raw feel)

```css
font-family: 'JetBrains Mono', 'Courier Prime', monospace;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 2px;
```

#### Body Text Font
**Name:** Inter Medium (or Trebuchet MS as fallback)  
**Usage:** Settings labels, descriptions, body copy  
**Characteristics:**
- Clean, geometric, modern sans-serif
- Medium weight for readability
- Clear distinction from headers

```css
font-family: 'Inter', 'Trebuchet MS', sans-serif;
font-weight: 500;
letter-spacing: 0.5px;
```

#### Monospace Accent Font
**Name:** Space Mono Bold  
**Usage:** Stats, numbers, code-like elements  
**Characteristics:**
- Distinctive monospace style
- Perfect for retro/tech aesthetic
- Used sparingly for visual interest

```css
font-family: 'Space Mono', monospace;
font-weight: 700;
```

### Font Sizing & Hierarchy

```
SIZE            | USAGE                      | LINE-HEIGHT
──────────────────────────────────────────────────────────
32px (bold)     | Main page titles          | 1.2
24px (bold)     | Section headers           | 1.2
18px (bold)     | Subsection headers        | 1.3
14px (medium)   | Body text, labels         | 1.5
12px (medium)   | Small text, captions      | 1.4
10px (medium)   | Tiny text, helper text    | 1.3
```

### Typography Rules
1. **All-Caps Headers:** Use UPPERCASE for all H1-H3 elements
2. **No Decorative Fonts:** Stick to readable fonts (no cursive/script)
3. **Bold Contrast:** Headers must be 2-3 times darker than body
4. **Raw Edges:** No text shadows, no outlines (unless brutalist accent)
5. **Generous Spacing:** More line-height than typical (1.5+)

---

## 4. SPACING & GRID

### Unit System
- **Base Unit:** 8px (foundation for all spacing)
- **Multiples:** 8px, 16px, 24px, 32px, 40px, 48px, 56px, 64px

### Spacing Rules
```
Padding:
- Buttons: 12px horizontal, 8px vertical (1.5x base)
- Cards: 20px all sides (2.5x base)
- Container: 24px (3x base)

Margins:
- Between sections: 32px (4x base)
- Between components: 16px (2x base)
- Between elements: 8px (1x base)

Gaps (Flexbox):
- Tight grid: 8px
- Normal spacing: 16px
- Loose spacing: 24px
```

### Grid Structure
- **Width:** 8-column grid for all layouts
- **Breakpoints:** Single responsive breakpoint (mobile: full width)
- **Container Max-Width:** 400px (popup), 800px (settings page)
- **Gutters:** 16px between columns

---

## 5. COMPONENT LIBRARY

### 5.1 Buttons

#### Primary Button (Call-to-Action)
```
Style: Solid background with thick border
Colors: MAGENTA background (#FF1B9C)
        WHITE text
        CYAN border (3px, very visible)
Padding: 12px 20px
Border: 3px solid #00D9FF
Hover: LIME GREEN background
       MAGENTA border
       Scale slightly up (1.05x)
Active: Darker MAGENTA (#D4157F)
Disabled: GRAY background, gray border
```

Visual:
```
┌─ ─ ─ ─ ─ ─ ─ ─ ┐
│ SPAWN PET    ▼ │  ← Cyan border (thick)
└─ ─ ─ ─ ─ ─ ─ ─ ┘
  ↑ Hot Pink background
```

#### Secondary Button
```
Style: White background with dark border
Colors: WHITE background
        CHARCOAL text
        DEEP PURPLE border (2px)
Padding: 10px 18px
Border: 2px solid #2D1B69
Hover: CYAN background
       CHARCOAL text
       MAGENTA border
```

#### Icon Button
```
Size: 40px x 40px
Shape: Square (no border-radius)
Colors: Solid colored background
        Contrasting icon color
Border: 2px border if needed
Hover: Invert foreground/background
```

---

### 5.2 Input Fields

#### Text Input / Number Input
```
Style: Minimal borders, high contrast
Background: WHITE or OFF-WHITE (#F5F5F5)
Border: 2px solid DEEP PURPLE
Text color: CHARCOAL
Focus: 3px solid CYAN border
       LIME GREEN background (subtle, 5% opacity)
Padding: 10px 12px
```

Visual:
```
┌─────────────────────┐
│ Pet Name: Whiskers  │  ← Purple border (2px)
└─────────────────────┘
Focus state:
┌═════════════════════┐  ← Cyan border (3px)
│ Pet Name: Whiskers  │
└═════════════════════┘
```

#### Checkbox / Toggle
```
Style: Bold, obvious, no subtle effects
Size: 20px x 20px
Unchecked: White background + DEEP PURPLE border (2px)
Checked: MAGENTA background + checkmark icon
Hover: LIME GREEN border
```

#### Slider
```
Track: 6px height, CHARCOAL background
Thumb: 24px x 24px, MAGENTA color
       CYAN border (2px around thumb)
       Scale up on hover
Range: Bold ticks every 25%
Labels: DEEP PURPLE text, all-caps
```

---

### 5.3 Cards & Containers

#### Settings Card
```
Layout: 100% width minus padding
Background: WHITE
Border: 3px solid DEEP PURPLE
Padding: 20px
Margin-bottom: 16px
Shadow: NONE (neo-brutalism rejects shadows)
```

#### Pet Profile Card
```
Layout: Vertical stack
Background: LIME GREEN (#BFFF00)
Border: 4px solid DEEP PURPLE
Padding: 16px
Contains:
  - Pet image/avatar (80x80px)
  - Pet name (18px bold)
  - Stats (12px regular)
  - Action buttons
```

#### Stats Display
```
Layout: 3-column grid
Item format:
  [Stat Icon] [Stat Value] [Stat Label]
  
Colors: CHARCOAL icons, MAGENTA value, DEEP PURPLE label
Border: Individual 2px CYAN border around each
Spacing: 8px gap
```

---

### 5.4 Modals & Popups

#### Popup Menu (Extends from Pet)
```
Style: Floating rectangle with arrow pointing to pet
Background: WHITE
Border: 3px MAGENTA
Arrow: MAGENTA border, WHITE fill
Padding: 16px
Shadow: NONE (use border for depth)
Z-index: 999999
```

Visual:
```
    ┌──────────────┐
    │ [🐾] [🍖]  │
    │ [🎮] [⚙️]  │
    └──────────────┘
           ▼ ← Arrow
        🐱
```

#### Modal Dialog (Settings)
```
Style: Full-screen overlay with centered content
Background: CHARCOAL (#1A1A1A) with opacity
Modal Box: WHITE background, 3px MAGENTA border
Width: 90% on mobile, 600px on desktop
Padding: 32px
Close button: TOP-RIGHT corner, 3px CYAN border
```

---

### 5.5 Navigation & Tabs

#### Tab Navigation (Settings)
```
Style: Horizontal tabs with underlines (neo-brutalism style)
Inactive Tab: CHARCOAL text, no underline
Active Tab: MAGENTA text, 3px MAGENTA underline
Hover: CYAN underline, DEEP PURPLE text
Spacing: 24px between tabs
Font: 14px bold, all-caps
```

Visual:
```
GENERAL    PETS    APPEARANCE    AUDIO    ADVANCED
          ├─────────┐
          │ (active)│
          └─────────┘ ← 3px MAGENTA underline
```

---

### 5.6 Animations & Interactions

#### Button Hover
- Scale: 1.05x
- Border changes color (MAGENTA → CYAN)
- No shadow (brutalism style)
- Transition: 200ms ease

#### Input Focus
- Border expands 3px → 4px
- Background tint: +5% of color
- Cursor: pointer or text (context-dependent)
- Transition: 150ms ease

#### Modal Open/Close
- Scale animation: 0.9x → 1.0x (open), 1.0x → 0.9x (close)
- Fade: 0 → 1 (open)
- Duration: 300ms ease-out

#### Pet Interaction Response
- Pet animates immediately (no wait)
- Particle effects appear at pet location
- Background flash effect (brief color pulse)
- Sound triggers (if enabled)

---

## 6. LAYOUT SPECIFICATIONS

### 6.1 Popup Window (320px width)

```
┌────────────────────────────────┐
│ PIXEL PETS              [×]    │ ← Header (MAGENTA bg, CYAN text)
├────────────────────────────────┤
│                                 │
│  🐱 WHISKERS          [v Pet]   │ ← Pet selector
│                                 │
│  Mood:   ━━━━━━━●━━━ 75%      │
│  Energy: ━━━━●━━━━━━ 60%      │
│                                 │
├────────────────────────────────┤
│  [🐾 PET] [🍖 FEED] [🎮 PLAY] │ ← Action buttons
│                                 │
│  [🔊 MUTE]                     │
│  [⚙️ SETTINGS] [➕ NEW PET]    │
│                                 │
└────────────────────────────────┘
```

**Grid Breakdown:**
- Header: Full width, 48px height
- Pet display: Full width, 80px
- Stats: Full width, 60px
- Action buttons: 3-column grid, 8px gap
- Secondary actions: 2-column or full-width

---

### 6.2 Settings Page

```
┌────────────────────────────────────────────────────┐
│ PIXEL PETS SETTINGS                         [×]    │
├──────────────────────────────────────────────────────│
│                                                      │
│  GENERAL  │ PETS │ APPEARANCE │ AUDIO │ ADVANCED  │
│           │      │            │       │           │
├──────────────────────────────────────────────────────│
│                                                      │
│  ☑ ENABLE PIXEL PETS                              │
│                                                      │
│  ☐ AUTO-START ON STARTUP                          │
│                                                      │
│  ☑ PERFORMANCE MODE                               │
│    (Reduces effects for low-end devices)           │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ [SAVE]        [RESET TO DEFAULTS]            │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
└────────────────────────────────────────────────────┘
```

**Layout:**
- Tabs at top: 60px
- Content area: 80% of page width
- Padding: 24px all sides
- Max-width: 800px
- Section height: Variable (scroll if needed)

---

### 6.3 Pet Selection Screen

```
┌────────────────────────────────────┐
│ CHOOSE YOUR PET             [×]   │
├────────────────────────────────────┤
│                                     │
│  ┌──────────┐ ┌──────────┐        │
│  │   CAT    │ │  PUPPY   │        │
│  │   🐱     │ │   🐶     │        │
│  │(Classic) │ │(Loyal)   │        │
│  └──────────┘ └──────────┘        │
│                                     │
│  ┌──────────┐ ┌──────────┐        │
│  │  BUNNY   │ │   FOX    │        │
│  │   🐰     │ │   🦊     │        │
│  │(Curious) │ │(Energetic)│       │
│  └──────────┘ └──────────┘        │
│                                     │
│  [UPLOAD CUSTOM PET]               │
│                                     │
│  [CANCEL] [SELECT]                 │
│                                     │
└────────────────────────────────────┘
```

---

## 7. COLOR USAGE IN CONTEXT

### Settings Form Element
```
Component        | BG Color         | Text Color        | Border Color
─────────────────────────────────────────────────────────────────────
Label            | TRANSPARENT      | DEEP PURPLE       | NONE
Active Input     | OFF-WHITE        | CHARCOAL          | CYAN (3px)
Disabled Input   | GRAY (#EEEEEE)   | MEDIUM GRAY       | GRAY (2px)
Toggle ON        | MAGENTA          | WHITE             | MAGENTA (3px)
Toggle OFF       | WHITE            | CHARCOAL          | PURPLE (2px)
Primary Button   | MAGENTA          | WHITE             | CYAN (3px)
Hover Button     | LIME GREEN       | CHARCOAL          | MAGENTA (3px)
Success Message  | LIME GREEN       | CHARCOAL          | NONE
Error Message    | ORANGE (#FF6B00) | WHITE             | NONE
Warning Message  | YELLOW (#FFD700) | CHARCOAL          | NONE
```

---

## 8. VISUAL HIERARCHY

### Emphasis Levels
```
Level 1 (Maximum Emphasis):
- Large bold headers
- MAGENTA + CYAN combination
- 3px borders
- Used for: Main CTAs, pet names, critical info

Level 2 (Medium Emphasis):
- Regular headers
- DEEP PURPLE + LIME GREEN
- 2px borders
- Used for: Section titles, important controls

Level 3 (Background/Support):
- Small text
- CHARCOAL + WHITE
- No border or 1px border
- Used for: Helper text, secondary info

Level 4 (Minimal):
- Disabled/inactive states
- GRAY tones only
- Faded appearance
- Used for: Disabled buttons, hidden sections
```

---

## 9. RESPONSIVE DESIGN

### Mobile-First Approach (320px - 480px)

**Popup:**
- Full width minus 16px padding
- Single-column layout
- Buttons stack vertically
- Font size slightly increased for touch targets

**Settings Page:**
- Full-screen modal
- Tabs collapse to hamburger menu
- Content takes 100% width
- Form fields full-width
- Buttons stack

**Rules:**
- Minimum touch target: 44px x 44px
- No hover states on mobile (use active states)
- Increase font sizes by 10% on mobile
- Use bottom sheets for popups (easier thumb access)

---

## 10. ACCESSIBILITY REQUIREMENTS

### WCAG 2.1 AA Compliance

**Color Contrast:**
- All text: 4.5:1 ratio minimum
- Large text (18px+): 3:1 ratio
- All color combos verified using contrast checker

**Keyboard Navigation:**
- All buttons/inputs accessible via Tab key
- Focus indicators visible (min 3px border)
- Logical tab order (left-to-right, top-to-bottom)

**Motion & Animation:**
- Respect `prefers-reduced-motion` setting
- No animations longer than 5 seconds
- Animations should not auto-play (user-triggered)

**Icons & Images:**
- All icons have text labels (or aria-label)
- Pet images have alt text
- Icons not used alone for critical information

**Text Readability:**
- Minimum 12px font size for body text
- Line-height minimum 1.4
- Line-length maximum 70 characters
- All-caps text used sparingly (readability impact)

---

## 11. ICON SYSTEM

### Icon Set
Use simple, bold icons matching neo-brutalism aesthetic.

**Icons needed:**
- 🐱 Pet icon (generic)
- 🐾 Petting action
- 🍖 Feeding action
- 🎮 Playing action
- ⚙️ Settings
- 🔊 Sound on
- 🔇 Sound off
- 🗑️ Delete
- ➕ Add/New
- ✓ Checkmark
- ✕ Close
- ▼ Dropdown

**Icon Properties:**
- Size: Standardized to 16px, 24px, 32px
- Weight: Bold strokes (2-3px)
- Style: Geometric, simple shapes
- No detail/fine lines
- Monochromatic (match text color)

---

## 12. DARK MODE (Future Consideration)

### Dark Mode Color Inversion
```
Light                Dark
─────────────────────────
WHITE        ↔️     CHARCOAL
OFF-WHITE    ↔️     #222222
CHARCOAL     ↔️     WHITE
DEEP PURPLE  ↔️     CYAN
MAGENTA      ↔️     LIME GREEN

Rule: Swap opposite colors, maintain contrast
```

---

## 13. MICRO-INTERACTIONS

### Button Click Feedback
```
Timeline (200ms):
0ms:   Scale 1.0x, opacity 1.0
50ms:  Scale 1.08x (over-scale)
100ms: Scale 1.05x
200ms: Scale 1.0x, opacity 1.0

Visual:
Before: [Button]
Click:  [  Button  ] ← Larger
After:  [Button]
```

### Slider Interaction
```
Timeline (300ms):
0ms:   Thumb 20px x 20px
Drag:  Thumb 28px x 28px + glow effect
Release: Thumb returns to 20px x 20px
         Track position updated
```

### Pet Reaction
```
Timeline (500ms):
0ms:   Pet at position (x, y)
100ms: Pet shifts 5px up (reaction start)
250ms: Pet returns to (x, y)
300ms: Particle effect appears
500ms: Particle fades away
```

---

## 14. ANIMATION SPECIFICATIONS

### Duration Standards
- Quick interactions: 150-200ms
- Medium interactions: 250-300ms
- Slow interactions: 400-500ms
- Long animations: 1000ms+

### Easing Functions
- User interactions: `ease-out` (fast start, slow end)
- Idle animations: `ease-in-out` (smooth throughout)
- Notifications: `ease-in` (slow start, fast end)

### Transition Rule
```css
/* Universal transition class */
.transition-standard {
  transition: all 250ms ease-out;
}

.transition-quick {
  transition: all 150ms ease-out;
}

.transition-smooth {
  transition: all 400ms ease-in-out;
}
```

---

## 15. ERROR STATES & VALIDATION

### Input Validation States
```
Valid:
┌────────────────────┐
│ Pet Name: Whiskers │  ← LIME GREEN border (2px)
└────────────────────┘      ✓ (checkmark)

Invalid:
┌────────────────────┐
│ Pet Name:          │  ← ORANGE border (3px)
└────────────────────┘
Error message: "Pet name required" (ORANGE text)

Disabled:
┌────────────────────┐
│ Pet Name: —        │  ← GRAY border (2px)
└────────────────────┘     (text grayed out)
```

### Toast Notifications
```
Success (bottom-left):
┌─────────────────────────────┐
│ ✓ Settings saved           │  ← LIME GREEN bg
│                             │     WHITE text
└─────────────────────────────┘     3px CYAN border

Error (bottom-left):
┌─────────────────────────────┐
│ ✕ Failed to load pet       │  ← ORANGE bg
│                             │     WHITE text
└─────────────────────────────┘     3px MAGENTA border

Info (bottom-left):
┌─────────────────────────────┐
│ ⓘ Pet is sleeping         │  ← CYAN bg
│                             │     CHARCOAL text
└─────────────────────────────┘     3px DEEP PURPLE border

Auto-hide: 3-4 seconds
Animation: Slide in from left, fade out
```

---

## 16. REFERENCE MOOD BOARD

Based on uploaded images, we're extracting:

**Image 2 (GoPay App) Style Elements:**
- Bright, saturated colors (pink, teal, green)
- Playful yet functional layouts
- Clear visual hierarchy
- Colorful, distinct sections
- Icon-heavy navigation

**Image 3 (Dashboard) Style Elements:**
- Gradient backgrounds (use solid colors instead for neo-brutalism)
- Clear card separation
- Multiple sections clearly defined
- Modern sans-serif typography
- Good spacing and breathing room

**Neo-Brutalism Adaptation:**
- Replace gradients with solid high-contrast colors
- Keep clear card/section separation
- Maintain strong typography hierarchy
- Use thick, obvious borders instead of shadows
- Intensify color saturation for brutalist clash

---

## 17. DESIGN RULES (MUST FOLLOW)

### ✅ DO
- [ ] Use thick, obvious borders (2-3px minimum)
- [ ] Clash colors intentionally (MAGENTA + CYAN, LIME + PURPLE)
- [ ] Use all-caps for headers and CTAs
- [ ] Provide generous whitespace and padding
- [ ] Make interactive elements obvious (not subtle)
- [ ] Use solid colors (no gradients)
- [ ] Create clear visual hierarchy through size and weight
- [ ] Use high saturation colors
- [ ] Make hover/active states dramatic

### ❌ DON'T
- [ ] Add drop shadows (neo-brutalism rejects this)
- [ ] Use subtle color transitions
- [ ] Make interactive elements hard to find
- [ ] Use light gray on white (poor contrast)
- [ ] Add rounded corners (use sharp 90° angles or minimal radius)
- [ ] Use thin borders (minimum 2px)
- [ ] Use low-saturation colors
- [ ] Implement smooth gradients
- [ ] Hide important information
- [ ] Rely on color alone to communicate state

---

## 18. COMPONENT CHECKLIST

- [ ] Button (primary, secondary, icon)
- [ ] Input (text, number, checkbox, toggle)
- [ ] Slider/Range
- [ ] Dropdown/Select
- [ ] Modal/Dialog
- [ ] Notification/Toast
- [ ] Tab navigation
- [ ] Card/Panel
- [ ] Stats display
- [ ] Progress bar
- [ ] Pet avatar/image
- [ ] Loading indicator (animated)
- [ ] Tooltip (if needed)
- [ ] List items
- [ ] Form groups

---

## 19. IMPLEMENTATION GUIDELINES

### CSS Variables (Recommended)
```css
:root {
  /* Colors */
  --color-primary-magenta: #FF1B9C;
  --color-primary-cyan: #00D9FF;
  --color-primary-lime: #BFFF00;
  --color-primary-purple: #2D1B69;
  
  --color-secondary-yellow: #FFD700;
  --color-secondary-orange: #FF6B00;
  
  --color-neutral-white: #FFFFFF;
  --color-neutral-charcoal: #1A1A1A;
  --color-neutral-gray: #666666;
  
  /* Spacing */
  --spacing-unit: 8px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Typography */
  --font-family-header: 'JetBrains Mono', monospace;
  --font-family-body: 'Inter', sans-serif;
  --font-family-mono: 'Space Mono', monospace;
  
  /* Sizes */
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-body: 14px;
  --font-size-small: 12px;
  
  /* Borders */
  --border-thick: 3px solid;
  --border-medium: 2px solid;
  --border-thin: 1px solid;
  
  /* Transitions */
  --transition-quick: 150ms ease-out;
  --transition-medium: 250ms ease-out;
  --transition-slow: 400ms ease-in-out;
}
```

---

## 20. DESIGN RESOURCES

### Fonts (Web Import)
```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Inter:wght@500;700&family=Space+Mono:wght@700&display=swap" rel="stylesheet">
```

### Testing Contrast
- Use: https://webaim.org/resources/contrastchecker/
- All combinations must pass AAA (7:1 ratio)

### Color Validation
- Colorblind simulator: https://www.color-blindness.com/coblis-color-blindness-simulator/
- Verify all colors distinguishable by type

---

## DESIGN EXAMPLES

### Example 1: Settings Form (Neo-Brutalism Style)
```
┌────────────────────────────────────────┐
│ SIZE CUSTOMIZATION                   │ ← H2, DEEP PURPLE
├────────────────────────────────────────┤
│                                         │
│ SIZE (PIXELS)                           │ ← Label, all-caps
│ ┌─ 30px ──────●────── 150px ─┐        │ ← Slider
│ │   ◄             ►           │        │
│ │ [30] [80] [150]             │        │ ← Tick labels
│ └─────────────────────────────┘        │
│                                         │
│ CURRENT VALUE: 80PX                   │ ← Info text, MAGENTA
│                                         │
│ [SAVE] [RESET]                        │ ← Buttons
│                                         │
└────────────────────────────────────────┘
```

### Example 2: Pet Profile Card (Neo-Brutalism Style)
```
┌───────────────────────────────────────┐
│ WHISKERS                       [×]    │ ← Title + close button
├───────────────────────────────────────┤
│         🐱                             │ ← Large pet emoji/image
│                                       │
│  MOOD:    ━━━━━━●━━━ 75%             │ ← Stats
│  ENERGY:  ━━●━━━━━━  60%             │
│  SLEEP:   ━━━━━━━━●  85%             │
│                                       │
├───────────────────────────────────────┤
│  [🐾 PET] [🍖 FEED] [🎮 PLAY]        │ ← Action buttons (3-col)
│                                       │
│  PERSONALITY: LOYAL                   │ ← Info label
│  CREATED: 2 hours ago                │
│                                       │
└───────────────────────────────────────┘
```

---

## SIGN-OFF

**Design System Version:** 1.0  
**Status:** Ready for Development  
**Last Review:** June 2024  

This UI/UX Brief establishes a cohesive, bold, playful visual identity for Pixel Pets that combines the charm of retro pixel art with modern Neo-Brutalism design principles.

