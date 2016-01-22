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
        },
        create: function() {
            var self = this;
            this.add.sprite(0, 0, 'sky');

            var platforms = this.add.group();
            platforms.enableBody = true;

            var ground = platforms.create(0, this.world.height - 64, 'ground');
            ground.scale.setTo(2, 2);
            ground.body.immovable = true;

            var ledge = platforms.create(400, 400, 'ground');
            ledge.body.immovable = true;
            ledge = platforms.create(-150, 250, 'ground');
            ledge.body.immovable = true;

            Container.World.platforms = platforms;
            Container.World.ground = ground;
            Container.World.ledge = ledge;
            Container.World.players = [];

            // Create players set in settings file under /app
            this.$createPlayers(function() {
                // Follow the first player with the camera
                self.camera.follow(Container.World.players[Container.World.players.length - 1]);
            });
        },
        update: function() {
            this.physics.arcade.collide(Container.World.players, Container.World.ground);
            Container.World.players.forEach(function(player) {
                player.$update();
                player.run();
            });
        },
        render: function() {
            this.game.debug.text('FPS ' + (this.game.time.fps || '--'), 20, 70, "#00ff00", "20px Courier");
        },
        $createPlayers: function(callback) {
            var self = this;
            for(var i = 0; i < config.players.amount; i++) {
                var instance = new Factory.Player(self, i, config.players.offset.x * i, config.players.offset.y, 'player-default');
                instance.init();
                Container.World.players.push(instance);
            }
            callback();
        }
    };

})(window);
