# Contributing to Boyng

## TDD Workflow

> **Rule: No feature without a spec. No spec without a test.**

Every change to game behaviour must follow this three-step loop:

### 1. Write a spec entry

Add a new row to the relevant file in `specs/`:

```
| XYZ-07 | Short one-line description of the requirement |
```

Pick a spec file that matches the component you're changing:

| File | Covers |
|---|---|
| `specs/BALL.md` | Ball state machine |
| `specs/BOUNCY-BALL.md` | BouncyBallState physics |
| `specs/METAL-BALL.md` | MetalBallState physics |
| `specs/STICKY-BALL.md` | StickyBallState physics |
| `specs/E2E-GAMEPLAY.md` | End-to-end browser behaviour |

### 2. Write a failing test

Add a test in the matching file under `tests/unit/` (or `tests/e2e/` for E2E).
Reference the spec ID in a comment so the link is always traceable:

```js
// XYZ-07
it('XYZ-07: <short description>', () => {
    // arrange
    // act
    // assert — this should FAIL before the feature is implemented
});
```

Run `npm test` and confirm the new test fails (red).

### 3. Implement until green

Write the minimal code in `src/` that makes the test pass.
Run `npm test` again — all tests should be green before you commit.

---

## Commands

```bash
npm install          # install all dev dependencies + activate pre-commit hook
npm test             # run all unit tests once (vitest run)
npm run test:watch   # watch mode — re-runs on save
npm run dev          # start Vite dev server at http://localhost:5173
npm run test:e2e     # run Playwright E2E tests (requires dev server or starts one)
```

## Pre-commit hook

`simple-git-hooks` runs `npm test` before every commit.
If any unit test fails the commit is blocked — fix the tests first.

---

## Project layout

```
src/
  config.js                   ← GameConfig constants (exported)
  main.js                     ← Phaser entry point
  entities/
    Ball.js                   ← Ball class + state machine
    states/
      BallState.js            ← Abstract base + getInputState()
      BouncyBallState.js
      MetalBallState.js
      StickyBallState.js
  scenes/
    MenuScene.js
    Level1Scene.js
specs/                        ← Human-readable requirements (source of truth)
tests/
  setup/
    mockPhaser.js             ← global Phaser mock (Vitest setupFiles)
    mockBall.js               ← mock Ball factory for unit tests
  unit/
    Ball.test.js
    states/
      BouncyBallState.test.js
      MetalBallState.test.js
      StickyBallState.test.js
  e2e/
    gameplay.test.js
```

## Mock strategy

Unit tests never touch the real Phaser engine.

- **`mockPhaser.js`** (loaded as a Vitest `setupFile`) sets `global.Phaser` with
  stub classes so that source files that extend `Phaser.Physics.Arcade.Sprite` or
  reference `Phaser.Input.Keyboard.JustDown` work in Node.
- **`createMockBall()`** returns a plain object with all physics methods as
  `vi.fn()` spies. Tests set `body.blocked` / `body.touching` flags directly,
  then call `state.enter()` / `state.update()` / `state.exit()` and assert on
  the spy calls.
