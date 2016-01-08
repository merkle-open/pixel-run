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

        var game = new Phaser.Game(conf.width, conf.height, Phaser[conf.mode], 'mainState');

        var mainState = {
            preload: App.Media.load,
            create: App.World.create,
            update: App.Renderer.update
        };

        game.state.add('main', mainState);
        game.state.start('main');

        this.get = function() {
            // Encapsulate the game Object
            return game;
        };

        this.restart = function() {
            game.state.start('main');
        }

    });

})(window);
