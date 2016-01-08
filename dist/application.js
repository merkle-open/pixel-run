(function(window, undefined) {
    'use strict';

    var moduleIdentifier = 1;
    var backup = window.Root || undefined;
    var Root = window.Root = {
        _modules: {},
        _factory: {},
        _config: {}
    };

    Root.$$defaults = function() {
        Root._config.debug = backup.debug || false;
    };

    Root.$$factory = function() {
        // Publish the GameModule
        Root._factory.Module = GameModule;

        // Setting Debug Mode
        if(!Root._config.debug && window.console !== undefined) {
            ['log', 'warn', 'info', 'error'].forEach(function(type) {
                window.console[type] = function() {
                    // Disable logging if not in debug mode
                }
            });
        }
    };

    // Gets the old Root object before running this app
    Root.$giveBack = function() {
        return backup;
    };

    Root.$configure = function(key, value) {
        Root._config[key] = value;
    };

    Root.$enable = function(key) {
        Root._config[key] = true;
    };

    Root.$disable = function(key) {
        Root._config[key] = false;
    };

    Root.$createModule = function(name, settings, factory, type) {
        if(type === undefined) {
            type = GameModule;
        }
        var instance = new type(name, settings, factory);
        Root._modules[name] = instance;
        return instance;
    };

    Root.$preload = function(queue) {
        Root._preload = queue;
        return this;
    };

    Root.$start = function(queue) {
        if(Array.isArray(Root._preload)) {
            var preload = Root._preload;
            delete Root._preload;
            Root.$start(preload);
        }
        var modules = Root._modules;
        if(queue === undefined) {
            queue = Object.keys(Root._modules);
        }

        if(!Array.isArray(queue)) {
            throw new Error('No action for $start arguments defined.');
        }

        queue.forEach(function(gameModule) {
            if(!modules[gameModule]) {
                console.warn('Module %s not found, skipping', gameModule);
                return false;
            }

            modules[gameModule].init();
        });
    };

    function GameModule(name, settings, factory) {
        if(typeof name === 'string') {
            if(!factory && settings) {
                factory = settings;
                settings = {};
            }
            settings.name = name;
            name = undefined;
        }

        this.settings = settings;
        this.name = settings.name;
        delete this.settings.name;
        this.factory = factory;
    };

    GameModule.prototype = {
        init: function() {
            this._id = moduleIdentifier++;
            this.factory(Root);
            this._saveState = Root.Util.clone(this);
        },
        reload: function() {
            var saved = this._saveState;
            return Root._modules[this.name] = saved;
        }
    };

    Root.$$defaults();
    Root.$$factory();

    window.Root = Root;
})(window);

(function(window, undefined) {
    'use strict';

    Root.Util = Root.$createModule('util', function(App) {
        console.log('Loading module %s ...', this.name);

        function Replacer(input, data) {
            this.input = input;
            this.data = data;
            return this;
        }

        Replacer.prototype = {
            replace: function(data) {
                var result = this.input;
                if(data === undefined) {
                    data = this.data;
                }
                var keys = Object.keys(data);
                keys.forEach(function(key) {
                    result = result.replace('{' + key + '}', data[key]);
                });
                return result;
            }
        };

        this.Replacer = Replacer;
        this.$createReplacer = function(input, data) {
            return new Replacer(input, data);
        };

        this.clone = function(obj) {
            if (!obj || typeof obj !== 'object') {
                return obj;
            }
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr) && attr !== '_saveState') {
                    copy[attr] = obj[attr];
                }
            }
            return copy;
        }
    });

})(window);

(function(window, undefined) {
    'use strict';

    Root.Game = Root.$createModule('game', {
        width: 800,
        height: 600,
        mode: 'AUTO',
        hud: {
            scoreText: 'Score: {count}',
            collectPoints: 10
        }
    }, function(App) {
        console.log('Loading module %s ...', this.name);
        var conf = this.settings;

        var game = new Phaser.Game(conf.width, conf.height, Phaser[conf.mode], 'mainState');

        var mainState = {
            preload: App.Media.load,
            create: App.World.create,
            update: App.Renderer.update
        };

        game.state.add('main', mainState);
        game.state.start('main');

        this.get = function() {
            // Encapsulate the game Object
            return game;
        };

        this.restart = function() {
            game.state.start('main');
        }

    });

})(window);

(function(window, undefined) {
    'use strict';

    Root.Media = Root.$createModule('media', {
        paths: {
            bird: 'assets/img/bird.png',
            pipe: 'assets/img/pipe.png'
        },
        sprites: {

        }
    }, function(App) {
        console.log('Loading module %s ...', this.name);
        var conf = this.settings;

        this.load = function() {
            var game = App.Game.get();
            game.stage.backgroundColor = '#71c5cf';
            game.load.image('bird', conf.paths.bird);
            game.load.image('pipe', conf.paths.pipe); 
        }
    });

})(window);

(function(window, undefined) {
    'use strict';

    Root.Renderer = Root.$createModule('renderer', {
        bird: {
            maxAngle: 20
        }
    }, function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;

        this.update = function() {
            var game = Root.Game.get();
            var bird = Root.World.bird;
            var pipes = Root.World.pipes;

            module._restartIfDead(game, Root.World.bird);
            module._killOnOverlap(game, bird, pipes, module, function() {
                game.state.start('main');
            });
        };

        this._restartIfDead = function(game, target) {
            if(target.inWorld === false) {
                Root.Game.restart();
            }
        };

        this._killOnOverlap = function(game, bird, pipes, ctx, restart) {
            game.physics.arcade.overlap(bird, pipes, restart);
        };

        this._angleObject = function(item, maxAngle) {
            if (item.angle < module.settings.bird.maxAngle) {
                item.angle += 1;
            }
        };

    });

})(window);

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
