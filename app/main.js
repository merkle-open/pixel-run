/**
 * /app/main.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var stepper = new HUD.Factory.Stepper($('.pregame.steps'));
    var settings = Container.settings;
    var config = settings.render;

    console.log('Welcome to the Pixel. Run. game by Namics AG!\n');
    Controls.Arrows.disable();

    stepper.start(function($lastStep) {
        // Get the current selected world and players
        settings.worldType = HUD.$store.world;
        settings.currentPlayers = Util.getValues(HUD.$store.players);
        settings.game.players.amount = settings.currentPlayers.length;

        // Enable the arrow keys
        Controls.Arrows.enable();

        // Create a new phaser game
        var game = new Phaser.Game(config.width, config.height, Phaser.CANVAS, config.node);

        // Adding all required phaser-game-states
        game.state.add('Boot', Container.Boot);
        game.state.add('Preload', Container.Preload);
        game.state.add('Game', Container.Game);
        game.state.add('Over', Container.Over);
        game.state.add('Sync', Container.Sync);

        // Make game accessable
        Container.game = game;

        // Fade out the last step and start the game
        game.state.start('Boot'); // starting the boot state
        $lastStep.fadeOut(1800, function() {
            $('.steps').remove(); // Remove the stepper element
            Container.$indicate.preload(); // Loading indicator for preload
        });
    });

})(window);
