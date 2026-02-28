class MetalBallState extends BallState {
    getColor() { return 0xaaaaaa; }

    enter(ball) {
        ball.setBounce(0.2);
        ball.setDrag(150, 0);
        ball.setMaxVelocity(300, 600);
        ball.body.gravity.y = 600;
    }

    exit(ball) {
        ball.body.gravity.y = 0;
    }

    update(ball) {
        const cursors = ball.cursors;
        const keys = ball.keys;

        // Horizontal movement (sluggish)
        const leftPressed  = cursors.left.isDown  || keys.A.isDown;
        const rightPressed = cursors.right.isDown || keys.D.isDown;

        if (leftPressed) {
            ball.setAccelerationX(-300);
        } else if (rightPressed) {
            ball.setAccelerationX(300);
        } else {
            ball.setAccelerationX(0);
        }

        // Jump (low)
        const isGrounded      = ball.body.blocked.down || ball.body.touching.down;
        const jumpHeld        = cursors.up.isDown || keys.W.isDown;
        const jumpJustPressed = Phaser.Input.Keyboard.JustDown(cursors.up) ||
                                Phaser.Input.Keyboard.JustDown(keys.W);
        const justLanded      = isGrounded && !ball.wasGrounded;

        if (jumpJustPressed && isGrounded) {
            ball.setVelocityY(-300);
            if (ball.jumpSound) ball.jumpSound.play();
        } else if (justLanded && jumpHeld) {
            ball.setVelocityY(-300);
            if (ball.jumpSound) ball.jumpSound.play();
        }

        ball.wasGrounded = isGrounded;
    }
}
