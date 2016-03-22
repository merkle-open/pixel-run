/**
 * Pixel. Run. Namics. (Build NJGDBXqpx)
 * @author 
 * @version v1.4.0-alpha
 * @license MIT Licensed by Namics AG
 * @see http://namics.com/
 */

(function() {

    var art = [
        '╭━┳╮╱╱╱╱╱╱╭━╮',
        '┃╋┣╋┳┳━┳╮╱┃╋┣┳┳━┳╮',
        '┃╭┫┣┃┫┻┫╰╮┃╮┫┃┃┃┃┃',
        '╰╯╰┻┻┻━┻━╯╰┻┻━┻┻━╯'].join('\n') + '\n';

    if(typeof module !== 'undefined' && module.exports) {
        exports = module.exports = art;
    } else {
        window.$introduction = art;
    }
})();

/**
 * /app/provider/util.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    /**
     * Custom error type for all avaible game failures,
     * can be thrown with the debugger or called manually.
     * @param {String} message      Reason
     */
    function GameError(message) {
        this.name = 'GameError';
        this.message = (message || 'Undefined error');
    }

    GameError.prototype = Error.prototype;
    window.GameError = GameError;

    Util.noop = function() {
        // Basic no-operation method
    };

    /**
     * Private helper to order the score descending
     * @param  {Array} score        Highscore array
     * @return {Array}              Ordered array
     */
    Util.orderScore = function(score) {
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
    };

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

    /**
     * Hyphenates a camelCased string
     * @param  {String} str         Any camel/pascal cased string
     * @return {String}             Hyphenated string
     */
    Util.hyphenate = function(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    };

    /**
     * Creates a new replacer instance
     * @constructor
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
                result = Util.replaceAll(result, '{' + key + '}', data[key]);
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

    /**
     * Used for debugging the application and its states
     * @constructor
     * @param {String} namespace        Debugger namespace
     */
    function Debugger(namespace) {
        this.enabled = window.Container.settings.debug === true;
        this.namespace = namespace || 'undefined';
    }

    Debugger.prototype = {
        /**
         * Apply arguments to the warn function if enabled
         */
        warn: function() {
            if(console && console.warn) {
                this.$out(arguments, function(args) {
                    console.warn.apply(console, args);
                });
            }
        },
        /**
         * Apply arguments to the info function if enabled
         */
        info: function() {
            if(console && console.info) {
                this.$out(arguments, function(args) {
                    console.info.apply(console, args);
                });
            }
        },
        /**
         * Apply arguments to the error function if enabled
         */
        error: function() {
            if(console && console.error) {
                this.$out(arguments, function(args) {
                    console.error.apply(console, args);
                });
            }
        },
        /**
         * Apply arguments to the log function if enabled
         */
        log: function() {
            if(console) {
                this.$out(arguments, function(args) {
                    console.log.apply(console, args);
                });
            }
        },
        /**
         * Throws a new game error with a status and reason
         * @param  {String} reason      Error reason
         * @param  {String} status      Error status
         */
        throw: function(reason, status) {
            throw new GameError(reason + '(' + status + ')');
        },
        /**
         * Output provider (internal method)
         * @param  {[type]} handle [description]
         * @return {[type]}        [description]
         */
        $out: function(values, handle) {
            var args = Array.prototype.slice.call(values);
            args.unshift('[' + this.namespace + ']:');
            handle(args);
        }
    };

    Util.Debugger = Debugger;

    /**
     * Like Object.keys but get the values and not keys
     * @param  {Object} dataObject      Object target
     * @return {Array}                  Object values
     */
    Util.getValues = function(dataObject) {
        var dataArray = [];
        for(var o in dataObject) {
            dataArray.push(dataObject[o]);
        }
        return dataArray;
    };

    /**
     * Get playerscores in compressed object form
     * @return {Obejct}                 Compressed score info
     */
    Util.getPlayerScoreData = function() {
        var summaryList = [], res, psess;
        for(psess in Session) {
            summaryList.push(Session[psess]);
        }
        res = Util.orderScore(summaryList);

        return  {
            p1: res[0] ? res[0].name : '-',
            p2: res[1] ? res[1].name : '-',
            p3: res[2] ? res[2].name : '-',
            p1s: res[0] ? res[0].score : '-',
            p2s: res[1] ? res[1].score : '-',
            p3s: res[2] ? res[2].score : '-',
            p1img: res[0] ? res[0].image() : '',
            p2img: res[1] ? res[1].image() : '',
            p3img: res[2] ? res[2].image() : '',
            wtype: Container.settings.worldType
        };
    };

    /**
     * Replace all orccurencies in a string with a replacement
     * @param  {String} target         Input ressource
     * @param  {*} search               Placeholder
     * @param  {*} replacement          Any value to replace
     * @return {String}                 Compiled
     */
    Util.replaceAll = function(target, search, replacement) {
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    /**
     * Gets the score in a HTML string (tr>td) for inserting
     * it into a table body
     * @return {String}                 HTML markup
     */
    Util.getScoreTable = function(opts, handler) {
        var generated = [];
        $.get('/api/get/scores', function(scores) {
            scores.forEach(function(score) {
                generated.push('<tr><td>');
                if(opts.index) {
                    generated.push('<strong>');
                    generated.push('# ' + score.index);
                    generated.push('</strong></td><td>');
                }
                generated.push(score.score);
                generated.push('</td><td>');
                generated.push(score.name);
                generated.push('</td><td>');
                generated.push(Util.firstToUpper(score.world));
                generated.push('</td><tr>');
            });

            handler(generated.join('\n'));
        });
    };

    Util.calculate = {
        /**
         * Calculates the score from the x-axis value
         * of a player in the game
         * @param  {Number} pixels      Pixel value
         * @return {Number}             Player score
         */
        score: function(pixels) {
            var calc = pixels / 100;
            return Math.round(calc);
        }
    };

    /**
     * Transform first char to upper (capitalize)
     * @param  {String} value       Input value
     * @return {String}             Capitalized string
     */
    Util.firstToUpper = function(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

})(window);

