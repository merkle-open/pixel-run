 (function(window, undefined) {
    'use strict';

    Root.World = Root.$createModule('world', {
        avatar: 'avatar',
        collectable: 'coin',
        sky: 'sky',
        ground: 'platform'
    }, function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;
        var conf = module.settings;

        this._createPlatforms = function(game) {
            //  We're going to be using physics, so enable the Arcade Physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);

            //  A simple background for our game
            game.add.sprite(0, 0, conf.sky);

            //  The platforms group contains the ground and the 2 ledges we can jump on
            var platforms = game.add.group();
            platforms.enableBody = true;

            // Here we create the ground.
            var ground = platforms.create(0, game.world.height - 64, conf.ground);

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(2, 2);
            ground.body.immovable = true;

            var ledge = platforms.create(400, 400, conf.ground);
            ledge.body.immovable = true;
            ledge = platforms.create(-150, 250, conf.ground);
            ledge.body.immovable = true;

            module.ledge = ledge;
            module.ground = ground;
            module.platforms = platforms;
        }

        this._createPlayer = function(game) {
            var player;

            // The player and its settings
            player = game.add.sprite(32, game.world.height - 150, conf.avatar);

            // We need to enable physics on the player
            game.physics.arcade.enable(player);

            // Player physics properties. Give the little guy a slight bounce.
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 300;
            player.body.collideWorldBounds = true;

            // Our two animations, walking left and right.
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);

            module.player = player;
        }

        this._createCollectibe = function(game, settings) {
            var container = game.add.group();
            container.enableBody = true;

            settings = settings || {};
            settings.bounce = settings.bounce || 0.7;
            settings.gravity = settings.gravity || 6;
            settings.count = settings.count || 0;
            settings.space = settings.space || 70;

            //  Here we'll create 12 of them evenly spaced apart
            for (var i = 0; i < settings.count; i++) {
                //  Create a star inside of the 'stars' group
                var item = container.create(i * 70, 0, settings.media);
                item.body.gravity.y = settings.gravity;
                item.body.bounce.y = settings.bounce + Math.random() * 0.2;
            }

            module.collectable = container;
        }

        this._createScore = function(game, settings) {
            settings.size = settings.size || '32px';
            settings.color = settings.color || '#ffffff';

            var score = 0;
            var text = settings.text || 'Score: {count}';
            text = Root.Util.$createReplacer(text);
            text = text.replace({ count: score });

            var scoreText = game.add.text(16, 16, text, {
                fontSize: settings.size,
                fill: settings.color
            });

            module.score = {
                text: scoreText,
                count: score
            };
        }

        this.create = function() {
            var game = App.Game.get();

            module._createPlatforms(game);
            module._createPlayer(game);
            module._createCollectibe(game, {
                count: 20,
                gravity: 1000,
                bounce: 0.3,
                space: 70,
                media: conf.collectable
            });
            module._createScore(game, {
                fontSize: '30px',
                color: '#fff',
                text: Root.Game.settings.hud.scoreText
            });
        }
    });

})(window);
