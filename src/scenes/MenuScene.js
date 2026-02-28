class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Title
        this.add.text(400, 150, 'BOYNG', {
            fontSize: '72px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Menu options data
        this.menuOptions = [
            { text: 'Start Game', scene: 'Level1Scene' },
            { text: 'Exit Game', action: 'exit' }
        ];

        this.selectedIndex = 0;

        // Create text objects for each option
        this.optionTexts = this.menuOptions.map((option, index) => {
            const text = this.add.text(400, 300 + index * 60, option.text, {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#cccccc'
            }).setOrigin(0.5).setInteractive();

            // Mouse hover event
            text.on('pointerover', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });

            // Mouse click event
            text.on('pointerdown', () => {
                this.selectOption();
            });

            return text;
        });

        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey('ENTER');

        // Initial highlight
        this.updateSelection();
    }

    update() {
        // Navigate down
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.selectedIndex = (this.selectedIndex + 1) % this.menuOptions.length;
            this.updateSelection();
        }

        // Navigate up
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.selectedIndex = (this.selectedIndex - 1 + this.menuOptions.length) % this.menuOptions.length;
            this.updateSelection();
        }

        // Select option with Enter
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.selectOption();
        }
    }

    updateSelection() {
        this.optionTexts.forEach((text, index) => {
            if (index === this.selectedIndex) {
                text.setColor('#ffffff').setScale(1.1);
            } else {
                text.setColor('#cccccc').setScale(1.0);
            }
        });
    }

    selectOption() {
        const option = this.menuOptions[this.selectedIndex];

        if (option.scene) {
            this.scene.start(option.scene);
        } else if (option.action === 'exit') {
            // Show farewell message
            this.add.text(400, 400, 'Thanks for playing!', {
                fontSize: '24px',
                color: '#ffffff'
            }).setOrigin(0.5);
        }
    }
}
