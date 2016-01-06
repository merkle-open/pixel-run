(function(window, undefined) {
    'use strict';

    App.register('Render', {
        dependencies: ['World']
    }, function(container, settings) {
        container.init = function() {
            var game = App.modules.Game.game;
            var player = App.modules.World.player;
            var platforms = App.modules.World.platforms;
            var cursors = container.cursors;

            //  Collide the player and the stars with the platforms
            game.physics.arcade.collide(player, platforms);
            cursors = game.input.keyboard.createCursorKeys();

            //  Reset the players velocity (movement)
            player.body.velocity.x = 0;

            if (cursors.left.isDown) {
                //  Move to the left
                player.body.velocity.x = -150;
                player.animations.play('left');
            } else if (cursors.right.isDown) {
                //  Move to the right
                player.body.velocity.x = 150;
                player.animations.play('right');
            } else {
                //  Stand still
                player.animations.stop();
                player.frame = 4;
            }

            //  Allow the player to jump if they are touching the ground.
            if (cursors.up.isDown && player.body.touching.down) {
                player.body.velocity.y = -350;
            }
        }
    });

})(window);
