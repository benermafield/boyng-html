// Tests for: specs/STICKY-BALL.md

import { StickyBallState } from '../../../src/entities/states/StickyBallState.js';
import { GameConfig } from '../../../src/config.js';
import { createMockBall } from '../../setup/mockBall.js';

const cfg = GameConfig.stickyBall;

describe('StickyBallState', () => {
    let state;
    let ball;

    beforeEach(() => {
        state = new StickyBallState();
        ball = createMockBall();
        vi.clearAllMocks();
    });

    // STICKY-01
    it('STICKY-01: enter() sets bounce=0, drag=0, maxVel=(400,400), gravity.y=0', () => {
        state.enter(ball);
        expect(ball.setBounce).toHaveBeenCalledWith(0);
        expect(ball.setDrag).toHaveBeenCalledWith(0, 0);
        expect(ball.setMaxVelocity).toHaveBeenCalledWith(400, 400);
        expect(ball.body.gravity.y).toBe(0);
    });

    // STICKY-02
    it('STICKY-02: exit() resets gravity.y=0 and acceleration=(0,0)', () => {
        state.enter(ball);
        ball.body.gravity.y = cfg.gravityCancel;
        state.exit(ball);
        expect(ball.body.gravity.y).toBe(0);
        expect(ball.setAcceleration).toHaveBeenCalledWith(0, 0);
    });

    // STICKY-03
    it('STICKY-03: touching floor sets gravity.y to gravityCancel', () => {
        state.enter(ball);
        ball.body.blocked.down = true;
        state.update(ball);
        expect(ball.body.gravity.y).toBe(cfg.gravityCancel);
    });

    // STICKY-04
    it('STICKY-04: touching ceiling sets gravity.y to gravityCancel', () => {
        state.enter(ball);
        ball.body.blocked.up = true;
        state.update(ball);
        expect(ball.body.gravity.y).toBe(cfg.gravityCancel);
    });

    // STICKY-05
    it('STICKY-05: touching left wall sets gravity.y to gravityCancel', () => {
        state.enter(ball);
        ball.body.blocked.left = true;
        state.update(ball);
        expect(ball.body.gravity.y).toBe(cfg.gravityCancel);
    });

    // STICKY-06
    it('STICKY-06: touching right wall sets gravity.y to gravityCancel', () => {
        state.enter(ball);
        ball.body.blocked.right = true;
        state.update(ball);
        expect(ball.body.gravity.y).toBe(cfg.gravityCancel);
    });

    // STICKY-07
    it('STICKY-07: floor + right input → setVelocityX(200)', () => {
        state.enter(ball);
        ball.body.blocked.down = true;
        ball.cursors.right.isDown = true;
        state.update(ball);
        expect(ball.setVelocityX).toHaveBeenCalledWith(cfg.moveSpeed);
    });

    // STICKY-08
    it('STICKY-08: floor + left input → setVelocityX(-200)', () => {
        state.enter(ball);
        ball.body.blocked.down = true;
        ball.cursors.left.isDown = true;
        state.update(ball);
        expect(ball.setVelocityX).toHaveBeenCalledWith(-cfg.moveSpeed);
    });

    // STICKY-09: down input while on floor is "pressing into floor" — effectiveDown is false
    it('STICKY-09: floor + down input → no downward velocity', () => {
        state.enter(ball);
        ball.body.blocked.down = true;
        ball.cursors.down.isDown = true;
        state.update(ball);
        // setVelocityY may be called with ceilingPush=0, but NOT with a positive (downward) value
        const calls = ball.setVelocityY.mock.calls;
        calls.forEach(([v]) => expect(v).toBeLessThanOrEqual(0));
    });

    // STICKY-10
    it('STICKY-10: ceiling + right input → setVelocityX(200) and ceilingPush applied', () => {
        state.enter(ball);
        ball.body.blocked.up = true;
        ball.cursors.right.isDown = true;
        state.update(ball);
        expect(ball.setVelocityX).toHaveBeenCalledWith(cfg.moveSpeed);
        expect(ball.setVelocityY).toHaveBeenCalledWith(-cfg.wallPush); // ceilingPush
    });

    // STICKY-11
    it('STICKY-11: left wall + up input → setVelocityY(-200) and wallPush applied', () => {
        state.enter(ball);
        ball.body.blocked.left = true;
        ball.cursors.up.isDown = true;
        state.update(ball);
        expect(ball.setVelocityY).toHaveBeenCalledWith(-cfg.moveSpeed);
        expect(ball.setVelocityX).toHaveBeenCalledWith(-cfg.wallPush); // wallPush for left wall
    });

    // STICKY-12
    it('STICKY-12: left wall + down input → setVelocityY(200) and wallPush applied', () => {
        state.enter(ball);
        ball.body.blocked.left = true;
        ball.cursors.down.isDown = true;
        state.update(ball);
        expect(ball.setVelocityY).toHaveBeenCalledWith(cfg.moveSpeed);
        expect(ball.setVelocityX).toHaveBeenCalledWith(-cfg.wallPush);
    });

    // STICKY-13: left input while on left wall is "pressing into wall" — effectiveLeft is false
    it('STICKY-13: left wall + left input → no leftward velocity', () => {
        state.enter(ball);
        ball.body.blocked.left = true;
        ball.cursors.left.isDown = true;
        state.update(ball);
        const calls = ball.setVelocityX.mock.calls;
        calls.forEach(([v]) => expect(v).toBeGreaterThanOrEqual(-cfg.wallPush));
    });

    // STICKY-14
    it('STICKY-14: not touching any surface → gravity.y = 0', () => {
        state.enter(ball);
        // All blocked/touching flags are false (default in createMockBall)
        state.update(ball);
        expect(ball.body.gravity.y).toBe(0);
    });
});
