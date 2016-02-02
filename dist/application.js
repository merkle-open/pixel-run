(function(window, undefined) {
    'use strict';

    /**
     * Generates a clone of an object (without proto values)
     * @param  {Object} obj         Object to clone
     * @return {Object}             Cloned object
     */
    Util.clone = function(obj) {
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
    };

})(window);

(function(window, undefined) {
    'use strict';
    
    Util.noop = function() {
        // Basic no-operation method
    };

    /**
     * Set the defaults for a variable. Custom handler can
     * also be used to check the value (to prevent long conditions)
     * @param  {T} input                Input value
     * @param  {T} defaultValue         Default value
     * @param  {Function} custom        Custom validator
     * @return {T}                      Right value
     */
    Util.default = function(input, defaultValue, custom) {
        if(typeof custom === 'function') {
            if(custom(input) === true) {
                return input;
            } else {
                return defaultValue;
            }
        } else if(!input || input === undefined || input === null) {
            return defaultValue;
        } else {
            return input;
        }
    }
})(window);

(function(window, undefined) {
    'use strict';

    /**
     * Hyphenates a camelCased string
     * @param  {String} str         Any camel/pascal cased string
     * @return {String}             Hyphenated string
     */
    Util.hyphenate = function(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    };

})(window);

(function(window, undefined) {
    'use strict';

    /**
     * Creates a new replacer instance
     * @param {String} input        Template string
     * @param {Object} data         Dataset
     */
    function Replacer(input, data) {
        this.input = input;
        this.data = data;
        return this;
    }

    Replacer.prototype = {
        /**
         * Main replace method, replaces each key set with {<value>} with
         * the key associated in the data. Data can be passed in this method
         * or directly in the constructor of the replacer.
         * @param  {Object} data    Optional data
         * @return {String}         Compiled string
         */
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

    /**
     * Shorthand for creation and calling the replace method,
     * easiest usage for the replace logic.
     * @param  {String} input       Template string
     * @param  {Object} data        Dataset
     * @return {String}             Compiled string
     */
    Util.replace = function(input, data) {
        return new Replacer(input).replace(data);
    };

    Util.Replacer = Replacer;

})(window);

(function(window, undefined) {
    'use strict';

    var root = window.Container;

    /**
     * Creates a new player instance
     * @param {Game} game           Reference to the game
     * @param {Number} index        Index of the player (count)
     * @param {Number} posX         Position on x-axis
     * @param {Number} posY         Position on y-axis
     * @param {String} variation    Special variation of player skin
     */
    function Player(game, index, posX, posY, variation) {
        this.$baseSprite = root.settings.game.players.baseName;
        this.$basePath = root.settings.game.players.basePath + root.settings.worldType + '/';
        this.$mimeType = root.settings.game.players.mimeType;
        this.id = index;
        this.type = variation;
        this.jumpKey = root.settings.game.players.keymap[index];
        this.injector = game;
        this.doubleJump = false;

        Phaser.Sprite.call(this, game, posX, posY, this.$getSpritesheet());
        game.add.existing(this);

        return this;
    };

    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    /**
     * Initializes a player with the right physic settings
     */
    Player.prototype.init = function() {
        this.injector.physics.arcade.enable(this);
        this.body.bounce.y = root.settings.game.players.bounce.y;
        this.body.gravity.y = root.settings.game.players.gravity.y;
        this.body.collideWorldBounds = true;
        this.body.linearDamping = 1;
    };

    /**
     * Set collision bounds for the player with a target
     * @param  {*} target               Target to collide with
     * @param  {Function} die           Die handler
     */
    Player.prototype.collide = function(target, die) {
        this.injector.game.arcade.collide(this, target, die, null);
    };

    /**
     * Constantly run with the velocity set in the game settings of the players
     */
    Player.prototype.run = function() {
        this.body.velocity.x = root.settings.game.players.velocity.x;
    };

    /**
     * Let the player jump
     */
    Player.prototype.jump = function() {
        if(this.body.onFloor()) {
            this.body.velocity.y = root.settings.game.players.velocity.y;
        }
        /* DOUBLE JUMP LOGIC
        if(this.body.touching.down && !this.doubleJump) {
            this.body.velocity.y = -350;
            this.doubleJump = true;
        } else if(!this.body.touching.down && this.doubleJump) {
            this.body.velocity.y = -550;
            this.doubleJump = false;
        } */
    };

    /**
     * Let a player die
     */
    Player.prototype.die = function() {
        this.kill();
    };

    /**
     * Generates the action key settings and creates the right
     * cursor for each player instance.
     * @return {Key}            Phaser key stack
     */
    Player.prototype.$addActionKey = function() {
        var cursors = this.injector.input.keyboard.createCursorKeys();
        return this.$actionKey = cursors[this.jumpKey];
    };

    /**
     * General player update method, containing the jump logic
     * and die stuff
     */
    Player.prototype.$update = function() {
        if(this.y === Container.settings.render.height - 20) {
            this.die();
        }

        if(this.x <= Container.game.camera.view.x - 70) {
            this.die();
        }

        var listenTo = this.$addActionKey();
        if(listenTo.isDown) {
            this.jump();
        }
    };

    /**
     * Generates the path to the right spritesheet of each
     * player and its variation
     * @return {String}         Path to the asset
     */
    Player.prototype.$getSpritesheet = function() {
        this.type = this.type === undefined ? '-' + root.settings.game.players.variations[this.id] : '';
        return this.$baseSprite + root.settings.worldType + this.type;
    };

    window.Factory.Player = Player;

})(window);

(function(window, undefined) {
    'use strict';

    var id = 0;

    /**
     * Constructor for a new procedure
     * @param {String} name             Name of the procedure
     * @param {Object} opts             Optional options
     * @param {Function} procedure      Main procedure method
     */
    function Procedure(name, opts, procedure) {
        if(typeof opts === 'function') {
            this.options = {};
            this.procedure = opts;
        } else {
            this.options = opts;
            this.procedure = procedure;
        }
        this.$id = 0;
        this.name = name;

        return Container.procedures[this.name] = this;
    };

    Procedure.prototype = {
        /**
         * Returns the main procedure
         * @return {Function}       Procedure
         */
        getFunction: function() {
            return this.procedure;
        },
        /**
         * Get the name of the procedure
         * @return {String}         Name
         */
        getName: function() {
            return this.name;
        },
        /**
         * Run the procedure with arguments and callback
         * @param  {*} input                Data to pass
         * @param  {Function} finished      Callback handler
         */
        run: function(input, finished) {
            finished = Util.default(finished, Util.noop);
            try {
                var result = this.procedure(input);
                finished(result);
            } catch(failed) {
                finished(failed);
            }
        }
    };

    window.Factory.Procedure = Procedure;

})(window);

(function(window, undefined) {
    'use strict';

    var root = window.Container;
    var util = window.Util;
    var id = 0;

    /**
     * Sprite constructor for creating Spritesheets for background
     * images or player sprites.
     * @namespace Factory
     * @param {Game} game           Game injector point
     * @param {String} image        Name of the (loaded) asset
     * @param {String} path         Path to the asset image (optional)
     */
    function Sprite(game, image, path) {
        this.$id = id++;
        this.injector = game;
        this.image = image;
        this.path = path;

        return this;
    };

    Sprite.prototype = Object.create(Phaser.Sprite.prototype);
    Sprite.prototype.constructor = Sprite;

    /**
     * If the asset hasn't been loaded in the boot state you
     * can load the image with this method.
     * @param  {String} path        Optional path (if not set in ctor)
     * @return {Sprite} this        Return the object itself for chaning
     */
    Sprite.prototype.load = function(path) {
        path = util.default(path, this.path);
        this.injector.load.image(this.image, path);
        return this;
    };

    Sprite.prototype.add = function(x, y) {
        x = util.default(x, 0);
        y = util.default(y, 0);
        this.injector.add.sprite(x, y, this.image);
        return this;
    };

    window.Factory.Sprite = Sprite;

})(window);

(function(window, undefined) {
    'use strict';

    var Container = window.Container;

    function Text(game, player, score) {
        this.template = '{name}: {score}';
        this.injector = game;
        this.player = player;
        this.score = score || 0;
        this.opts = {
            fontSize: '100px'
        };

        return this;
    }

    Text.prototype = {
        get: function() {
            return Util.replace(this.template, {
                name: this.player,
                score: this.score
            });
        },
        set: function(score) {
            this.score = score;
        },
        increase: function(add) {
            this.score = (this.score + add);
        },
        option: function(key, value) {
            this.opts[key] = value;
        },
        add: function(x, y) {
            var wtype = Container.settings.worldType;

            x = x || 0;
            y = y || 0;

            this.$text = this.injector.add.text(x, y, this.get(), {
                font: this.opts.fontSize + ' Roboto',
                fill: Container.settings.worlds[wtype].contrast || '#ffffff'
            });

            this.$text.fixedToCamera = true;
            //this.$text.anchor.set();
        },
        $update: function(score) {
            this.$text.setText(this.get());
        }
    };

    window.Factory.Text = Text;

})(window);

(function(window, undefined) {
    'use strict';

    var root = window.Container;

    /**
     * Constructor of the Tilemap Class
     * @param {Game} game           Game injector point
     * @param {String} name         Name of the tilemap
     */
    function Tilemap(game, name) {
        this.name = name;
        this.injector = game;
        this.map = null;
        this.layers = {};
        return this;
    };

    Tilemap.prototype = Object.create(Phaser.Tilemap.prototype);
    Tilemap.prototype.constructor = Tilemap;

    /**
     * Adds a new tileset image to the tilemap. Needed is
     * the tileset itself and the tile asset.
     * @param  {String} tileset         Name of the tileset
     * @param  {String} asset           Asset of the tileset
     */
    Tilemap.prototype.addImage = function(tileset, asset) {
        return this.map.addTilesetImage(tileset, asset);
    };

    /**
     * Add the tilemap to the game, the constructor game
     * can be used, alternatively you can pass a new game param
     * to this method.
     * @param  {Game} game          Phaser game
     * @return {Tilemap}            The tilemap itself
     */
    Tilemap.prototype.addToGame = function(game) {
        game = game || this.game || null;
        return this.map = game.add.tilemap(this.name);
    };

    /**
     * Create a new layer defined in the tilemap itself.
     * @param  {String} name        Name of the layer
     * @return {TilemapLayer}       Phaser tilemap layer
     */
    Tilemap.prototype.createLayer = function(name) {
        var layer = this.map.createLayer(name);
        return this.layers[name] = layer;
    };

    /**
     * Set collision bounds between start and endpoint on
     * a specific layer. Needed for the players to collide
     * with the tilemap itself!
     * @param  {String} layer       Name of the layer
     * @param  {Number} start       Startpoint of collision
     * @param  {Number} end         Endpoint of collision
     */
    Tilemap.prototype.setCollision = function(layer, start, end) {
        try {
            var collide = this.map.setCollisionBetween(start, end, true, layer);
            return collide;
        } catch(noCollide) {
            throw new Error('Tilemap.setCollision faield: ' + noCollide.message);
        }
    };

    /**
     * Resize the world with the size of the target layer.
     * @param  {String} targetLayer     Layer to get size from
     */
    Tilemap.prototype.resize = function(targetLayer) {
        try {
            this.layers[targetLayer].resizeWorld();
        } catch(resizeErr) {
            throw new Error('Tilemap.resize failed: ' + resizeErr.message);
        }
    };

    window.Factory.Tilemap = Tilemap;

})(window);

(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var config = Container.settings.physics;
    var paths = Container.settings.paths;

    var loader = {
        images: {
            spaceBackground: 'assets/img/backgrounds/background-space.png',
            spaceTile: 'assets/img/world/space/tiles/tile-space.png',
            spaceConsultant: 'assets/img/avatars/space/avatar-space-consultant.png',
            spaceTechie: 'assets/img/avatars/space/avatar-space-techie.png',
            spaceDesigner: 'assets/img/avatars/space/avatar-space-designer.png'
        },
        tilemaps: {
            spaceTilemap: 'assets/img/world/space/tilemap-space.json'
        }
    };

    Container.Boot = function(game) {
        // Empty class wrapper
    };

    Container.Boot.prototype = {
        preload: function() {
            var self = this;

            this.load.tilemap('tilemap-space', 'assets/img/world/space/tilemap-space.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('background-space', 'assets/img/backgrounds/background-space.png');
            this.load.image('tile-space', 'assets/img/world/space/tiles/tile-space.png');
            this.load.image('avatar-space-consultant', 'assets/img/avatars/space/avatar-space-consultant.png');
            this.load.image('avatar-space-techie', 'assets/img/avatars/space/avatar-space-techie.png');
            this.load.image('avatar-space-designer', 'assets/img/avatars/space/avatar-space-designer.png');

        },
        create: function() {
            /*
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            if (!this.game.device.desktop) {
                // Adding mobile support (phaser example)
                this.scale.minWidth = 250;
                this.scale.minHeight = 250;
                this.scale.maxWidth = 600;
                this.scale.maxHeight = 1000;
                this.scale.forceLandscape = false;
            }*/
            this.state.start('Preload');
        }
    };

})(window);

(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var config = Container.settings.game;

    Container.Game = function(game) {
        // Wrapper
    };

    Container.Game.prototype = {
        preload: function() {
            Container.World = {};
            Container.World.players = [];
        },
        create: function() {
            var self = this;

            // Create sessions and score texts for the players
            this.$createScoreTexts();

            // Adding background image
            this.$createBackground();

            // Instanciate the tilemap
            this.$createTilemap();

            // Create players set in settings file under /app
            this.$createPlayers(function() {

                // Follow the first player with the camera
                self.camera.follow(self.$furthestPlayer().player);
            });
        },
        update: function() {
            var self = this;

            // Follow the first player if the first player dies etc.
            self.camera.follow(self.$furthestPlayer().player);

            // Quit the game if no players are alive
            if(self.$allPlayersAlive().allAlive === false) {
                self.exit();
            }

            Container.World.players.forEach(function(player) {
                // Let the players collide with the tilemap
                Container.game.physics.arcade.collide(player, Container.World.tilemapLayer);

                // Run update and jump detection/loops
                player.$update();
                player.run();
            });
        },
        /**
         * Finishes the game
         */
        exit: function() {
            this.finished = true;
            this.message = 'All player died!';
        },
        /**
         * Checks if all players are alive and how many are alive.
         * @return {Object}         Alive and allAlive
         */
        $allPlayersAlive: function() {
            var allAlive = true;
            var notAlive = 0;

            Container.World.players.forEach(function(player) {
                if(player.alive === false) {
                    allAlive = false;
                    notAlive++
                }
            });

            return {
                alive: (Container.World.players.length - notAlive),
                allAlive: !!(Container.World.players.length > notAlive)
            };
        },
        /**
         * Get the furthest player in game, used for the camera
         * following procedure.
         * @return {Object}         Player and position
         */
        $furthestPlayer: function() {
            var firstPlayer = Container.World.players[0];
            var posFirst = Container.World.players[0].x;

            Container.World.players.forEach(function(player) {
                if(player.x > posFirst) {
                    posFirst = player.x;
                    firstPlayer = player;
                }
            });

            return {
                player: firstPlayer,
                position: posFirst
            };
        },
        $createPlayerSession: function(name, pid) {
            Session[name] = {
                id: pid,
                name: name
            };
        },
        $createScoreTexts: function() {
            var self = this;
            var pid = 0;
            var players = Container.settings.currentPlayers;

            players.forEach(function(name) {
                name = name.trim().replace(' ', '');
                self.$createPlayerSession(name, pid);

                var text = new Factory.Text(self, name, 0);
                //text.$text.fixedToCamera = true;
                text.add(150, 250 * (pid + 1));

                Session[name].text = text;

                pid++;
            });
        },
        /**
         * Creates the background layer for current world type
         */
        $createBackground: function() {
            var background = new Factory.Sprite(this, 'background-' + Container.settings.worldType);
            background.add(0, 0);
        },
        /**
         * Creates the tilemap and layers for the current world type
         */
        $createTilemap: function() {
            var self = this;
            var worldType = Container.settings.worldType;

            // Create a new tilemap with the worldType
            var map = new Factory.Tilemap(self, 'tilemap-' + worldType);
            map.addToGame(self);
            map.addImage('tile-' + worldType, 'tile-' + worldType);

            // Create the ground and platform layers named 'world'
            var layer = map.createLayer('world');

            // Add collision detection and resize the game to layer size
            map.setCollision('world', 0, 1000);
            map.resize('world');

            Container.World.tilemapLayer = layer;
        },
        /**
         * Create players defined in the global settings
         * @param  {Function} callback      Callback handler
         * @return {*}                      Callback return value
         */
        $createPlayers: function(callback) {
            var self = this;
            var offset = config.players.offset;

            // Create players for the amount defined in settings.players
            for(var i = 0; i < config.players.amount; i++) {
                var instance = new Factory.Player(self, i, offset.x * i, offset.y);
                instance.init();
                Container.World.players.push(instance);
            }

            return callback(Container.World.players);
        }
    };

})(window);

