import { BallState } from './BallState.js';
import { GameConfig } from '../../config.js';

export class MetalBallState extends BallState {
    getColor() { return GameConfig.metalBall.color; }

    enter(ball) {
        const cfg = GameConfig.metalBall;
        ball.setBounce(cfg.bounce);
        ball.setDrag(cfg.drag, 0);
        ball.setMaxVelocity(cfg.maxVelX, cfg.maxVelY);
        ball.body.gravity.y = cfg.extraGravity;
    }

    exit(ball) {
        ball.body.gravity.y = 0;
    }

    update(ball) {
        const cfg   = GameConfig.metalBall;
        const input = BallState.getInputState(ball);

        // Horizontal movement (sluggish)
        if (input.leftPressed) {
            ball.setAccelerationX(-cfg.accel);
        } else if (input.rightPressed) {
            ball.setAccelerationX(cfg.accel);
        } else {
            ball.setAccelerationX(0);
        }

        // Jump (low)
        if (input.jumpJustPressed && input.isGrounded) {
            ball.setVelocityY(cfg.jumpVelocity);
            if (ball.jumpSound) ball.jumpSound.play();
        } else if (input.justLanded && input.jumpHeld) {
            ball.setVelocityY(cfg.landJumpVel);
            if (ball.jumpSound) ball.jumpSound.play();
        }

        ball.wasGrounded = input.isGrounded;
    }
}
