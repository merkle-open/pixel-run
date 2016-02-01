(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var config = Container.settings.physics;
    var paths = Container.settings.paths;

    var loader = {
        images: {
            spaceBackground: 'assets/img/backgrounds/background-space.png',
            spaceTile: 'assets/img/world/space/tiles/tile-space.png',
            spaceConsultant: 'assets/img/avatars/space/avatar-space-consultant.png',
            spaceTechie: 'assets/img/avatars/space/avatar-space-techie.png',
            spaceDesigner: 'assets/img/avatars/space/avatar-space-designer.png'
        },

        tilemaps: {
            spaceTilemap: 'assets/img/world/space/tilemap-space.json'
        }
    };

    Container.Boot = function(game) {
        // Empty class wrapper
    };

    Container.Boot.prototype = {
        preload: function() {
            var self = this;

            this.load.tilemap('tilemap-space', 'assets/img/world/space/tilemap-space.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('background-space', 'assets/img/backgrounds/background-space.png');
            this.load.image('tile-space', 'assets/img/world/space/tiles/tile-space.png');
            this.load.image('avatar-space-consultant', 'assets/img/avatars/space/avatar-space-consultant.png');
            this.load.image('avatar-space-techie', 'assets/img/avatars/space/avatar-space-techie.png');
            this.load.image('avatar-space-designer', 'assets/img/avatars/space/avatar-space-designer.png');

        },
        create: function() {
            /*
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            if (!this.game.device.desktop) {
                // Adding mobile support (phaser example)
                this.scale.minWidth = 250;
                this.scale.minHeight = 250;
                this.scale.maxWidth = 600;
                this.scale.maxHeight = 1000;
                this.scale.forceLandscape = false;
            }*/
            this.state.start('Preload');
        }
    };

})(window);
