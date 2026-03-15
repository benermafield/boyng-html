import { vi } from 'vitest';

// Provide a minimal Phaser global for unit tests.
// - Physics.Arcade.Sprite: base class for Ball (evaluated at class-definition time)
// - Scene: base class for scene files (not imported in unit tests, but here for completeness)
// - Input.Keyboard.JustDown: spy used by BallState.getInputState
global.Phaser = {
    Physics: {
        Arcade: {
            Sprite: class {
                constructor() {}
                setBounce()            { return this; }
                setDrag()              { return this; }
                setMaxVelocity()       { return this; }
                setAccelerationX()     { return this; }
                setAcceleration()      { return this; }
                setVelocityY()         { return this; }
                setVelocityX()         { return this; }
                setCircle()            { return this; }
                setOrigin()            { return this; }
                setCollideWorldBounds() { return this; }
                setTexture()           { return this; }
            },
        },
    },
    Scene: class {
        constructor() {}
    },
    Input: {
        Keyboard: {
            JustDown: vi.fn(() => false),
        },
    },
};
