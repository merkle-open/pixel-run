(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var config = Container.settings.game;

    Container.Game = function(game) {
        // Wrapper
    };

    Container.Game.prototype = {
        preload: function() {
            Container.World = {};
            Container.World.players = [];
        },
        create: function() {
            var self = this;

            // Instanciate the tilemap
            this.$createTilemap();

            window.Container.Map = new Factory.Map({
                tilemap: {
                    name: 'demoTilemap',
                    tiles: {
                        name: 'demo',
                        id: 'demoTile'
                    },
                    layer: {
                        name: 'layer1'
                    }
                }
            });

            // Create players set in settings file under /app
            this.$createPlayers(function() {
                // Follow the first player with the camera
                self.camera.follow(Container.World.players[Container.World.players.length - 1]);
            });
        },
        update: function() {
            var self = this;
            Container.World.players.forEach(function(player) {
                Container.game.physics.arcade.collide(player, Container.World.tilemap);
                player.$update();
                player.run();
            });
        },
        render: function() {
            this.game.debug.text('FPS ' + (this.game.time.fps || '--'), 20, 70, "#00ff00", "20px Courier");
        },
        $createTilemap: function() {
            var map = new Factory.Tilemap(this, 'demoTilemap');
            map.addToGame(this);
            map.addImage('demo', 'demoTile');
            map.createLayer('layer1'); // Works until here
            map.resize('layer1');
        },
        $createPlayers: function(callback) {
            var self = this;
            var offset = config.players.offset;
            for(var i = 0; i < config.players.amount; i++) {
                var instance = new Factory.Player(self, i, offset.x * i, offset.y, 'player-default');
                instance.init();
                Container.World.players.push(instance);
            }
            callback();
        }
    };

})(window);
