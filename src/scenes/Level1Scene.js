class Level1Scene extends Phaser.Scene {
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
        // Set world bounds (larger than viewport for camera testing)
        this.physics.world.bounds.width = 1200;
        this.physics.world.bounds.height = 800;

        // Create static group for walls
        this.walls = this.physics.add.staticGroup();

        // Create four walls forming an enclosure
        // Floor
        const floor = this.add.rectangle(600, 790, 1200, 20, 0x4a4a4a);
        this.physics.add.existing(floor, true);
        this.walls.add(floor);

        // Ceiling
        const ceiling = this.add.rectangle(600, 10, 1200, 20, 0x4a4a4a);
        this.physics.add.existing(ceiling, true);
        this.walls.add(ceiling);

        // Left wall
        const leftWall = this.add.rectangle(10, 400, 20, 800, 0x4a4a4a);
        this.physics.add.existing(leftWall, true);
        this.walls.add(leftWall);

        // Right wall
        const rightWall = this.add.rectangle(1190, 400, 20, 800, 0x4a4a4a);
        this.physics.add.existing(rightWall, true);
        this.walls.add(rightWall);

        // Set camera bounds
        this.cameras.main.setBounds(0, 0, 1200, 800);

        // Create ball near center of world
        this.ball = new Ball(this, 600, 300);

        // Add collider between ball and walls
        this.physics.add.collider(this.ball, this.walls);

        // Snap camera to ball immediately, then follow with smooth lerp
        this.cameras.main.centerOn(this.ball.x, this.ball.y);
        this.cameras.main.startFollow(this.ball, true, 0.1, 0.1);

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
