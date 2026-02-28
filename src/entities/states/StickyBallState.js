class StickyBallState extends BallState {
    getColor() { return 0x00cc44; }

    enter(ball) {
        ball.setBounce(0);
        ball.setDrag(0, 0);
        ball.setMaxVelocity(400, 400);
        ball.body.gravity.y = 0;
        ball.wasGrounded = false;
    }

    exit(ball) {
        ball.body.gravity.y = 0;
        ball.setAcceleration(0, 0);
    }

    update(ball) {
        const cursors = ball.cursors;
        const keys = ball.keys;
        const body = ball.body;

        const onFloor   = body.blocked.down  || body.touching.down;
        const onCeiling = body.blocked.up    || body.touching.up;
        const onLeft    = body.blocked.left  || body.touching.left;
        const onRight   = body.blocked.right || body.touching.right;

        const onHorizontalSurface = onFloor || onCeiling;
        const onVerticalSurface   = onLeft  || onRight;
        const onAnySurface = onHorizontalSurface || onVerticalSurface;

        if (onAnySurface) {
            body.gravity.y = -900; // Cancel world gravity

            const leftPressed  = cursors.left.isDown  || keys.A.isDown;
            const rightPressed = cursors.right.isDown || keys.D.isDown;
            const upPressed    = cursors.up.isDown    || keys.W.isDown;
            const downPressed  = cursors.down.isDown  || keys.S.isDown;

            // Ignore directions that press into a surface
            const effectiveLeft  = leftPressed  && !onLeft;
            const effectiveRight = rightPressed && !onRight;
            const effectiveUp    = upPressed    && !onCeiling;
            const effectiveDown  = downPressed  && !onFloor;

            const canMoveH = onHorizontalSurface && (effectiveLeft || effectiveRight);
            const canMoveV = onVerticalSurface   && (effectiveUp   || effectiveDown);

            // Small velocities to press into surfaces — Phaser only sets touching/blocked
            // flags during an active collision, so without these the ball loses contact
            // on the next frame and gravity re-enables. Floors don't need this because
            // gravity provides the equivalent push automatically.
            const wallPush    = onLeft ? -50 : onRight ? 50 : 0;
            const ceilingPush = onCeiling ? -50 : 0;

            if (canMoveH) {
                ball.setVelocityX(effectiveLeft ? -200 : 200);
                ball.setVelocityY(ceilingPush);
            } else if (canMoveV) {
                ball.setVelocityY(effectiveUp ? -200 : 200);
                ball.setVelocityX(wallPush);
            } else {
                ball.setVelocityX(wallPush);
                ball.setVelocityY(ceilingPush);
            }
        } else {
            body.gravity.y = 0; // World gravity resumes — ball falls to next surface
        }
    }
}
