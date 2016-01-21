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
            this.$createPlayers();
        },
        update: function() {
            this.physics.arcade.collide(Container.World.players, Container.World.ground);
            Container.World.players.forEach(function(player) {
                player.$update();
            });
        },
        $createPlayers: function() {
            var self = this;
            for(var i = 0; i < config.players.amount; i++) {
                var instance = new Factory.Player(self, i, 0, 0, '');
                instance.init();
                Container.World.players.push(instance);
            }
        }
    };

})(window);
