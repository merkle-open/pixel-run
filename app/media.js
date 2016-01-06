(function(window, undefined) {
    'use strict';

    App.register('Media', {
        dependencies: []
    }, function(container, settings) {
        container.init = function() {
            var game = App.modules.Game.game;
            game.load.image('sky', 'assets/img/sky.png');
            game.load.image('ground', 'assets/img/platform.png');
            game.load.image('star', 'assets/img/star.png');
            game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
        }
    });

})(window);
