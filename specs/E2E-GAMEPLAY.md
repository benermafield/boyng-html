# E2E Gameplay Spec

End-to-end tests run against the real game in a browser via Playwright.
The game is served by Vite at http://localhost:5173.

## Requirements

| ID | Requirement |
|---|---|
| E2E-01 | Game loads and menu is visible (title "BOYNG" on screen) |
| E2E-02 | Enter/click "Start Game" → Level1 loads (canvas renders, no menu title) |
| E2E-03 | Ball starts in BouncyBallState when Level1 loads |
| E2E-04 | Press 3 → ball transitions to StickyBallState |
| E2E-05 | Press 2 → ball transitions to MetalBallState |
| E2E-06 | Press 1 → ball transitions back to BouncyBallState |
| E2E-07 | Press ESC in Level1 → menu scene becomes active again |
| E2E-08 | Switching away from StickyBallState while on a wall → ball's Y position increases (drops under gravity) |
