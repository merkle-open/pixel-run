(function(window, undefined) {
    'use strict';

    Root.World = Root.$createModule('world', {
        media: {
            bird: 'bird',
            pipe: 'pipe'
        },
        pipes: {
            count: 20,
            timer: 1500
        },
        bird: {
            jumpVelocity: -350
        },
        gravity: 1000
    }, function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;
        var conf = module.settings;

        this.create = function() {
            var game = App.Game.get();
            module._createScore(game);
            module._createBird(game);
            module._createPipes(game);
            module._addRecreationTimer(game, module._addRowOfPipes);
        };

        this._createBird = function(game) {
            // Set the physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);

            // Display the bird on the screen
            var bird = game.add.sprite(100, 245, conf.media.bird);

            // Add gravity to the bird to make it fall
            game.physics.arcade.enable(bird);
            bird.body.gravity.y = conf.gravity;
            bird.enableBody = true;

            // Call the 'jump' function when the spacekey is hit
            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(function() {
                bird.body.velocity.y = conf.bird.jumpVelocity;

                // Create an animation on the bird
                game.add.tween(bird).to({
                    angle: -20
                }, 100).start();
            }, this);
            bird.anchor.setTo(-0.2, 0.5);

            module.bird = bird;
        };

        this._createPipes = function(game) {
            var pipes = game.add.group(); // Create a group
            pipes.enableBody = true;  // Add physics to the group
            pipes.createMultiple(conf.pipes.count, conf.media.pipe); // Create 20 pipes
            module.pipes = pipes;
        };

        this._addOnePipe = function(x, y) {
            // Get the first dead pipe of our group
            var pipe = module.pipes.getFirstDead();

            // Set the new position of the pipe
            pipe.reset(x, y);

            // Add velocity to the pipe to make it move left
            pipe.body.velocity.x = -200;

            // Kill the pipe when it's no longer visible
            pipe.checkWorldBounds = true;
            pipe.outOfBoundsKill = true;
        };

        this._addRowOfPipes = function() {
            // Pick where the hole will be
            var hole = Math.floor(Math.random() * 5) + 1;

            module.score += 1;
            module.labelScore.text = this.score;

            // Add the 6 pipes
            for (var i = 0; i < 8; i++) {
                if (i != hole && i != hole + 1)  {
                    module._addOnePipe(400, i * 60 + 10);
                }
            }
        };

        this._createScore = function(game) {
            module.score = 0;
            module.labelScore = game.add.text(20, 20, "0", {
                font: "30px Arial", fill: "#fff"
            });
        };

        this._addRecreationTimer = function(game, handler) {
            module.timer = game.time.events.loop(conf.pipes.timer, handler, module);
        };
    });

})(window);
