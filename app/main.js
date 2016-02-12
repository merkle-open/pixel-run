/**
 * /app/main.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var settings = Container.settings;
    var config = settings.render;

    console.log(window.$introduction);
    console.log('Welcome to the Pixel. Run. game by Namics AG!')

    var pregame = Container.stepper = new HUD.Factory.Stepper($('.pregame.steps'));
    pregame.start(function($lastStep) {

        // Get the current selected world and players
        settings.worldType = HUD.$store.world;
        settings.currentPlayers = Util.getValues(HUD.$store.players);
        settings.game.players.amount = settings.currentPlayers.length;

        // Create a new phaser game
        var game = new Phaser.Game(config.width, config.height, Phaser.CANVAS, config.node);

        // Adding all required phaser-game-states
        game.state.add('Boot', Container.Boot);
        game.state.add('Preload', Container.Preload);
        game.state.add('Game', Container.Game);
        game.state.add('Procedures', Container.Procedures);

        // Show the last info container on end
        game.finishedCallback = function() {
            var content = $('.js-finished').html();
            var playerScores = Util.getPlayerScoreData();

            // Transform playeholders
            $('.js-finished').html(Util.replace(content, playerScores));
            $('#' + config.node).fadeOut(function() {
                $('.js-finished').fadeIn();
            });
        };

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
