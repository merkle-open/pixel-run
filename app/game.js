(function(window, undefined) {
    'use strict';

    App.register('Game', {
        dependencies: ['Media', 'World', 'Render']
    }, function(container, settings) {
        container.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
            preload: App.modules.Media.init,
            create: App.modules.World.init,
            update: App.modules.Render.init
        });
    });

})(window);
