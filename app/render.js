(function(window, undefined) {
    'use strict';

    App.register('Render', {
        dependencies: ['World']
    }, function(module) {
        module.publish('init', function() {
            var game = App.modules.Game.access('game');
            var player = App.modules.World.access('player');
            var platforms = App.modules.World.access('platforms');
            var cursors = module.access('cursors');

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

            module.access('collectible')();
        });

        module.publish('collectible', function() {
            var game = App.modules.Game.access('game');
            var player = App.modules.World.access('player');
            var platforms = App.modules.World.access('platforms');
            var collectible = App.modules.World.access('collectible');
            var collector = module.access('collectItem');

            game.physics.arcade.collide(collectible, platforms);
            game.physics.arcade.overlap(player, collectible, collector, null, this);
        });

        module.publish('collectItem', function(player, item, points) {
            var score = App.modules.World._store.private.score;
            var scoreText = App.modules.World.access('scoreText');
            points = points || 5;

            // Removes the star from the screen
            item.kill(App.modules.World.access('collectible'));
            App.modules.World._store.private.score = (score + points);

            // Increase the score
            scoreText.text = 'Score: ' + App.modules.World._store.private.score;
        });
    });

})(window);
