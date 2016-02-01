(function(window, undefined) {
    'use strict';

    var config = Container.settings.render;

    var game = new Phaser.Game(config.width, config.height, config.mode, config.node);

    //adding all the required states
    game.state.add('Boot', Container.Boot);
    game.state.add('Preload', Container.Preload);
    game.state.add('Game', Container.Game);
    game.state.add('Procedures', Container.Procedures);
    game.state.start('Boot'); //starting the boot state

    Container.game = game;

})(window);
