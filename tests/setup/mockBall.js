import { vi } from 'vitest';

/**
 * Factory that returns a mock Ball object for use in state unit tests.
 * All physics methods are vi.fn() so tests can assert on calls.
 * body.gravity.y is a plain mutable number (matches actual Phaser body).
 * blocked/touching flags are plain objects so tests can set them freely.
 */
export function createMockBall(overrides = {}) {
    return {
        body: {
            gravity: { y: 0 },
            blocked:  { down: false, up: false, left: false, right: false },
            touching: { down: false, up: false, left: false, right: false },
        },
        wasGrounded: false,
        jumpSound: null,
        setBounce:        vi.fn(),
        setDrag:          vi.fn(),
        setMaxVelocity:   vi.fn(),
        setAccelerationX: vi.fn(),
        setAcceleration:  vi.fn(),
        setVelocityX:     vi.fn(),
        setVelocityY:     vi.fn(),
        regenerateTexture: vi.fn(),
        cursors: {
            left:  { isDown: false },
            right: { isDown: false },
            up:    { isDown: false },
            down:  { isDown: false },
        },
        keys: {
            W: { isDown: false },
            A: { isDown: false },
            S: { isDown: false },
            D: { isDown: false },
        },
        states: {},
        currentState: null,
        ...overrides,
    };
}
