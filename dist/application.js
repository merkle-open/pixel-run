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

        var game = new Phaser.Game(conf.width, conf.height, Phaser[conf.mode], '', {
            preload: App.Media.load,
            create: App.World.create,
            update: App.Renderer.update
        });

        this.get = function() {
            // Encapsulate the game Object
            return game;
        }

    });

})(window);

(function(window, undefined) {
    'use strict';

    Root.Media = Root.$createModule('media', {
        paths: {
            sky: 'assets/img/sky.png',
            platform: 'assets/img/platform.png',
            coin: 'assets/img/star.png',
            avatar: 'assets/img/dude.png'
        },
        sprites: {
            avatar: {
                posX: 32,
                posY: 48
            }
        }
    }, function(App) {
        console.log('Loading module %s ...', this.name);
        var conf = this.settings;

        this.load = function() {
            var game = App.Game.get();
            game.load.image('sky', conf.paths.sky);
            game.load.image('platform', conf.paths.platform);
            game.load.image('coin', conf.paths.coin);
            game.load.spritesheet('avatar', conf.paths.avatar, conf.sprites.avatar.posX, conf.sprites.avatar.posY);
        }
    });

})(window);

(function(window, undefined) {
    'use strict';

    Root.Renderer = Root.$createModule('renderer', function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;

        this._makePlayerMovable = function(game, player) {
            var cursors = game.input.keyboard.createCursorKeys();

            //  Reset the players velocity (movement)
            player.body.velocity.x = 0;

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
            if (cursors.up.isDown && player.body.touching.down) {
                player.body.velocity.y = -350;
            }

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