/**
 * /app/states/store.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var Local = window.Store;

    var Store = function() {
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
         * Get the highest score in array form (private method)
         * @return {Array} scores
         */
        $getScore: function() {
            return Util.orderScore(Local.get('score'));
        }
    };

    Container.Store = new Store();

})(window);

/**
 * /app/classes/player.js
 * @namespace Factory
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var KILL_BOUNDS = 20;

    var debug = new Util.Debugger('Player.class');
    var root = window.Container;

    /**
     * Creates a new player instance
     * @constructor
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
        this.jumpOn = root.settings.game.jumpOn;
        this.id = index;
        this.type = variation;
        this.jumpKey = root.settings.game.players.keymap[index];
        this.injector = game;
        this.doubleJump = false;
        this.score = null;

        Phaser.Sprite.call(this, game, posX, posY, this.$getSpritesheet());
        this.$addActionKey();
        game.add.existing(this);
        debug.log('New player initiaded on x/y with type ->', posX, posY, variation);

        return this;
    }

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
            Container.Audio.jump.play();
            this.body.velocity.y = root.settings.game.players.velocity.y;
        }
    };

    /**
     * Let a player die
     */
    Player.prototype.die = function() {
        debug.info('Player died with id ->', this.id);
        var session = Session[$index.session[this.id]];
        debug.info('Updating player session ->', session);

        Container.Audio.die.play();
        this.$updateText('dead');
        session.score = this.score;
        this.dead = true;
        this.kill();
    };

    /**
     * Update the players text with value
     * @return {String}         Value
     */
    Player.prototype.$updateText = function(val) {
        if(val !== undefined) {
            console.log('Updating text');
            var session = Session[$index.session[this.id]];
            session.text.option('extension', '(' + val + ')');
            session.text.$update();
        }
    };

    /**
     * Generates the action key settings and creates the right
     * cursor for each player instance.
     * @return {Key}            Phaser key stack
     */
    Player.prototype.$addActionKey = function() {
        debug.info('Player created actionKey ->', this.jumpKey);
        this.$actionKey = Container.cursors[this.jumpKey];
        return this.$actionKey;
    };

    /**
     * General player update method, containing the jump logic
     * and die stuff
     */
    Player.prototype.$update = function() {
        this.score = Util.calculate.score(this.x);
        if(this.y >= Container.settings.render.height - Container.settings.game.players.height - KILL_BOUNDS) {
            this.die();
        }

        if(this.x <= Container.game.camera.view.x - 70) {
            this.die();
        }
        var listener = this.jumpOn === 'push' ? 'isDown' : 'isUp';
        if(this.$actionKey[listener]) {
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

/**
 * /app/classes/score-text.js
 * @namespace Factory
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var debug = new Util.Debugger('ScoreText.class');
    var Container = window.Container;

    /**
     * Score text base class which generates the
     * text with the Util.Replacer class.
     * @constructor
     * @param {Game} game           Game reference
     * @param {String} player       Name of the player
     * @param {Number} score        Current game score
     */
    function ScoreText(game, player, score) {
        var wtype = Container.settings.worldType;
        this.template = '{name}: {score} {extension}';
        this.injector = game;
        this.player = player;
        this.score = score || 0;
        this.opts = {
            extension: '',
            fontSize: '20px',
            fontFamily: 'Arial',
            fill: Container.settings.worlds[wtype].contrast || '#ffffff'
        };

        return this;
    }

    ScoreText.prototype = {
        /**
         * Returns the compiled text
         * @return {String}         Compiled text
         */
        get: function() {
            return Util.replace(this.template, {
                name: this.player,
                score: this.score,
                extension: this.opts.extension
            });
        },
        /**
         * Set the score with a new value and updates the text.
         * @param  {Number} score   Score value
         */
        set: function(score) {
            this.score = score;
            this.$update();
        },
        /**
         * Increase the score with a value and updates the text.
         * @param  {Number} add     Increasement value
         */
        increase: function(add) {
            this.score = (this.score + add);
            this.$update();
        },
        /**
         * Add a new option to the internal options.
         * @param  {String} key     Key of option
         * @param  {*} value        Option value
         */
        option: function(key, value) {
            this.opts[key] = value;
        },
        /**
         * Add the text to a specific position on x and y. Set
         * the third parameter to `true` to position it relative to
         * the camera bounds.
         * @param  {Number} x                   X axis position
         * @param  {Number} y                   Y axis position
         * @param  {Boolean} fixedToCamera      If text should be fixed to camera
         * @return {Text}
         */
        add: function(x, y, fixedToCamera) {
            x = x || 0;
            y = y || 0;

            // Create basic text node and inject it to the game
            this.$text = this.injector.add.text(x, y, this.get(), {
                font: this.opts.fontSize + ' ' + this.opts.fontFamily,
                fill: this.opts.fill
            });

            // Is the text fixed to the camera?
            this.$text.fixedToCamera = fixedToCamera || false;
            if(fixedToCamera) {
                this.$text.cameraOffset.setTo(x, y);
            }

            debug.info('Text added with props x, y, fixed ->', x, y, fixedToCamera);

            return this;
        },
        /**
         * Updates the internal text. This method is private and should
         * not be called from outside.
         */
        $update: function() {
            this.$text.setText(this.get());
        }
    };

    window.Factory.ScoreText = ScoreText;

})(window);

