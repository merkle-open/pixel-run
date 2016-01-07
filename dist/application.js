(function(window, undefined) {
    'use strict';

    var globalApplication = undefined;
    if(window.App) {
        var windowApplication = window.App;
    }

    // LogNameSpaces
    var LNS = {
        'publish': 'Module.publish',
        'access': 'Module.access',
        'register': 'App.register',
        'start': 'App.start',
        'config': 'App.configure',
        'load': 'App.load',
        'resolve': 'App.resolve'
    };

    for(var action in LNS) {
        LNS[action] = '[' + LNS[action] + ']';
    }

    var App = window.App = {};

    App._config = {
        autostart: false,
        autoregister: false,
        debug: {
            enabled: true,
            history: []
        }
    };

    App._init = function() {
        App.queue = {};
        App.debug = {};
        App.modules = {};
    };

    App._reset = function() {
        App.queue = {};
        App.modules = {};
        App._config.debug.history = [];
    };

    App._init();

    App.giveBack = function() {
        return globalApplication;
    };

    App._logProvider = function() {
        App._config.debug.history.push(arguments);
        return App._config.debug.enabled;
    };

    ['log', 'error', 'warn', 'info'].forEach(function(type) {
        App.debug[type] = function() {
            if(App._logProvider(arguments)) {
                if(!console[type]) {
                    type = 'log';
                }
                window.console[type].apply(console, arguments);
            }
        };
    });

    App.register = function(name, settings, factory) {
        App.debug.log('%s Registering Module "%s" ...', LNS.register, name);
        if(factory === undefined) {
            factory = settings;
            settings = {};
        }

        App.modules[name] = {
            _settings: settings,
            _store: {
                public: {},
                private: {}
            }
        };

        App.modules[name].publish = function(key, value) {
            App.debug.log(
                '%s Publishing %s on %s (%s)',
                LNS.publish, key, name, typeof value
            );

            var target = App.modules[name]._store.public;
            target[key] = value;
            return target;
        };

        App.modules[name].access = function(key) {
            var root = App.modules[name]._store;
            if(!root.public[key] && root.private[key]) {
                App.debug.error('%s No value found for %s in %s', LNS.access, key, name);
            }
            return root.public[key] ? root.public[key] : root.private[key];
        };

        if(settings.dependencies) {
            App.modules[name]._dependencies = settings.dependencies;
        }

        App.queue[name] = {
            name: name,
            dependencies: settings.dependencies || [],
            done: false,
            factory: factory
        };
    };

    App.loadModules = function() {
        var queue = App.queue;
        var modules = App.modules;

        for(var name in queue) {
            var mod = queue[name];
            if(mod.dependencies.length <= 0) {
                try {
                    queue[name].factory(modules[name]);
                    App.debug.log('%s Loaded module "%s"!', LNS.load, name);
                    delete queue[name];
                } catch(notLoaded) {
                    App.debug.error(
                        '%s Couldn\'t load module %s: %s',
                        LNS.load, name, notLoaded.message
                    );
                }
            }
        }
    };

    App.resolveDependency = function(component) {
        App.debug.info('%s Resolving %s -> [%s]', LNS.resolve, component.name, component.dependencies.toString());
        if(!component.dependencies || component.dependencies.length <= 0) {
            if(App.modules[component]) {
                App.debug.log('Module %s already loaded, done!', component);
                return true;
            } else {
                try {
                    App.queue[component].factory(App.modules[component]);
                    delete App.queue[component];
                    App.debug.log('%s Module %s was loaded successfully!', LNS.load, component);
                } catch(failed) {
                    App.debug.error('Loading factory of %s failed: %s', component, failed.message);
                }
            }
        } else {
            component.dependencies.forEach(function(dependency) {
                if(App.modules[dependency]) {
                    App.debug.log('%s Dependency %s already loaded, skipping ...', LNS.load, dependency);
                } else {
                    App.resolveDependency(dependency);
                }
            });

            try {
                App.queue[component.name].factory(App.modules[component.name]);
                delete App.queue[component.name];
                App.debug.log('%s Module %s was loaded successfully!', LNS.load, component.name);
            } catch(failed) {
                App.debug.error('Loading factory of %s failed: %s', component.name, failed.message);
            }
        }
    };

    App.unregister = function(name) {
        App.debug.log('Unregistering "%s"...', name);
        try {
            delete App.queue[name];
            delete App.modules[name];
            App.debug.log('Module %s unregistered!', name);
        } catch(failed) {
            App.debug.error('Failed to unregister %s: %s', name, failed.message);
        }
    };

    App.start = function(callback) {
        App.debug.info('Application is starting ...');
        App.loadModules();
        for(var name in App.queue) {
            App.resolveDependency(App.queue[name]);
        }
        callback();
    };

    App.stop = function(reason) {
        App.debug.info('Application is shutting down %s...', (reason ? reason + ' ' : ' '));
        App._reset();
        App.debug.log('Goodbye!');
    };

    window.App = App;

})(window);

(function(window, undefined) {
    'use strict';

    App.register('Game', {
        dependencies: ['Media', 'World', 'Render']
    }, function(module, settings) {
        module.publish('start', function() {
            var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
               preload: App.modules.Media.access('init'),
               create: App.modules.World.access('init'),
               update: App.modules.Render.access('init')
           });

           module.publish('game', game);
       });
    });

})(window);

(function(window, undefined) {
    'use strict';

    App.register('Media', {
        dependencies: []
    }, function(module) {
        module.publish('init', function() {
            var game = App.modules.Game.access('game');
            game.load.image('sky', 'assets/img/sky.png');
            game.load.image('ground', 'assets/img/platform.png');
            game.load.image('star', 'assets/img/star.png');
            game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
        });
    });

})(window);

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
