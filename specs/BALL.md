# Ball State Machine Spec

The `Ball` class manages a state machine with three states (Bouncy, Metal, Sticky).
State transitions are triggered by number key presses (1, 2, 3).

## Requirements

| ID | Requirement |
|---|---|
| BALL-01 | Ball initialises in BouncyBallState |
| BALL-02 | `switchState(1)` transitions to BouncyBallState |
| BALL-03 | `switchState(2)` transitions to MetalBallState |
| BALL-04 | `switchState(3)` transitions to StickyBallState |
| BALL-05 | `switchState` calls `exit()` on the previous state before transitioning |
| BALL-06 | `switchState` calls `enter()` on the new state after transitioning |