/**
 * /app/classes/sprite.js
 * @namespace Factory
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var debug = new Util.Debugger('Sprite.class');
    var util = window.Util;
    var id = 0;

    /**
     * Sprite constructor for creating Spritesheets for background
     * images or player sprites.
     * @constructor
     * @param {Game} game           Game injector point
     * @param {String} image        Name of the (loaded) asset
     * @param {String} path         Path to the asset image (optional)
     */
    function Sprite(game, image, path) {
        this.$id = id++;
        this.injector = game;
        this.image = image;
        this.path = path;
        this.setScaleMinMax(1, 1);

        return this;
    }

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

    /**
     * Adds the sprite to a specific x and y position in the game
     * @param  {Number} x           Coordinates on X
     * @param  {Number} y           Coordinates on Y
     * @return {Spritesheet} $internal
     */
    Sprite.prototype.add = function(x, y) {
        debug.info('Sprite mounted ->', this.image, x, y);
        x = util.default(x, 0);
        y = util.default(y, 0);
        this.$internal = this.injector.add.sprite(x, y, this.image);
        return this.$internal;
    };

    window.Factory.Sprite = Sprite;

})(window);

/**
 * /app/classes/tilemap.js
 * @namespace Factory
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var debug = new Util.Debugger('Tilemap.class');

    /**
     * Constructor of the Tilemap Class
     * @constructor
     * @param {Game} game           Game injector point
     * @param {String} name         Name of the tilemap
     */
    function Tilemap(game, name) {
        this.name = name;
        this.injector = game;
        this.map = null;
        this.layers = {};
        return this;
    }

    Tilemap.prototype = Object.create(Phaser.Tilemap.prototype);
    Tilemap.prototype.constructor = Tilemap;

    /**
     * Adds a new tileset image to the tilemap. Needed is
     * the tileset itself and the tile asset.
     * @param  {String} tileset         Name of the tileset
     * @param  {String} asset           Asset of the tileset
     */
    Tilemap.prototype.addImage = function(tileset, asset) {
        debug.info('Tilemap image added with asset ->', tileset, asset);
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
        this.map = game.add.tilemap(this.name);
        return this.map;
    };

    /**
     * Create a new layer defined in the tilemap itself.
     * @param  {String} name        Name of the layer
     * @return {TilemapLayer}       Phaser tilemap layer
     */
    Tilemap.prototype.createLayer = function(name) {
        debug.info('Layer created ->', name);
        var layer = this.map.createLayer(name);
        this.layers[name] = layer;
        return this.layers[name];
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
        debug.info('Collision set on layer with start/end ->', layer, start, end);
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
            debug.warn('World resized to the layer ->', targetLayer);
        } catch(resizeErr) {
            debug.throw('Tilemap.resize failed: ' + resizeErr.message, 0);
        }
    };

    window.Factory.Tilemap = Tilemap;

})(window);

