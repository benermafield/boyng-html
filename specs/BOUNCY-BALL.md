# Bouncy Ball State Spec

The bouncy ball (state 1) is the default state. It has high bounce, moderate drag,
and supports a slam move (extra downward gravity while holding down).

## Requirements

| ID | Requirement |
|---|---|
| BOUNCY-01 | `enter()` sets bounce=0.75, drag=75, maxVel=(400,800), gravity.y=0 |
| BOUNCY-02 | Right input applies +accel (500) via `setAccelerationX` |
| BOUNCY-03 | Left input applies −accel (−500) via `setAccelerationX` |
| BOUNCY-04 | No horizontal input zeroes acceleration via `setAccelerationX(0)` |
| BOUNCY-05 | Jump while grounded applies jumpVelocity (−450) via `setVelocityY` |
| BOUNCY-06 | Jump held on just-landed applies landJumpVel (−600) via `setVelocityY` |
| BOUNCY-07 | Down/S pressed sets extra gravity: body.gravity.y = 900 × 2.5 = 2250 |
| BOUNCY-08 | Down not pressed zeroes extra gravity: body.gravity.y = 0 |
