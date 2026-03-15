import { GameConfig } from '../config.js';
import { Ball } from '../entities/Ball.js';

// Phaser is available as a browser global (loaded via CDN before this module runs)
export class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    preload() {
        // Load sound effects
        // Note: If sound files don't exist, Phaser will show warnings but game will still work
        this.load.audio('bounce', 'assets/sounds/bounce.wav');
        this.load.audio('jump', 'assets/sounds/jump.wav');
    }

    create() {
        const cfg = GameConfig.world;

        // Set world bounds (larger than viewport for camera testing)
        this.physics.world.bounds.width  = cfg.width;
        this.physics.world.bounds.height = cfg.height;

        // Create static group for walls
        this.walls = this.physics.add.staticGroup();

        // Create four walls forming an enclosure
        // Floor
        const floor = this.add.rectangle(cfg.width / 2, cfg.height - cfg.wallThick / 2, cfg.width, cfg.wallThick, cfg.wallColor);
        this.physics.add.existing(floor, true);
        this.walls.add(floor);

        // Ceiling
        const ceiling = this.add.rectangle(cfg.width / 2, cfg.wallThick / 2, cfg.width, cfg.wallThick, cfg.wallColor);
        this.physics.add.existing(ceiling, true);
        this.walls.add(ceiling);

        // Left wall
        const leftWall = this.add.rectangle(cfg.wallThick / 2, cfg.height / 2, cfg.wallThick, cfg.height, cfg.wallColor);
        this.physics.add.existing(leftWall, true);
        this.walls.add(leftWall);

        // Right wall
        const rightWall = this.add.rectangle(cfg.width - cfg.wallThick / 2, cfg.height / 2, cfg.wallThick, cfg.height, cfg.wallColor);
        this.physics.add.existing(rightWall, true);
        this.walls.add(rightWall);

        // Set camera bounds
        this.cameras.main.setBounds(0, 0, cfg.width, cfg.height);

        // Create ball near center of world
        this.ball = new Ball(this, cfg.width / 2, cfg.height / 2 - 100);

        // Clean up ball resources when scene shuts down
        this.events.on('shutdown', () => {
            if (this.ball) { this.ball.destroy(); this.ball = null; }
        });

        // Add collider between ball and walls
        this.physics.add.collider(this.ball, this.walls);

        // Snap camera to ball immediately, then follow with smooth lerp
        this.cameras.main.centerOn(this.ball.x, this.ball.y);
        this.cameras.main.startFollow(this.ball, true, GameConfig.ui.cameraLerp, GameConfig.ui.cameraLerp);

        // Set up ESC key to return to menu
        this.escKey = this.input.keyboard.addKey('ESC');
    }

    update() {
        if (this.ball) {
            this.ball.update();
        }

        // Return to menu when ESC is pressed
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.scene.start('MenuScene');
        }
    }
}
