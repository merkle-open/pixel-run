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

            // Adding background image
            this.$createBackground();

            // Instanciate the tilemap
            this.$createTilemap();

            // Create players set in settings file under /app
            this.$createPlayers(function() {
                // Follow the first player with the camera
                self.camera.follow(Container.World.players[Container.World.players.length - 1]);
            });
        },
        update: function() {
            var self = this;
            Container.World.players.forEach(function(player) {
                Container.game.physics.arcade.collide(player, Container.World.tilemapLayer);
                player.$update();
                player.run();
            });
        },
        $noPlayersAlive: function() {
            var noAlive = true;
            Container.World.players.forEach(function(player) {
                if(player.alive) {
                    noAlive = true;
                }
            });
            return noAlive;
        },
        $createBackground: function() {
            //var background = new Factory.Sprite(this, 'background-space');
            //background.add(0, 0);
        },
        $createTilemap: function() {
            var self = this;

            var map = new Factory.Tilemap(self, 'tilemap-space');
            map.addToGame(self);
            map.addImage('tile-space', 'tile-space');
            var layer = map.createLayer('world');
            map.setCollision('world', 0, 1000);
            map.resize('world');
            Container.World.tilemapLayer = layer;


            /*
            Container.procedures.addTilemap.run({
                game: self,
                tilemap: 'tilemap-space',
                layer: {
                    name: 'world',
                    start: 0,
                    end: 10000
                },
                tile: {
                    name: 'tile-space',
                    asset: 'tile-space'
                }
            }, function(result) {
                Container.World.tilemap = result.tilemap.map;
                Container.World.tilemapLayer = result.layer;
            }); */
        },
        $createPlayers: function(callback) {
            var self = this;
            var offset = config.players.offset;
            for(var i = 0; i < config.players.amount; i++) {
                var instance = new Factory.Player(self, i, offset.x * i, offset.y);
                instance.init();
                Container.World.players.push(instance);
            }
            callback();
        }
    };

})(window);
