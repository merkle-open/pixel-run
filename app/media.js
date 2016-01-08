(function(window, undefined) {
    'use strict';

    Root.Media = Root.$createModule('media', {
        paths: {
            bird: 'assets/img/bird.png',
            pipe: 'assets/img/pipe.png'
        },
        sprites: {

        }
    }, function(App) {
        console.log('Loading module %s ...', this.name);
        var conf = this.settings;

        this.load = function() {
            var game = App.Game.get();
            game.stage.backgroundColor = '#71c5cf';
            game.load.image('bird', conf.paths.bird);
            game.load.image('pipe', conf.paths.pipe); 
        }
    });

})(window);
