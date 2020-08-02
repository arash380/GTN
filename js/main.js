let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 608,
    scale: {
        parent: 'body',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {debug: false}
    },
    backgroundColor: '#2FFF9F',
    audio: {
        disableWebAudio: true
    },
    dom: {
        createContainer: true
    },
}

// Creates the game and adds all scenes
let game = new Phaser.Game(config);
game.scene.add('FirstScene', FirstScene);
game.scene.add('Game1', Game1);
game.scene.add('Game2', Game2);
game.scene.add('Game3', Game3);
game.scene.add('Game4', Game4);
game.scene.add('Game5', Game5);
game.scene.add('Game6', Game6);
game.scene.add('Game7', Game7);
game.scene.add('Game8', Game8);
game.scene.add('Game9', Game9);
game.scene.add('Game10', Game10);
game.scene.start('Game5'); // changed from FirstScene 