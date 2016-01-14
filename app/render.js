(function(window, undefined) {
    'use strict';

    Root.Renderer = Root.$createModule('renderer', function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;

        this._makePlayerMovable = function(game, player) {
            var cursors = game.input.keyboard.createCursorKeys();

            //  Reset the players velocity (movement)
            player.body.velocity.x = 0;

            game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


            if (cursors.left.isDown) {
                player.body.velocity.x = -150;
                player.animations.play('left');
            } else if (cursors.right.isDown) {
                player.body.velocity.x = 150;
                player.animations.play('right');
            } else {
                player.animations.stop();
                player.frame = 4;
            }

            //  Allow the player to jump if they are touching the ground.
            if ((cursors.up.isDown) && player.body.touching.down) {
                player.body.velocity.y = -350;
            }

            spaceKey.onDown.add(function() {
                if(!player.body.touching.down) {
                    return false;
                }
                player.body.velocity.y = -350;
            })

            module.cursors = cursors;
        }

        this._addCollisionDetection = function(game, obj, target) {
            game.physics.arcade.collide(obj, target);
        }

        this._addCollectable = function(game, items, platforms, player) {
            module._addCollisionDetection(game, items, platforms);
            game.physics.arcade.overlap(player, items, module._collect, null, this);
        }

        this._kill = function(obj, target) {
            target.kill();
        }

        this._collect = function(obj, target) {
            module._kill(obj, target);
            var settings = Root.Game.settings;
            var updated = Root.Util.$createReplacer(settings.hud.scoreText);

            App.World.score.count += settings.hud.collectPoints;
            App.World.score.text.text = updated.replace({
                count: App.World.score.count
            });
        }

        this.update = function() {
            var game = App.Game.get();
            var player = App.World.player;
            var platforms = App.World.platforms;
            var collectable = App.World.collectable;

            module._addCollisionDetection(game, player, platforms);
            module._makePlayerMovable(game, player);
            module._addCollectable(game, collectable, platforms, player);
        }

    });

})(window);
