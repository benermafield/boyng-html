// Tests for: specs/METAL-BALL.md

import { MetalBallState } from '../../../src/entities/states/MetalBallState.js';
import { GameConfig } from '../../../src/config.js';
import { createMockBall } from '../../setup/mockBall.js';

describe('MetalBallState', () => {
    let state;
    let ball;

    beforeEach(() => {
        state = new MetalBallState();
        ball = createMockBall();
        vi.clearAllMocks();
        Phaser.Input.Keyboard.JustDown.mockReturnValue(false);
    });

    // METAL-01
    it('METAL-01: enter() sets bounce=0.2, drag=150, maxVel=(300,600), gravity.y=600', () => {
        state.enter(ball);
        expect(ball.setBounce).toHaveBeenCalledWith(0.2);
        expect(ball.setDrag).toHaveBeenCalledWith(150, 0);
        expect(ball.setMaxVelocity).toHaveBeenCalledWith(300, 600);
        expect(ball.body.gravity.y).toBe(GameConfig.metalBall.extraGravity);
    });

    // METAL-02
    it('METAL-02: exit() resets gravity.y to 0', () => {
        state.enter(ball);
        expect(ball.body.gravity.y).not.toBe(0);
        state.exit(ball);
        expect(ball.body.gravity.y).toBe(0);
    });

    // METAL-03
    it('METAL-03: right input applies +300 acceleration', () => {
        state.enter(ball);
        ball.cursors.right.isDown = true;
        state.update(ball);
        expect(ball.setAccelerationX).toHaveBeenCalledWith(GameConfig.metalBall.accel);
    });

    it('METAL-03: left input applies -300 acceleration', () => {
        state.enter(ball);
        ball.cursors.left.isDown = true;
        state.update(ball);
        expect(ball.setAccelerationX).toHaveBeenCalledWith(-GameConfig.metalBall.accel);
    });

    // METAL-04
    it('METAL-04: jump while grounded applies -300 velocity', () => {
        state.enter(ball);
        ball.body.blocked.down = true;
        Phaser.Input.Keyboard.JustDown.mockReturnValue(true);
        state.update(ball);
        expect(ball.setVelocityY).toHaveBeenCalledWith(GameConfig.metalBall.jumpVelocity);
    });

    // METAL-05
    it('METAL-05: jump held on just-landed applies landJumpVel (-300)', () => {
        state.enter(ball);
        ball.body.blocked.down = true;
        ball.wasGrounded = false; // just landed
        ball.cursors.up.isDown = true;
        Phaser.Input.Keyboard.JustDown.mockReturnValue(false);
        state.update(ball);
        expect(ball.setVelocityY).toHaveBeenCalledWith(GameConfig.metalBall.landJumpVel);
    });
});
