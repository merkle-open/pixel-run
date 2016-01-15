(function(window, undefined) {
    'use strict';

    Root.Game = Root.$createModule('game', {
        width: '100%',
        height: '100%',
        mode: 'AUTO',
        id: 'canvas-game',
        hud: {
            scoreText: 'Score: {count}',
            collectPoints: 10
        }
    }, function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;
        var conf = module.settings;

        var game = new Phaser.Game(conf.width, conf.height, Phaser[conf.mode], conf.id, {
            preload: App.Media.init,
            create: App.World.init,
            update: App.Renderer.init
        });

        // Initialize the main interface
        Root.HUD.init();

        this.get = function() {
            // Encapsulate the game Object
            return game;
        };

        this.$node = $('#' + conf.id);

    });

})(window);
