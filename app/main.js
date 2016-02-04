/**
 * /app/main.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var settings = Container.settings;
    var config = settings.render;
    var game = null;

    var pregame = new HUD.Factory.Stepper($('.pregame.steps'));
    pregame.start(function($lastStep) {

        // Get the current selected world and players
        settings.worldType = HUD.$store.world;
        settings.currentPlayers = Util.getValues(HUD.$store.players);
        settings.game.players.amount = settings.currentPlayers.length;

        // Create a new phaser game
        game = new Phaser.Game(config.width, config.height, config.mode, config.node);

        // Adding all required phaser-game-states
        game.state.add('Boot', Container.Boot);
        game.state.add('Preload', Container.Preload);
        game.state.add('Game', Container.Game);
        game.state.add('Procedures', Container.Procedures);


                // Show the last info container on end
                game.finishedCallback = function() {
                    var content = $('.js-finished').html();
                    var playerScores = Util.getPlayerScoreData();

                    $('.js-finished').html(Util.replace(content, playerScores));
                    $('#' + config.node).fadeOut(function() {
                        $('.js-finished').fadeIn();
                    });
                };

        // Make game accessable
        Container.game = game;

        // Fade out the last step and start the game
        $lastStep.fadeOut(1500, function() {
            $('.steps').remove(); // remove the stepper container and HTML nodes
            game.state.start('Boot'); // starting the boot state
        });
    });

})(window);
