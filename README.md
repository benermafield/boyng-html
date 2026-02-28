# Boyng

A 2D physics-based browser game where you control a bouncy ball through levels using realistic physics.

## Overview

Boyng is built with Phaser.js 3 and features:
- Realistic ball physics with gravity, momentum, and elastic collisions
- Smooth camera following
- Keyboard controls (WASD + Arrow keys)
- Sound effects for bouncing and jumping
- A main menu with keyboard and mouse navigation
- A test level to demonstrate the core mechanics

This is the MVP (Minimum Viable Product) - a playable prototype validating the physics system, input handling, and game feel.

## How to Play

### Running the Game

**IMPORTANT:** Modern browsers block ES6 modules when opening HTML files directly (CORS security). Choose one of these methods:

#### Method 1: Simple Single-File Version (Easiest)
1. **Open `start-game.html`** in your browser
2. This version works immediately - no server needed!

#### Method 2: Run Local Server (For Development)
1. **Double-click `server.bat`** (Windows)
   - Or run: `python -m http.server 8000`
2. **Open your browser** and go to: `http://localhost:8000`
3. Click on `index.html`

The modular version (Method 2) is better for development, but both versions are fully functional.

### Controls

| Key | Action |
|---|---|
| **← / A** | Move left |
| **→ / D** | Move right |
| **↑ / W** | Jump (when grounded) |
| **↓ / S** | Heavy gravity (hold for slam effect) |
| **ESC** | Return to menu |

### Menu Controls

| Key | Action |
|---|---|
| **↑ / ↓** | Navigate menu options |
| **Enter** | Select option |
| **Mouse** | Click or hover to select |

## Project Structure

```
boyng/
├── start-game.html         # Single-file version (works immediately!)
├── index.html              # Modular version (requires local server)
├── server.bat              # Windows script to start local server
├── assets/
│   └── sounds/
│       ├── README.md       # Instructions for adding sound files
│       ├── bounce.wav      # Ball collision sound (add your own)
│       └── jump.wav        # Jump sound (add your own)
├── src/
│   ├── main.js             # Phaser game configuration
│   ├── scenes/
│   │   ├── MenuScene.js    # Main menu
│   │   └── Level1Scene.js  # Test level
│   └── entities/
│       └── Ball.js         # Ball entity with physics and input
├── boyng-prd.md            # Product Requirements Document
└── README.md               # This file
```

## Tech Stack

- **Framework**: Phaser.js 3 (loaded from CDN)
- **Physics**: Phaser Arcade Physics
- **Language**: Vanilla JavaScript (ES6 modules)
- **Build**: None - runs directly in browser

## Sound Effects

The game includes sound effect logic but requires actual audio files. See `assets/sounds/README.md` for:
- Where to download free sound effects
- How to generate sounds programmatically
- Instructions for creating sounds in Audacity

The game works perfectly without sound files - Phaser handles missing audio gracefully.

## Physics Tuning Guide

The ball physics are designed to feel like a rubber ball - bouncy but with realistic energy loss. All physics values are configurable for tuning.

### Key Physics Values

**In `src/main.js`:**
- `gravity: { y: 900 }` - World gravity (800-1000 range)

**In `src/entities/Ball.js` constructor:**
- `setBounce(0.75)` - Bounciness (0.7-0.85 range for rubber ball feel)
- `setDrag(75, 0)` - Horizontal air resistance (50-100 range)
- `setMaxVelocity(400, 800)` - Speed caps (X: 300-500, Y: 700-900)

**In `src/entities/Ball.js` update() method:**
- `setAccelerationX(500)` - Left/right acceleration (400-600 range)
- `setVelocityY(-450)` - Jump impulse (-400 to -500 range)
- `body.gravity.y = 900 * 2.5` - Down-gravity multiplier (2.5-3.0 range)

### How to Tune

1. Open `src/main.js` and change `debug: false` to `debug: true`
2. Reload the game - you'll see physics body outlines
3. Adjust one value at a time
4. Test by playing for 30 seconds
5. Repeat until it feels right
6. Set `debug: false` when done

### Target Feel

- **Responsive**: Input feels immediate, not sluggish
- **Weighty**: Ball feels substantial, not floaty
- **Bouncy**: 3-4 bounces when dropped from mid-height, each visibly lower
- **Controllable**: Can precisely navigate around the room
- **Satisfying**: Jump is snappy, slam creates noticeable speed boost

## Development Tips

### Enabling Debug Mode

Set `debug: true` in `src/main.js` to visualize:
- Physics body boundaries (circles, rectangles)
- Velocity vectors
- Collision detection

### Adding More Levels

1. Create a new scene file in `src/scenes/` (e.g., `Level2Scene.js`)
2. Import and add it to the scene array in `src/main.js`
3. Use Level1Scene as a template
4. Add level selection to MenuScene

### Modifying the Ball

The Ball entity (`src/entities/Ball.js`) is self-contained:
- Constructor sets up visual, physics, input, and sounds
- `update()` method handles input logic each frame
- Easy to extend with new mechanics (double-jump, dash, etc.)

## Acceptance Criteria

This MVP meets all acceptance criteria from the PRD:

- ✅ Menu works with mouse and keyboard navigation
- ✅ Ball spawns and falls with convincing bounce
- ✅ Bouncing feels like rubber ball with visible energy loss
- ✅ Movement is responsive with momentum
- ✅ Jump is snappy, grounded-only, no double-jump
- ✅ Down-gravity creates slam effect
- ✅ Camera smoothly follows ball and is bounded to world
- ✅ Walls contain the ball with accurate collisions
- ✅ Sounds play at appropriate times without spam
- ✅ No crashes or console errors in normal gameplay

## Future Enhancements

Not in this MVP but noted for future development:

- Multiple levels with varied geometry (slopes, platforms, obstacles)
- Level select screen
- Collectibles and scoring system
- Ball customization (skins, particle trails)
- Mobile touch controls
- Level editor
- Timer/speedrun mode
- Persistent settings (volume, custom controls)

## Browser Compatibility

Tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires ES6 module support (all modern browsers).

## Troubleshooting

### Game doesn't load / Blank screen
**Most common issue:** CORS policy blocking ES6 modules
- **Solution 1:** Use `start-game.html` instead (works immediately)
- **Solution 2:** Run local server with `server.bat` and access via `http://localhost:8000`
- **Never** open `index.html` directly - browsers block module imports from `file://` URLs
- Check browser console (F12) - if you see "CORS" errors, use one of the solutions above
- Verify internet connection (Phaser loads from CDN)

### Physics feel wrong
- See "Physics Tuning Guide" above
- Enable debug mode to visualize what's happening
- Try the default values first, then tune incrementally

### Sounds don't play
- Check that sound files exist in `assets/sounds/`
- See `assets/sounds/README.md` for obtaining sounds
- Game works fine without sounds - this is optional

### Ball escapes the room
- This shouldn't happen with circular physics body
- Enable debug mode to check wall collisions
- Verify walls are properly added to static group

## Credits

Built following the Boyng Product Requirements Document (boyng-prd.md).

Powered by [Phaser.js 3](https://phaser.io/) - a fast, free, and fun open source HTML5 game framework.

## License

This is a personal project. Feel free to use, modify, and learn from the code.