/**
 * /app/states/boot.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    Container.Boot = function() {
        // Empty class wrapper
    };

    Container.Boot.prototype = {
        preload: function() {
            // Load worlds and audio effects
            this.$loadWorldDependencies();
            this.$loadAudioFX();
        },
        /**
         * Start the preloader state
         */
        create: function() {
            var self = this;
            
            Container.$indicate.preload = function() {
                self.state.start('Preload');
            }
        },
        /**
         * Load all dependencies for all worlds saved under settings
         */
        $loadWorldDependencies: function() {
            var self = this;
            var worldKeys = Object.keys(Container.settings.worlds);
            worldKeys.forEach(function(w) {
                self.load.tilemap('tilemap-' + w, '/dist/assets/img/world/' + w + '/tilemap-' + w + '.json', null, Phaser.Tilemap.TILED_JSON);
                self.load.image('background-' + w, '/dist/assets/img/backgrounds/background-' + w + '.png');
                self.load.image('tile-' + w, '/dist/assets/img/world/' + w + '/tiles/tile-' + w + '.png');
                self.load.image('avatar-' + w + '-consultant', '/dist/assets/img/avatars/' + w + '/avatar-' + w + '-consultant.png');
                self.load.image('avatar-' + w + '-techie', '/dist/assets/img/avatars/' + w + '/avatar-' + w + '-techie.png');
                self.load.image('avatar-' + w + '-designer', '/dist/assets/img/avatars/' + w + '/avatar-' + w + '-designer.png');
            });
        },
        /**
         * Load all audio effects and samples
         */
        $loadAudioFX: function() {
            var self = this;
            var fxSounds = Container.settings.audio.fx;
            fxSounds.forEach(function(fxSound) {
                self.load.audio('fx-' + fxSound, '/dist/assets/audio/fx/' + fxSound + '.mp3');
            });
        }
    };

})(window);

