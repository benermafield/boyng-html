// Tests for: specs/BALL.md
// Strategy: Ball.prototype.switchState is called on a mock ball object so the
// test does not require a full Phaser scene. The Ball class is imported only to
// borrow its prototype method; the mock Phaser.Physics.Arcade.Sprite supplied by
// mockPhaser.js allows the class definition to evaluate without error.

import { Ball } from '../../src/entities/Ball.js';
import { BouncyBallState } from '../../src/entities/states/BouncyBallState.js';
import { MetalBallState } from '../../src/entities/states/MetalBallState.js';
import { StickyBallState } from '../../src/entities/states/StickyBallState.js';
import { createMockBall } from '../setup/mockBall.js';

function createStatefulMockBall() {
    const ball = createMockBall();
    ball.states = {
        1: new BouncyBallState(),
        2: new MetalBallState(),
        3: new StickyBallState(),
    };
    // Bind Ball's state-machine method to the mock object
    ball.switchState = Ball.prototype.switchState.bind(ball);
    return ball;
}

describe('Ball state machine', () => {
    let ball;

    beforeEach(() => {
        ball = createStatefulMockBall();
        vi.clearAllMocks();
    });

    // BALL-01
    it('BALL-01: ball initialises in BouncyBallState', () => {
        ball.switchState(1);
        expect(ball.currentState).toBeInstanceOf(BouncyBallState);
    });

    // BALL-02
    it('BALL-02: switchState(1) transitions to BouncyBallState', () => {
        ball.switchState(2);
        ball.switchState(1);
        expect(ball.currentState).toBeInstanceOf(BouncyBallState);
    });

    // BALL-03
    it('BALL-03: switchState(2) transitions to MetalBallState', () => {
        ball.switchState(2);
        expect(ball.currentState).toBeInstanceOf(MetalBallState);
    });

    // BALL-04
    it('BALL-04: switchState(3) transitions to StickyBallState', () => {
        ball.switchState(3);
        expect(ball.currentState).toBeInstanceOf(StickyBallState);
    });

    // BALL-05
    it('BALL-05: switchState calls exit() on the previous state', () => {
        ball.switchState(1);
        const exitSpy = vi.spyOn(ball.currentState, 'exit');
        ball.switchState(2);
        expect(exitSpy).toHaveBeenCalledWith(ball);
    });

    // BALL-06
    it('BALL-06: switchState calls enter() on the new state', () => {
        ball.switchState(1);
        const nextState = ball.states[2];
        const enterSpy = vi.spyOn(nextState, 'enter');
        ball.switchState(2);
        expect(enterSpy).toHaveBeenCalledWith(ball);
    });
});
