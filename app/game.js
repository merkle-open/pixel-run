(function(window, undefined) {
    'use strict';

    Root.Game = Root.$createModule('game', {
        width: 800,
        height: 600,
        mode: 'AUTO',
        hud: {
            scoreText: 'Score: {count}',
            collectPoints: 10
        }
    }, function(App) {
        console.log('Loading module %s ...', this.name);
        var conf = this.settings;

        var game = new Phaser.Game(conf.width, conf.height, Phaser[conf.mode], '', {
            preload: App.Media.load,
            create: App.World.create,
            update: App.Renderer.update
        });

        this.get = function() {
            // Encapsulate the game Object
            return game;
        }

    });

})(window);
