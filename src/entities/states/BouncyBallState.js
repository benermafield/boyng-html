import { BallState } from './BallState.js';
import { GameConfig } from '../../config.js';

export class BouncyBallState extends BallState {
    getColor() { return GameConfig.bouncyBall.color; }

    enter(ball) {
        const cfg = GameConfig.bouncyBall;
        ball.setBounce(cfg.bounce);
        ball.setDrag(cfg.drag, 0);
        ball.setMaxVelocity(cfg.maxVelX, cfg.maxVelY);
        ball.body.gravity.y = 0;
    }

    exit(ball) {}

    update(ball) {
        const cfg   = GameConfig.bouncyBall;
        const input = BallState.getInputState(ball);

        // Horizontal movement
        if (input.leftPressed) {
            ball.setAccelerationX(-cfg.accel);
        } else if (input.rightPressed) {
            ball.setAccelerationX(cfg.accel);
        } else {
            ball.setAccelerationX(0);
        }

        // Jump
        if (input.jumpJustPressed && input.isGrounded) {
            ball.setVelocityY(cfg.jumpVelocity);
            if (ball.jumpSound) ball.jumpSound.play();
        } else if (input.justLanded && input.jumpHeld) {
            ball.setVelocityY(cfg.landJumpVel);
            if (ball.jumpSound) ball.jumpSound.play();
        }

        ball.wasGrounded = input.isGrounded;

        // Slam (slamGravMult × world gravity)
        ball.body.gravity.y = input.downPressed ? GameConfig.world.gravity * cfg.slamGravMult : 0;
    }
}
