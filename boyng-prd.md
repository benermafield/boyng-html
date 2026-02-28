# Boyng — Product Requirements Document

## Overview

**Boyng** is a 2D browser-based physics game where the player controls a bouncy ball navigating through levels. The ball responds to realistic physics — gravity, momentum, and elastic collisions with surfaces. The player uses keyboard input to accelerate, jump, and manipulate gravity to guide the ball through each level.

This document defines the MVP: a main menu and a single test level to validate the physics system, input handling, and core game feel.

---

## Tech Stack

| Component | Choice | Notes |
|---|---|---|
| **Framework** | Phaser.js 3 (latest stable) | Full 2D game framework with scene management, input, and physics |
| **Physics** | Phaser Arcade Physics | Simpler and more performant than Matter.js for this use case. Sufficient for axis-aligned bounding boxes, gravity, and bounce. Switch to Matter.js later if curved surfaces or complex shapes are needed |
| **Rendering** | Phaser's default Canvas/WebGL renderer | Phaser auto-selects WebGL with Canvas fallback |
| **Language** | Vanilla JavaScript (ES6+) | No TypeScript for now — keep iteration fast |
| **Build** | Single `index.html` loading Phaser from CDN + a `game.js` file (or small set of JS files) | No bundler needed for MVP. Introduce Vite later if the project grows |
| **Sound** | Phaser built-in audio manager | Procedurally generated or free SFX for bounce/jump |

---

## Project Structure

```
boyng/
├── index.html          # Entry point, loads Phaser + game scripts
├── assets/
│   └── sounds/
│       ├── bounce.wav  # Ball hits a surface
│       └── jump.wav    # Player-initiated jump
├── src/
│   ├── main.js         # Phaser game config and initialization
│   ├── scenes/
│   │   ├── MenuScene.js    # Main menu
│   │   └── Level1Scene.js  # Test level
│   └── entities/
│       └── Ball.js     # Ball class (physics body, input, rendering)
└── README.md
```

---

## Scenes

### 1. MenuScene (Main Menu)

**Purpose:** Title screen with navigation options.

**Requirements:**
- Display the game title "BOYNG" prominently, centered on screen
- Two menu options rendered as text buttons:
  - **Start Game** — transitions to `Level1Scene`
  - **Exit Game** — displays a "Thanks for playing!" message (there is no true "exit" in browser context, so this can close the tab via `window.close()` or simply show a farewell message)
- Menu options should be navigable via mouse click OR keyboard (Up/Down arrows to select, Enter to confirm)
- Minimal styling: solid background color, clean text, no assets required
- No music for MVP

### 2. Level1Scene (Test Level)

**Purpose:** A simple enclosed room to test and tune ball physics, input, and camera.

**Requirements:**
- A rectangular room that is **larger than the viewport** (e.g., 1200×800 world size with an 800×600 camera viewport) to test camera following
- Solid walls on all four sides (left, right, floor, ceiling) using Phaser static physics bodies
- Walls should be visually distinct from the background (e.g., a colored rectangle or simple tiled pattern)
- The ball spawns near the bottom-center of the room
- Background color should contrast with the ball and walls

---

## Core Entity: The Ball

### Visual
- Simple filled circle (solid color, e.g., bright orange or red)
- Radius: ~16px (tune as needed for game feel)
- No sprite sheet or texture for MVP — use Phaser graphics or a generated texture

### Physics Properties

| Property | Value | Notes |
|---|---|---|
| **Gravity Y** | ~800–1000 | Standard downward gravity. Tune for feel — the ball should feel weighty but responsive |
| **Bounce** | 0.7–0.85 | Variable bounciness — the ball should feel like a rubber ball. Each successive bounce should be visibly lower than the last due to energy loss |
| **Drag X** | ~50–100 | Horizontal air resistance so the ball doesn't slide forever |
| **Max Velocity X** | ~400 | Cap horizontal speed to keep control manageable |
| **Max Velocity Y** | ~800 | Cap vertical speed to prevent tunneling through surfaces |
| **Circular body** | true | Use `setCircle()` for accurate bounce angles |

### Input Handling

All input uses WASD **and** Arrow Keys simultaneously (both should always work).

