# Sticky Ball State Spec

The sticky ball (state 3) can cling to all surfaces (floor, ceiling, walls).
When touching a surface it cancels world gravity and allows movement along that surface.
When airborne it falls normally under world gravity.

## Requirements

| ID | Requirement |
|---|---|
| STICKY-01 | `enter()` sets bounce=0, drag=0, maxVel=(400,400), gravity.y=0 |
| STICKY-02 | `exit()` resets gravity.y=0 and acceleration=(0,0) |
| STICKY-03 | When touching floor — body.gravity.y set to −900 (gravityCancel) |
| STICKY-04 | When touching ceiling — body.gravity.y set to −900 |
| STICKY-05 | When touching left wall — body.gravity.y set to −900 |
| STICKY-06 | When touching right wall — body.gravity.y set to −900 |
| STICKY-07 | Floor + right input → `setVelocityX(200)` |
| STICKY-08 | Floor + left input → `setVelocityX(−200)` |
| STICKY-09 | Floor + down input (pressing into floor) → no downward velocity |
| STICKY-10 | Ceiling + right input → `setVelocityX(200)`, `setVelocityY(−wallPush)` applied |
| STICKY-11 | Left wall + up input → `setVelocityY(−200)`, `setVelocityX(−wallPush)` applied |
| STICKY-12 | Left wall + down input → `setVelocityY(200)`, `setVelocityX(−wallPush)` applied |
| STICKY-13 | Left wall + left input (pressing into wall) → no leftward velocity |
| STICKY-14 | Not touching any surface → body.gravity.y = 0 (falls under world gravity) |
