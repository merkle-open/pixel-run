(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var config = Container.settings.physics;
    var paths = Container.settings.paths;

    var loader = {
        images: {
            sky: "assets/img/sky.png",
            ground: "assets/img/platform.png",
            star: "assets/img/star.png",
            player: "assets/img/avatars/player.png"
        },
        sprites: {
            playerExample: {
                path: "assets/img/dude.png",
                x: 32,
                y: 48
            }
        }
    };

    Container.Boot = function(game) {
        // Empty class wrapper
    };

    Container.Boot.prototype = {
        preload: function() {
            for(var img in loader.images) {
                this.load.image(Util.hyphenate(img), loader.images[img]);
            }
            for(var sprite in loader.sprites) {
                var opts = loader.sprites[sprite];
                this.load.spritesheet(Util.hyphenate(sprite), opts.path, opts.x, opts.y);
            }
        },
        create: function() {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            if (!this.game.device.desktop) {
                this.scale.minWidth = 250;
                this.scale.minHeight = 250;
                this.scale.maxWidth = 600;
                this.scale.maxHeight = 1000;
                this.scale.forceLandscape = false;
            }
            this.state.start('Preload');
        }
    };

})(window);
