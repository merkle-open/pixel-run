(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var config = Container.settings.physics;

    Container.Boot = function(game) {
        // Empty class wrapper
    };

    Container.Boot.prototype = {
        preload: function() {
            this.load.image('sky', 'assets/img/sky.png');
            this.load.image('ground', 'assets/img/platform.png');
            this.load.image('star', 'assets/img/star.png');
            this.load.spritesheet('player', 'assets/img/dude.png', 32, 48);
        },
        create: function() {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            if (!this.game.device.desktop) {
                this.scale.minWidth = 150;
                this.scale.minHeight = 250;
                this.scale.maxWidth = 600;
                this.scale.maxHeight = 1000;
                this.scale.forceLandscape = false;
            }
            this.state.start('Preload');
        }
    };

})(window);
