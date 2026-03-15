import { GameConfig } from '../config.js';

// Phaser is available as a browser global (loaded via CDN before this module runs)
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const ui  = GameConfig.ui;
        const centerX = GameConfig.world.viewWidth / 2;

        // Title
        this.add.text(centerX, ui.titleY, 'BOYNG', {
            fontSize: ui.titleFontSize,
            fontFamily: 'Arial Black',
            color: ui.selectedColor
        }).setOrigin(0.5);

        // Menu options data
        this.menuOptions = [
            { text: 'Start Game', scene: 'Level1Scene' },
            { text: 'Exit Game', action: 'exit' }
        ];

        this.selectedIndex = 0;
        this.exitTextShown = false;

        // Create text objects for each option
        this.optionTexts = this.menuOptions.map((option, index) => {
            const text = this.add.text(centerX, ui.optionStartY + index * ui.optionSpacing, option.text, {
                fontSize: ui.optionFontSize,
                fontFamily: 'Arial',
                color: ui.defaultColor
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
        const ui = GameConfig.ui;
        this.optionTexts.forEach((text, index) => {
            if (index === this.selectedIndex) {
                text.setColor(ui.selectedColor).setScale(ui.selectedScale);
            } else {
                text.setColor(ui.defaultColor).setScale(ui.defaultScale);
            }
        });
    }

    selectOption() {
        const ui     = GameConfig.ui;
        const option = this.menuOptions[this.selectedIndex];
        const centerX = GameConfig.world.viewWidth / 2;

        if (option.scene) {
            this.scene.start(option.scene);
        } else if (option.action === 'exit') {
            if (!this.exitTextShown) {
                this.exitTextShown = true;
                this.add.text(centerX, ui.exitTextY, 'Thanks for playing!', {
                    fontSize: ui.exitFontSize,
                    color: ui.selectedColor
                }).setOrigin(0.5);
            }
        }
    }
}