/**
 * /app/states/game.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var PLAYER_OFFSET_X = 500;
    var PLAYER_OFFSET_Y = 300;

    var debug = new Util.Debugger('states.game');
    var settings = Container.settings;
    var gameSettings = settings.game;

    Container.Game = function() {
        // Wrapper
    };

    Container.Game.prototype = {
        create: function create() {
            var self = this;

            // Loading all audio effects
            this.$createAudioFX();

            // Adding background image
            this.$createBackground();

            // Instanciate the tilemap
            this.$createTilemap();

            // Create cursor keys for all players
            Container.cursors = this.input.keyboard.createCursorKeys();

            // Create sessions and score texts for the players
            this.$createScoreTexts();

            // Create players set in settings file under /app
            this.$createPlayers(function() {

                // Follow the first player with the camera
                self.camera.follow(self.$furthestPlayer().player);
            });

            // TODO: Fix camera FOV
            this.camera.bounds.height = 2048;
            this.camera.view.height = 2048;

            // Add emergency handlers in window
            this.$applyEmergency();
        },
        update: function update() {
            var self = this;
            var alivePlayers = self.$getAlivePlayers();

            // Follow the first player if the first player dies etc.
            self.camera.follow(self.$furthestPlayer().player);

            if(alivePlayers.length === 0 && !self.finished) {
                // Quit the game if no players are alive
                self.exit();
            } else if(alivePlayers.length === 1) {
                // TODO: If just one player is alive and he/she is blocked
                // by an obstacle by more than 5 seconds, the game should end!
                // Tipp: Player.body.blocked.right && Player.body.blocked.down
            }

            for(var name in Session) {
                var player = Session[name].player();

                // Let the players collide with the tilemap
                Container.game.physics.arcade.collide(player, Container.World.tilemapLayer);

                // Update the score text with the current position
                Session[name].text.set(Util.calculate.score(player.x));

                // Run update and jump detection/loops if the player
                // is alive and not already dead
                if(player.dead !== true) {
                    player.$update();
                    player.run();
                } else {
                    player.$updateText();
                }
            }

            if(settings.debug) {
                // Add FPS settings to the game if in debug mode
                Container.game.debug.text(Container.game.time.fps + ' FPS' || '-- FPS', 2, 14, "#FF00CC");
            }
        },
        /**
         * Finishes the game
         */
        exit: function exit() {
            if(!this.finished) {
                this.finished = true;
                this.$savePlayerScores();
                debug.info('Game is finished! Player scores are saved in Storage');
                Container.game.lockRender = true;
                Container.game.finishedCallback(this);
            } else {
                debug.warn('Game already finished, exit handler skipped.');
            }
        },
        /**
         * Gets all players which are still alive
         * @return {Array}          Alive players
         */
        $getAlivePlayers: function $getAlivePlayers() {
            var alive = [];
            Container.World.players.forEach(function(player) {
                if(player.alive === true) {
                    alive.push(player);
                }
            });
            return alive;
        },
        /**
         * Get the furthest player in game, used for the camera
         * following procedure.
         * @return {Object}         Player and position
         */
        $furthestPlayer: function $furthestPlayer() {
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
        /**
         * Creates all audio FX nodes and inject it to the Audio Container
         */
        $createAudioFX: function() {
            var self = this;
            var fxSounds = settings.audio.fx;

            fxSounds.forEach(function createAudioFXInternal(fxSound) {
                Container.Audio[fxSound] = {
                    node: self.add.audio('fx-' + fxSound),
                    play: function() {
                        Container.Audio[fxSound].node.restart();
                    }
                };
            });
        },
        /**
         * Creates a session for a single player with the needed
         * properties and references to the name, ID, color and the
         * Phaser Player itself.
         * @param  {String} name        Player name
         * @param  {Number} pid         Player ID
         * @return {Object}             Session Player
         */
        $createPlayerSession: function $createPlayerSession(username, realname, pid) {
            var worlds = settings.worlds;
            var wtype = settings.worldType;
            $index.session[pid] = username;

            Session[username] = {
                id: pid,
                name: realname,
                username: username,
                color: worlds[wtype].colors[pid],
                image: function() {
                    return Container.World.players[pid].key + '.png';
                },
                player: function() {
                    return Container.World.players[pid];
                }
            };

            return Session[username];
        },
        /**
         * Creates the score texts for each player. Before that,
         * it will create a session for every player.
         */
        $createScoreTexts: function $createScoreTexts() {
            var self = this;
            var pid = 0;
            var players = settings.currentPlayers;

            players.forEach(function(name) {
                name = name.trim();
                var username = name.replace(' ', '');
                self.$createPlayerSession(username, name, pid);

                var text = new Factory.ScoreText(self, username.toUpperCase(), 0);
                text.option('fontSize', settings.render.fontSize + 'px');
                text.option('fill', Session[username].color);
                text.add(20, (settings.render.fontSize + 5) * (pid + 1), true);

                Session[username].text = text;

                pid++;
            });
        },
        /**
         * Creates the background layer for current world type
         */
        $createBackground: function $createBackground() {
            var background = new Factory.Sprite(this, 'background-' + settings.worldType);
            Container.World.background = background;
            background.setScaleMinMax(1, 1, 1, 1);
            background.add(0, 0);
        },
        /**
         * Creates the tilemap and layers for the current world type
         */
        $createTilemap: function $createTilemap() {
            var self = this;
            var worldType = settings.worldType;

            // Create a new tilemap with the worldType
            var map = new Factory.Tilemap(self, 'tilemap-' + worldType);
            map.addToGame(self);
            map.addImage('tile-' + worldType, 'tile-' + worldType);

            // Create the ground and platform layers named 'world'
            var layer = map.createLayer('world');

            // Add collision detection and resize the game to layer size
            map.setCollision('world', 0, 5000);
            map.resize('world');

            Container.World.tilemapLayer = layer;
        },
        /**
         * Create players defined in the global settings
         * @param  {Function} callback      Callback handler
         * @return {*}                      Callback return value
         */
        $createPlayers: function $createPlayers(callback) {
            var self = this;
            var pheight = settings.game.players.height;
            var pwidth = settings.game.players.width;

            // Create players for the amount defined in settings.players
            for(var i = 0; i < gameSettings.players.amount; i++) {
                var instance = new Factory.Player(self, i, PLAYER_OFFSET_X + ((pwidth + 70) * i), PLAYER_OFFSET_Y + pheight);
                instance.init();
                Container.World.players.push(instance);
            }

            return callback(Container.World.players);
        },
        /**
         * Save the score of all session players in localstorage
         */
        $savePlayerScores: function $savePlayerScores() {
            if(!this.saved) {
                this.saved = true;

                var handlers = {
                    success: function(res) {
                        debug.info('Saved score on server over AJAX ->', res);
                    },
                    error: function(err) {
                        throw new GameError('Failed to save player score: ' + err.message);
                    }
                };

                for(var name in Session) {
                    var user = Session[name];
                    $.ajax({
                        type: 'POST',
                        url: '/api/save/score',
                        data: {
                            name: user.name,
                            score: user.score,
                            world: settings.worldType,
                            username: user.username
                        },
                        success: handlers.success,
                        error: handlers.error
                    });
                }
            }
        },
        $applyEmergency: function $applyEmergency() {
            var res = false;
            var self = this;

            /**
             * Wrapper for the window.confirm method
             * @param  {String} text        Confirm message
             * @param  {Function} handler   Callback on confirmed
             * @return {*}                  Handler return value
             */
            var confirm = function(text, handler) {
                res = window.confirm(text);
                if(res === true) {
                    return handler();
                } else {
                    debug.info('User canceled emergency action');
                }
            };

            /**
             * Exits the game manually, if somethings lags around
             * or is buggy that you have to quit.
             */
            Emergency.$quit = function $$exitGame() {
                confirm('Are you sure to emergency quit the game?', function() {
                    Emergency.$killAll();
                    self.exit();
                });
            };

            /**
             * Kills all players which are in the game
             */
            Emergency.$killAll = function $$killAll() {
                confirm('Are you sure you want to kill every player?', function() {
                    for(var player in Session) {
                        // Let each player die if not dead
                        var instance = Session[player];
                        if(!instance.player().dead) {
                            instance.player().die();
                        }
                    }
                });
            };
        }
    };

})(window);

