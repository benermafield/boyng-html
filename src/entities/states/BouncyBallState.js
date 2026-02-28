class BouncyBallState extends BallState {
    getColor() { return 0xff6600; }

    enter(ball) {
        ball.setBounce(0.75);
        ball.setDrag(75, 0);
        ball.setMaxVelocity(400, 800);
        ball.body.gravity.y = 0;
    }

    exit(ball) {}

    update(ball) {
        const cursors = ball.cursors;
        const keys = ball.keys;

        // Horizontal movement
        const leftPressed  = cursors.left.isDown  || keys.A.isDown;
        const rightPressed = cursors.right.isDown || keys.D.isDown;

        if (leftPressed) {
            ball.setAccelerationX(-500);
        } else if (rightPressed) {
            ball.setAccelerationX(500);
        } else {
            ball.setAccelerationX(0);
        }

        // Jump
        const isGrounded      = ball.body.blocked.down || ball.body.touching.down;
        const jumpHeld        = cursors.up.isDown || keys.W.isDown;
        const jumpJustPressed = Phaser.Input.Keyboard.JustDown(cursors.up) ||
                                Phaser.Input.Keyboard.JustDown(keys.W);
        const justLanded      = isGrounded && !ball.wasGrounded;

        if (jumpJustPressed && isGrounded) {
            ball.setVelocityY(-450);
            if (ball.jumpSound) ball.jumpSound.play();
        } else if (justLanded && jumpHeld) {
            ball.setVelocityY(-600);
            if (ball.jumpSound) ball.jumpSound.play();
        }

        ball.wasGrounded = isGrounded;

        // Slam (2.5× gravity)
        const downPressed = cursors.down.isDown || keys.S.isDown;
        ball.body.gravity.y = downPressed ? 900 * 2.5 : 0;
    }
}
