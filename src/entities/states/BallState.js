export class BallState {
    getColor() { throw new Error('must implement getColor'); }
    enter(ball)  { throw new Error('must implement enter');  }
    exit(ball)   { throw new Error('must implement exit');   }
    update(ball) { throw new Error('must implement update'); }

    static getInputState(ball) {
        const cursors = ball.cursors;
        const keys    = ball.keys;
        const body    = ball.body;
        const isGrounded = body.blocked.down || body.touching.down;
        return {
            isGrounded,
            leftPressed:     cursors.left.isDown  || keys.A.isDown,
            rightPressed:    cursors.right.isDown || keys.D.isDown,
            downPressed:     cursors.down.isDown  || keys.S.isDown,
            jumpHeld:        cursors.up.isDown    || keys.W.isDown,
            jumpJustPressed: Phaser.Input.Keyboard.JustDown(cursors.up) ||
                             Phaser.Input.Keyboard.JustDown(keys.W),
            justLanded:      isGrounded && !ball.wasGrounded,
        };
    }
}
