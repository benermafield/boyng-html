class Ball extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, '__DEFAULT');

        // Store scene reference
        this.scene = scene;

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configure base physics shape
        this.setCircle(16);
        this.setOrigin(0.5, 0.5);
        this.setCollideWorldBounds(true);

        // Set up input keys (both arrow keys and WASD)
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = {
            W: scene.input.keyboard.addKey('W'),
            A: scene.input.keyboard.addKey('A'),
            S: scene.input.keyboard.addKey('S'),
            D: scene.input.keyboard.addKey('D')
        };

        // Set up sound effects (only if audio was successfully loaded)
        this.jumpSound   = scene.cache.audio.has('jump')   ? scene.sound.add('jump')   : null;
        this.bounceSound = scene.cache.audio.has('bounce') ? scene.sound.add('bounce') : null;
        this.bounceCooldown = 0;
        this.wasGrounded = false;

        // State instances
        this.states = {
            1: new BouncyBallState(),
            2: new MetalBallState(),
            3: new StickyBallState()
        };
        this.currentState = null;

        // Number key listeners (keys 1–9, keycodes 49–57)
        for (let i = 1; i <= 9; i++) {
            const stateIndex = i;
            scene.input.keyboard.addKey(48 + i).on('down', () => {
                if (this.states[stateIndex]) this.switchState(stateIndex);
            });
        }

        // Start in bouncy state
        this.switchState(1);
    }

    switchState(key) {
        if (this.currentState) this.currentState.exit(this);
        this.currentState = this.states[key];
        this.currentState.enter(this);
        this.regenerateTexture(this.currentState.getColor());
    }

    regenerateTexture(color) {
        const key = 'ball_' + color.toString(16).padStart(6, '0');
        if (!this.scene.textures.exists(key)) {
            const g = this.scene.add.graphics();
            g.fillStyle(color, 1);
            g.fillCircle(16, 16, 16);
            g.generateTexture(key, 32, 32);
            g.destroy();
        }
        this.setTexture(key);
        this.setCircle(16); // Re-apply after setTexture (Phaser may reset body)
    }

    update() {
        if (this.currentState) this.currentState.update(this);

        // Bounce sound with cooldown
        if (this.bounceCooldown > 0) {
            this.bounceCooldown -= this.scene.game.loop.delta;
        }

        const touching = this.body.touching;
        const blocked  = this.body.blocked;

        if ((touching.down || touching.left || touching.right || touching.up ||
             blocked.down  || blocked.left  || blocked.right  || blocked.up) &&
            this.bounceCooldown <= 0) {
            if (this.bounceSound) this.bounceSound.play();
            this.bounceCooldown = 100;
        }
    }
}
