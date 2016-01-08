(function(window, undefined) {
    'use strict';

    Root.Media = Root.$createModule('media', {
        paths: {
            sky: 'assets/img/sky.png',
            platform: 'assets/img/platform.png',
            coin: 'assets/img/star.png',
            avatar: 'assets/img/dude.png'
        },
        sprites: {
            avatar: {
                posX: 32,
                posY: 48
            }
        }
    }, function(App) {
        console.log('Loading module %s ...', this.name);
        var conf = this.settings;

        this.load = function() {
            var game = App.Game.get();
            game.load.image('sky', conf.paths.sky);
            game.load.image('platform', conf.paths.platform);
            game.load.image('coin', conf.paths.coin);
            game.load.spritesheet('avatar', conf.paths.avatar, conf.sprites.avatar.posX, conf.sprites.avatar.posY);
        }
    });

})(window);
