// Phaser is available as a browser global (loaded via CDN before this module runs)
import { GameConfig } from './config.js';
import { MenuScene } from './scenes/MenuScene.js';
import { Level1Scene } from './scenes/Level1Scene.js';

const config = {
    type: Phaser.AUTO,
    width: GameConfig.world.viewWidth,
    height: GameConfig.world.viewHeight,
    backgroundColor: GameConfig.world.bgColor,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GameConfig.world.gravity },
            debug: false  // Set to true to visualize physics bodies during tuning
        }
    },
    scene: [MenuScene, Level1Scene]
};

// Initialize Phaser game
const game = new Phaser.Game(config);

// Expose game instance for Playwright E2E tests
window.__game = game;
