// Phaser Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1a1a2e',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
            debug: false  // Set to true to visualize physics bodies during tuning
        }
    },
    scene: [MenuScene, Level1Scene]
};

// Initialize Phaser game
const game = new Phaser.Game(config);
