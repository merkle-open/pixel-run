(function(window, undefined) {
    'use strict';

    var globalApplication = undefined;
    if(window.App) {
        var windowApplication = window.App;
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
        App.debug.log('Registering Module "%s" ...', name);
        if(factory === undefined) {
            factory = settings;
            settings = {};
        }

        App.modules[name] = {
            settings: settings
        };

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
                    App.debug.log('Loaded module "%s"!', name);
                    delete queue[name];
                } catch(notLoaded) {
                    App.debug.error('Couldn\'t load module %s: %s', name, notLoaded.message);
                }
            }
        }
    };

    App.resolveDependency = function(component) {
        App.debug.info('Resolving %s -> [%s]', component.name, component.dependencies.toString());
        if(!component.dependencies || component.dependencies.length <= 0) {
            if(App.modules[component]) {
                App.debug.log('Module %s already loaded, done!', component);
                return true;
            } else {
                try {
                    App.queue[component].factory(App.modules[component]);
                    delete App.queue[component];
                    App.debug.log('Module %s was loaded successfully!', component);
                } catch(failed) {
                    App.debug.error('Loading factory of %s failed: %s', component, failed.message);
                }
            }
        } else {
            component.dependencies.forEach(function(dependency) {
                if(App.modules[dependency]) {
                    App.debug.log('Dependency %s already loaded, skipping ...', dependency);
                } else {
                    App.resolveDependency(dependency);
                }
            });

            try {
                App.queue[component.name].factory(App.modules[component.name]);
                delete App.queue[component.name];
                App.debug.log('Module %s was loaded successfully!', component.name);
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

    App.start = function() {
        App.debug.info('Application is starting ...');
        App.loadModules();
        for(var name in App.queue) {
            App.resolveDependency(App.queue[name]);
        }
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
    }, function(container, settings) {
        container.game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
            preload: App.modules.Media.init,
            create: App.modules.World.init,
            update: App.modules.Render.init
        });
    });

})(window);

(function(window, undefined) {
    'use strict';

    App.register('Media', {
        dependencies: []
    }, function(container, settings) {
        container.init = function() {
            var game = App.modules.Game.game;
            game.load.image('sky', 'assets/img/sky.png');
            game.load.image('ground', 'assets/img/platform.png');
            game.load.image('star', 'assets/img/star.png');
            game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
        }
    });

})(window);

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

(function(window, undefined) {
    'use strict';

    App.register('World', {
        dependencies: []
    }, function(container, settings) {
        container.init = function() {
            var platforms = container.platforms;
            var player = container.player;
            var game = App.modules.Game.game;

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
            container.ground = ground;
            container.ledge = ledge;
            container.platforms = platforms;

            // Adding the player
            container.addPlayer();
        }

        container.addPlayer = function() {
            var game = App.modules.Game.game;
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

            // Publish player to module scope
            container.player = player;
        }
    });

})(window);
