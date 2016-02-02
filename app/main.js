(function(window, undefined) {
    'use strict';

    var $ = window.$;
    var config = Container.settings.render;

    document.getElementById('js-start-game').addEventListener('click', function() {

        // Hide the overlay resp. fade it out
        $.fade(document.getElementById('js-hide-start'));

        // Get the current selected world and players
        Container.settings.worldType = document.getElementById('js-world').value;
        Container.settings.currentPlayers = document.getElementById('js-player-list').value.split(',');
        Container.settings.game.players.amount = Container.settings.currentPlayers.length;

        // Create a new phaser game
        var game = new Phaser.Game(config.width, config.height, config.mode, config.node);

        //adding all the required states
        game.state.add('Boot', Container.Boot);
        game.state.add('Preload', Container.Preload);
        game.state.add('Game', Container.Game);
        game.state.add('Procedures', Container.Procedures);
        game.state.start('Boot'); //starting the boot state

        // Make game accessable
        Container.game = game;
    });

})(window);
