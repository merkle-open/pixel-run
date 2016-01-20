(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var config = Container.settings.game;

    Container.Game = function(game) {
        // Wrapper
    };

    Container.Game.prototype = {
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

            Container.platforms = platforms;
            Container.ground = ground;
            Container.ledge = ledge;
            Container.cursors = this.input.keyboard.createCursorKeys();
            Container.players = [];

            this._createControls();
        },
        update: function() {
            this.physics.arcade.collide(Container.players, Container.platforms);
        },
        _createControls: function() {
            var avaible = ['up', 'down', 'left', 'right'];
            for(var i = 0; i < config.players.amount; i++) {
                var player = this._createPlayer(i, avaible[i]);
                if(Container.cursors[avaible[i]].isDown) {
                    Container.players[i].body.velocity.y = -350;
                }
            }
        },
        _createPlayer: function(index, control) {
            var player = this._buildPlayerInstance(config.players.variations[index], index);
            Container.players.push(player);
            return player;
        },
        _buildPlayerInstance: function(sprite, index) {
            var offset = (index === 0 ? 0.5 : index + 1) * (config.placementOffset * 2);
            var player = this.add.sprite(offset, this.world.height - 150, 'dude');
            this.physics.arcade.enable(player);
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 300;
            player.body.collideWorldBounds = true;
            return player;
        }
    };

})(window);
