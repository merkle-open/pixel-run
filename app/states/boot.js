(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var config = Container.settings.physics;
    var paths = Container.settings.paths;

    var loader = {
        images: {
            player: 'assets/img/avatars/player.png',
            demoTile: 'assets/img/world/tiles/demo.png'
        },
        sprites: {
            playerExample: {
                path: 'assets/img/dude.png',
                x: 32,
                y: 48
            }
        },
        tilemaps: {
            demoTilemap: 'assets/img/world/tilemaps/demo.json'
        }
    };

    Container.Boot = function(game) {
        // Empty class wrapper
    };

    Container.Boot.prototype = {
        preload: function() {
            var self = this;
            this.$loadEach([
                {
                    collection: loader.images,
                    handler: function(key, path) {
                        console.info('$loadEach Image > %s', key);
                        self.load.image(key, path);
                    }
                },
                {
                    collection: loader.sprites,
                    handler: function(key, props) {
                        console.info('$loadEach Sprites > %s', key);
                        self.load.spritesheet(key, props.path, props.x, props.y);
                    }
                },
                {
                    collection: loader.tilemaps,
                    handler: function(key, path) {
                        console.info('$loadEach Tilemaps %s', key);
                        self.load.tilemap(key, path, null, Phaser.Tilemap.TILED_JSON);
                    }
                }
            ]);
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
        },
        $loadEach: function(collection, handler) {
            var self = this;
            if(typeof collection === 'object' && handler) {
                for(var key in collection) {
                    handler(key, collection[key]);
                }
            } else if(Array.isArray(collection) && !handler) {
                collection.forEach(function(child) {
                    self.$loadEach(child['collection'], child['handler']);
                });
            } else {
                throw new Error('BootState: $loadEach requires an object collection and handler or an array');
            }
        }
    };

})(window);