| Input | Action | Details |
|---|---|---|
| **Left** (A / ←) | Accelerate left | Apply a constant horizontal force/acceleration (~500) while held. Ball should feel responsive but not instant — momentum matters |
| **Right** (D / →) | Accelerate right | Same as left, opposite direction |
| **Up** (W / ↑) | Jump | Apply an instantaneous upward velocity impulse (~-450). **Only works when the ball is touching the ground** (grounded check). No double-jump for MVP |
| **Down** (S / ↓) | Increase gravity | While held, multiply the world gravity by a factor (e.g., 2.5×–3×). When released, gravity returns to normal. This helps the player slam the ball back down quickly. The transition should be immediate (no easing) |

### Grounded Detection
- The ball is considered "grounded" when `body.blocked.down` or `body.touching.down` is true
- Jump should only fire on key **press** (not hold) to prevent rocket-jumping by holding the key

---

## Camera

- Phaser camera should follow the ball using `camera.startFollow()` with light lerp smoothing (e.g., `lerp: 0.1`) for a smooth trailing feel
- Camera should be bounded to the world bounds so it never shows area outside the level
- Viewport size: **800×600** (configurable in game config)
- World size for Level 1: **1200×800** (gives enough room to test camera panning)

---

## Sound Effects

Keep it simple for MVP. Two sounds:

| Sound | Trigger | Notes |
|---|---|---|
| **Bounce** | Ball collides with any wall/floor/ceiling | Short, punchy sound. Can use a procedurally generated tone or a free SFX file. Should play on every collision but with a short cooldown (~100ms) to prevent audio spam during rapid bounces |
| **Jump** | Player presses jump while grounded | Distinct from bounce — slightly higher pitched or different character |

If sourcing audio is friction, generate simple sounds using the Web Audio API or skip sounds initially and add them as a fast follow.

---

## Game Configuration

```javascript
// Phaser Game Config (main.js)
{
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false  // Set to true during development
    }
  },
  scene: [MenuScene, Level1Scene]
}
```

---

## Controls Summary (for reference / future HUD)

| Key | Action |
|---|---|
| ← / A | Move left |
| → / D | Move right |
| ↑ / W | Jump (when grounded) |
| ↓ / S | Heavy gravity (while held) |
| Esc | Return to menu (from gameplay) |

---

## Acceptance Criteria (MVP)

1. **Menu works:** Player can start the game from the menu using mouse or keyboard. Exit option shows a farewell message or closes the tab.
2. **Ball spawns and falls:** On level load, the ball appears and falls to the floor under gravity, bouncing several times before settling.
3. **Bouncing feels good:** The ball has visible, convincing bounce with energy loss on each successive bounce. It should feel like a rubber ball, not a tennis ball (more bounce) or a bowling ball (no bounce).
4. **Movement is responsive:** Left/right input accelerates the ball smoothly. The ball has momentum — it doesn't stop instantly when input is released. Horizontal drag gradually slows it.
5. **Jump works correctly:** Jump only works when grounded. The ball gets a satisfying upward impulse. No double-jump. Jump should feel snappy, not floaty.
6. **Down-gravity works:** Holding down visibly increases the ball's fall speed. Releasing it returns gravity to normal immediately. This should feel like a "slam" when used mid-air.
7. **Camera follows the ball:** Camera smoothly tracks the ball and is bounded to the world edges.
8. **Walls contain the ball:** The ball cannot escape the level boundaries. It bounces off all four walls.
9. **Sound plays:** Bounce and jump sounds play at the correct times without audio spam.
10. **No crashes or errors:** Game runs smoothly in modern Chrome/Firefox/Safari. No console errors in normal gameplay.

---

## Future Considerations (Not in MVP)

These are explicitly **out of scope** but noted for architecture awareness:

- Multiple levels with varying geometry (slopes, platforms, moving obstacles)
- Level select screen
- Collectibles / scoring system
- Ball customization (skins, trails)
- Particle effects (dust on landing, trail while moving)
- Mobile touch controls
- Level editor
- Timer / speedrun mode
- Persistent settings (volume, controls)

---

## Development Notes for Claude Code

- Start by scaffolding the project structure and getting a Phaser game running with a blank scene
- Build the Ball entity as a self-contained class that owns its physics body and input handling
- Tune physics values iteratively — the numbers in this doc are starting points, not gospel. The **feel** described in the acceptance criteria is what matters
- Use `arcade.debug: true` during development to visualize physics bodies
- Keep scene files focused — each scene should be a single class with clear `preload()`, `create()`, and `update()` methods
- Load Phaser from CDN for MVP: `https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js`