/**
 * /app/states/preload.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    Container.Preload = function() {
        this.ready = false;
        this.error = null;
        this.background = null;
    };

    Container.Preload.prototype = {
        preload: function() {
            if(Container.settings.debug) {
                Container.game.time.advancedTiming = true;
            }

            //this.scale.setScreenSize = true;
            //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.minHeight = Container.settings.render.height / 2;
            //this.scale.pageAlignHorizontally = true;
            this.physics.arcade.gravity.y = 200;
            this.ready = true;

            try {
                this.physics.startSystem(Phaser.Physics.ARCADE);
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
        quit: function() {
            alert('Goodbye');
            this.ready = false;
        }
    };

})(window);

/**
 * /app/main.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var settings = Container.settings;
    var config = settings.render;

    console.log(window.$introduction);
    console.log('Welcome to the Pixel. Run. game by Namics AG!')

    var pregame = Container.stepper = new HUD.Factory.Stepper($('.pregame.steps'));
    pregame.start(function($lastStep) {

        // Get the current selected world and players
        settings.worldType = HUD.$store.world;
        settings.currentPlayers = Util.getValues(HUD.$store.players);
        settings.game.players.amount = settings.currentPlayers.length;

        // Create a new phaser game
        var game = new Phaser.Game(config.width, config.height, Phaser.CANVAS, config.node);

        // Adding all required phaser-game-states
        game.state.add('Boot', Container.Boot);
        game.state.add('Preload', Container.Preload);
        game.state.add('Game', Container.Game);
        game.state.add('Procedures', Container.Procedures);

        // Show the last info container on end
        game.finishedCallback = function() {
            var content = $('.js-finished').html();
            var playerScores = Util.getPlayerScoreData();

            // Transform playeholders
            $('.js-finished').html(Util.replace(content, playerScores));
            $('#' + config.node).fadeOut(function() {
                $('.js-finished').fadeIn();
            });
        };

        // Make game accessable
        Container.game = game;

        // Fade out the last step and start the game
        game.state.start('Boot'); // starting the boot state
        $lastStep.fadeOut(1800, function() {
            $('.steps').remove(); // Remove the stepper element
            Container.$indicate.preload(); // Loading indicator for preload
        });
    });

})(window);
