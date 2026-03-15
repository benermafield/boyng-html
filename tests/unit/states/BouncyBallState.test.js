// Tests for: specs/BOUNCY-BALL.md

import { BouncyBallState } from '../../../src/entities/states/BouncyBallState.js';
import { GameConfig } from '../../../src/config.js';
import { createMockBall } from '../../setup/mockBall.js';

describe('BouncyBallState', () => {
    let state;
    let ball;

    beforeEach(() => {
        state = new BouncyBallState();
        ball = createMockBall();
        vi.clearAllMocks();
        Phaser.Input.Keyboard.JustDown.mockReturnValue(false);
    });

    // BOUNCY-01
    it('BOUNCY-01: enter() sets bounce=0.75, drag=75, maxVel=(400,800), gravity.y=0', () => {
        state.enter(ball);
        expect(ball.setBounce).toHaveBeenCalledWith(0.75);
        expect(ball.setDrag).toHaveBeenCalledWith(75, 0);
        expect(ball.setMaxVelocity).toHaveBeenCalledWith(400, 800);
        expect(ball.body.gravity.y).toBe(0);
    });

    // BOUNCY-02
    it('BOUNCY-02: right input applies +accel via setAccelerationX', () => {
        state.enter(ball);
        ball.cursors.right.isDown = true;
        state.update(ball);
        expect(ball.setAccelerationX).toHaveBeenCalledWith(GameConfig.bouncyBall.accel);
    });

    // BOUNCY-03
    it('BOUNCY-03: left input applies -accel via setAccelerationX', () => {
        state.enter(ball);
        ball.cursors.left.isDown = true;
        state.update(ball);
        expect(ball.setAccelerationX).toHaveBeenCalledWith(-GameConfig.bouncyBall.accel);
    });

    // BOUNCY-04
    it('BOUNCY-04: no horizontal input zeroes acceleration', () => {
        state.enter(ball);
        state.update(ball);
        expect(ball.setAccelerationX).toHaveBeenCalledWith(0);
    });

    // BOUNCY-05
    it('BOUNCY-05: jump while grounded applies jumpVelocity', () => {
        state.enter(ball);
        ball.body.blocked.down = true;
        Phaser.Input.Keyboard.JustDown.mockReturnValue(true);
        state.update(ball);
        expect(ball.setVelocityY).toHaveBeenCalledWith(GameConfig.bouncyBall.jumpVelocity);
    });

    // BOUNCY-06
    it('BOUNCY-06: jump held on just-landed applies landJumpVel', () => {
        state.enter(ball);
        ball.body.blocked.down = true;
        ball.wasGrounded = false; // just landed this frame
        ball.cursors.up.isDown = true; // jump held
        Phaser.Input.Keyboard.JustDown.mockReturnValue(false); // not a fresh press
        state.update(ball);
        expect(ball.setVelocityY).toHaveBeenCalledWith(GameConfig.bouncyBall.landJumpVel);
    });

    // BOUNCY-07
    it('BOUNCY-07: down pressed sets extra gravity (world.gravity * slamGravMult)', () => {
        state.enter(ball);
        ball.cursors.down.isDown = true;
        state.update(ball);
        const expected = GameConfig.world.gravity * GameConfig.bouncyBall.slamGravMult;
        expect(ball.body.gravity.y).toBe(expected);
    });

    // BOUNCY-08
    it('BOUNCY-08: down not pressed zeroes extra gravity', () => {
        state.enter(ball);
        // Ensure gravity.y starts non-zero so we can confirm it gets reset
        ball.body.gravity.y = 9999;
        state.update(ball);
        expect(ball.body.gravity.y).toBe(0);
    });
});
