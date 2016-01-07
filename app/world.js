(function(window, undefined) {
    'use strict';

    App.register('World', {
        dependencies: []
    }, function(module, settings) {
        module.publish('init', function() {
            var platforms = module.access('platforms');
            var player = module.access('player');
            var game = App.modules.Game.access('game');

            //  We're going to be using physics, so enable the Arcade Physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //  A simple background for our game
            game.add.sprite(0, 0, 'sky');

            //  The platforms group contains the ground and the 2 ledges we can jump on
            platforms = game.add.group();

            //  We will enable physics for any object that is created in this group
            platforms.enableBody = true;

            // Here we create the ground.
            var ground = platforms.create(0, game.world.height - 64, 'ground');

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(2, 2);

            //  This stops it from falling away when you jump on it
            ground.body.immovable = true;

            //  Now let's create two ledges
            var ledge = platforms.create(400, 400, 'ground');
            ledge.body.immovable = true;

            ledge = platforms.create(-150, 250, 'ground');
            ledge.body.immovable = true;

            // Export elements to global module scope
            module.publish('ground', ground);
            module.publish('ledge', ledge);
            module.publish('platforms', platforms);

            // Adding the player and score
            module.access('addPlayer')();
            module.access('addScore')();

            // Add collectible items
            module.access('addCollectible')({
                gravity: 200,
                counter: 20,
                bounce: 0.1
            });

        });

        module.publish('addPlayer', function() {
            var game = App.modules.Game.access('game');
            var player;

            // The player and its settings
            player = game.add.sprite(32, game.world.height - 150, 'dude');

            //  We need to enable physics on the player
            game.physics.arcade.enable(player);

            //  Player physics properties. Give the little guy a slight bounce.
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 300;
            player.body.collideWorldBounds = true;

            //  Our two animations, walking left and right.
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);

            // The camera should follow the player
            game.camera.follow(player);

            // Publish player to module scope
            module.publish('player', player);
        });

        module.publish('addCollectible', function(settings) {
            settings = settings || {};
            var game = App.modules.Game.access('game');
            var collectible;

            collectible = game.add.group();
            collectible.enableBody = true;

            var counter = settings.counter || 12;
            var bounce = settings.bounce || 0.7;
            var gravity = settings.gravity || 100;

            for (var i = 0; i < counter; i++) {
                //  Create a star inside of the 'collectible' group
                var star = collectible.create(i * 70, 0, 'star');
                star.body.gravity.y = gravity;
                star.body.bounce.y = bounce + Math.random() * 0.2;
            }

            module.publish('collectible', collectible);
        });

        module._store.private.score = 0;
        module.publish('addScore', function() {
            var game = App.modules.Game.access('game');

            var scoreText = game.add.text(16, 16, 'Score: 0', {
                fontSize: '32px', fill: '#FFF'
            });

            module.publish('scoreText', scoreText);
        });
    });

})(window);