(function(window, undefined) {
    'use strict';

    var game = Container.game;

    Container.Preload = function(game) {
        this.ready = false;
        this.error = null;
        this.background = null;
    };

    Container.Preload.prototype = {
        preload: function() {
            try {
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.ready = true;
            } catch(notReady) {
                this.error = notReady;
            }
        },
        create: function() {
            if(this.ready) {
                this.state.start('Game');
            } else {
                throw this.error;
            }
        },
        quit: function(pointer) {
            alert('Goodbye');
            this.ready = false;
        }
    };

})(window);

(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var Local = window.Store;

    var Store = function(game) {
        // Class wrapper
    };

    Store.prototype = {
        /**
         * Sets a new score for a new holder
         * @param  {String} name        Name of score holder
         * @param  {Number} value       Score value
         */
        score: function(name, value, map) {
            if(!Local.has('score') || !Array.isArray(Local.get('score'))) {
                this.resetScore();
            }
            var old = Local.get('score');
            old.push({
                holder: name,
                score: value,
                map: map
            });
            Local.set('score', old);
        },
        /**
         * Get the highscore as a number. Set objfy to true,
         * to get the holder and score in object value.
         * @param  {Boolean} objfy      If should objectify the highscore
         * @return {Number|Object}      Highscore
         */
        getHighscore: function(objfy) {
            var result = this.$getScore()[0];
            return objfy ? result : result.score;
        },
        /**
         * Reset the local store and empty all previous values
         */
        resetScore: function() {
            Local.set('score', []);
        },
        /**
         * Private helper to order the score descending
         * @param  {Array} score        Highscore array
         * @return {Array}              Ordered array
         */
        $orderScore: function(score) {
            function compare(a, b) {
                if(a.score > b.score) {
                    return -1;
                } else if (a.score < b.score) {
                    return 1;
                } else {
                    return 0;
                }
            }
            return score.sort(compare);
        },
        /**
         * Get the highest score in array form (private method)
         * @return {Array} scores
         */
        $getScore: function() {
            return this.$orderScore(Local.get('score'));
        }
    };

    Container.Store = new Store();

})(window);

(function(window, undefined) {
    'use strict';

    Container.Update = function() {

    };

})(window);

(function(window, undefined) {
    'use strict';

    var $ = window.$;
    var config = Container.settings.render;

    document.getElementById('js-start-game').addEventListener('click', function() {

        // Hide the overlay resp. fade it out
        $.fade(document.getElementById('js-hide-start'));

        // Get the current selected world and players
        Container.settings.worldType = document.getElementById('js-world').value;
        Container.settings.currentPlayers = document.getElementById('js-player-list').value.split(',');
        Container.settings.game.players.amount = Container.settings.currentPlayers.length;

        // Create a new phaser game
        var game = new Phaser.Game(config.width, config.height, config.mode, config.node);

        //adding all the required states
        game.state.add('Boot', Container.Boot);
        game.state.add('Preload', Container.Preload);
        game.state.add('Game', Container.Game);
        game.state.add('Procedures', Container.Procedures);
        game.state.start('Boot'); //starting the boot state

        // Make game accessable
        Container.game = game;
    });

})(window);
