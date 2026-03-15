# Boyng

2D bouncy ball physics game — Phaser 3 (CDN), vanilla JS ES modules, Vite, Vitest, Playwright.

## Commands

```bash
npm install          # Install deps + activate pre-commit hook
npm run dev          # Vite dev server at http://localhost:5173
npm test             # Run all unit tests once (vitest run)
npm run test:watch   # Unit tests in watch mode
npm run test:e2e     # Playwright E2E tests (auto-starts dev server)
```

## Project Structure

```
src/
  config.js              # GameConfig constants (physics, UI, world)
  main.js                # Phaser entry point, scene registration
  entities/
    Ball.js              # Ball class + state machine
    states/              # One file per ball state, extends BallState
  scenes/                # One file per Phaser scene
specs/                   # Human-readable requirements (source of truth)
tests/
  setup/                 # Phaser mocks + mock Ball factory
  unit/                  # Vitest unit tests (mirrors src/ structure)
  e2e/                   # Playwright browser tests
```

## Conventions

### IMPORTANT: Spec-first workflow

Never implement game behaviour without following this loop:

1. Add a spec entry in the matching `specs/*.md` file
2. Write a failing test referencing the spec ID (e.g., `// BALL-07`)
3. Implement minimal code to make the test pass

This is non-negotiable — no feature without a spec, no spec without a test.

### GameConfig is the single source of truth for constants

**YOU MUST** put all physics, UI, and world constants in `GameConfig` (`src/config.js`).
Never hardcode numeric values in entity or scene files.

### Unit tests never touch real Phaser

- `tests/setup/mockPhaser.js` provides a global Phaser stub (loaded via Vitest setupFiles)
- `tests/setup/mockBall.js` provides `createMockBall()` with `vi.fn()` spies
- Test state behaviour by calling `enter()` / `update()` / `exit()` on mock objects

### Naming & patterns

- Ball states: `<Adjective>BallState` class extending `BallState`, one file per state in `src/entities/states/`
- Scenes: independent `Phaser.Scene` subclass, registered in `src/main.js`
- Test files: mirror the `src/` path under `tests/unit/`

### Pre-commit hook

`simple-git-hooks` runs `npm test` before every commit. All unit tests must pass.

## Reference Documents

### CONTRIBUTING.md — `@CONTRIBUTING.md`
**Read when:** adding features, writing tests, or understanding the TDD workflow.
Full TDD loop details, mock strategy explanation, and project layout.

### Ball spec — `@specs/BALL.md`
**Read when:** modifying `Ball.js` or the state machine.

### Bouncy Ball spec — `@specs/BOUNCY-BALL.md`
**Read when:** modifying `BouncyBallState`.

### Metal Ball spec — `@specs/METAL-BALL.md`
**Read when:** modifying `MetalBallState`.

### Sticky Ball spec — `@specs/STICKY-BALL.md`
**Read when:** modifying `StickyBallState`.

### E2E Gameplay spec — `@specs/E2E-GAMEPLAY.md`
**Read when:** writing or modifying E2E tests.
