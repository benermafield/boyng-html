# Metal Ball State Spec

The metal ball (state 2) is heavy and sluggish. It has low bounce, high drag,
extra downward gravity while active, and a weak jump.

## Requirements

| ID | Requirement |
|---|---|
| METAL-01 | `enter()` sets bounce=0.2, drag=150, maxVel=(300,600), gravity.y=600 |
| METAL-02 | `exit()` resets gravity.y to 0 |
| METAL-03 | Right/left input applies ±300 acceleration via `setAccelerationX` |
| METAL-04 | Jump while grounded applies −300 velocity via `setVelocityY` |
| METAL-05 | Jump held on just-landed applies landJumpVel (−300) via `setVelocityY` |
