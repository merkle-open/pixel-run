(function(window, undefined) {
    'use strict';

    App.register('Game', {
        dependencies: ['Media', 'World', 'Render']
    }, function(module, settings) {
        module.publish('start', function() {
            var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
               preload: App.modules.Media.access('init'),
               create: App.modules.World.access('init'),
               update: App.modules.Render.access('init')
           });

           module.publish('game', game);
       });
    });

})(window);
