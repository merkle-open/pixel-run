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
     */
    Player.prototype.$update = function() {
        if(this.y === 0) {
            alert('die?');
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

            // Adding background image
            this.$createBackground();

            // Instanciate the tilemap
            this.$createTilemap();

            // Create players set in settings file under /app
            this.$createPlayers(function() {
                // Follow the first player with the camera
                self.camera.follow(Container.World.players[Container.World.players.length - 1]);
            });
        },
        update: function() {
            var self = this;
            Container.World.players.forEach(function(player) {
                Container.game.physics.arcade.collide(player, Container.World.tilemapLayer);
                player.$update();
                player.run();
            });
        },
        $createBackground: function() {
            //var background = new Factory.Sprite(this, 'background-space');
            //background.add(0, 0);
        },
        $createTilemap: function() {
            var self = this;

            var map = new Factory.Tilemap(self, 'tilemap-space');
            map.addToGame(self);
            map.addImage('tile-space', 'tile-space');
            var layer = map.createLayer('world');
            map.setCollision('world', 0, 1000);
            map.resize('world');
            Container.World.tilemapLayer = layer;


            /*
            Container.procedures.addTilemap.run({
                game: self,
                tilemap: 'tilemap-space',
                layer: {
                    name: 'world',
                    start: 0,
                    end: 10000
                },
                tile: {
                    name: 'tile-space',
                    asset: 'tile-space'
                }
            }, function(result) {
                Container.World.tilemap = result.tilemap.map;
                Container.World.tilemapLayer = result.layer;
            }); */
        },
        $createPlayers: function(callback) {
            var self = this;
            var offset = config.players.offset;
            for(var i = 0; i < config.players.amount; i++) {
                var instance = new Factory.Player(self, i, offset.x * i, offset.y);
                instance.init();
                Container.World.players.push(instance);
            }
            callback();
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
                this.state.start('Procedures');
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

    var Contianer = window.Container;

    Container.Procedures = function(game) {
        // Empty class wrapper
    };

    Container.Procedures.prototype = {
        preload: function() {
            Container.procedures = {};
        },
        create: function() {
            /**
             * Adding a tilemap to the game procedure
             * @procedure addTilemap
             */
            new Factory.Procedure('addTilemap', function(data) {
                var map = new Factory.Tilemap(data.game, data.tilemap);
                map.addToGame(data.game);
                map.addImage(data.tile.name, data.tile.asset);
                var layer = map.createLayer(data.layer.name);
                map.setCollision(data.layer.name, data.layer.start, data.layer.end);
                map.resize(data.layer.name);

                return {
                    tilemap: map,
                    layer: layer
                };
            });

            this.state.start('Game');
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
        score: function(name, value) {
            if(!Local.has('score') || !Array.isArray(Local.get('score'))) {
                this.resetScore();
            }
            var old = Local.get('score');
            old.push({
                holder: name,
                score: value
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

    var config = Container.settings.render;

    var fade = function(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 50);
    };

    document.getElementById('js-start-game').addEventListener('click', function() {
        fade(document.getElementById('js-hide-start'));
        Container.settings.worldType = document.getElementById('js-world').value;


        var game = new Phaser.Game(config.width, config.height, config.mode, config.node);

        //adding all the required states
        game.state.add('Boot', Container.Boot);
        game.state.add('Preload', Container.Preload);
        game.state.add('Game', Container.Game);
        game.state.add('Procedures', Container.Procedures);
        game.state.start('Boot'); //starting the boot state

        Container.game = game;
    });

})(window);
