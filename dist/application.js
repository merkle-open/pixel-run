(function(window, undefined) {
    'use strict';

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

    Replacer.create = function(input, data) {
        return new Replacer(input, data);
    };

    Util.Replacer = Replacer;
    Util.replace = function(input, data) {
        return new Replacer(input).replace(data);
    };

})(window);

(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var config = Container.settings.physics;

    Container.Boot = function(game) {
        // Empty class wrapper
    };

    Container.Boot.prototype = {
        preload: function() {
            this.load.image('sky', 'assets/img/sky.png');
            this.load.image('ground', 'assets/img/platform.png');
            this.load.image('star', 'assets/img/star.png');
            this.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);

        },
        create: function() {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            if (!this.game.device.desktop) {
                this.scale.minWidth = 150;
                this.scale.minHeight = 250;
                this.scale.maxWidth = 600;
                this.scale.maxHeight = 1000;
                this.scale.forceLandscape = false;
            }
            this.state.start('Preload');
        },
        loadAssets: function() {

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
        create: function() {
            this.add.sprite(0, 0, 'sky');

            var platforms = this.add.group();
            platforms.enableBody = true;

            var ground = platforms.create(0, this.world.height - 64, 'ground');
            ground.scale.setTo(2, 2);
            ground.body.immovable = true;

            var ledge = platforms.create(400, 400, 'ground');
            ledge.body.immovable = true;
            ledge = platforms.create(-150, 250, 'ground');
            ledge.body.immovable = true;

            Container.platforms = platforms;
            Container.ground = ground;
            Container.ledge = ledge;
            Container.cursors = this.input.keyboard.createCursorKeys();
            Container.players = [];

            this._createControls();
        },
        update: function() {
            this.physics.arcade.collide(Container.players, Container.platforms);
        },
        _createControls: function() {
            var avaible = ['up', 'down', 'left', 'right'];
            for(var i = 0; i < config.players.amount; i++) {
                var player = this._createPlayer(i, avaible[i]);
                if(Container.cursors[avaible[i]].isDown) {
                    Container.players[i].body.velocity.y = -350;
                }
            }
        },
        _createPlayer: function(index, control) {
            var player = this._buildPlayerInstance(config.players.variations[index], index);
            Container.players.push(player);
            return player;
        },
        _buildPlayerInstance: function(sprite, index) {
            var offset = (index === 0 ? 0.5 : index + 1) * (config.placementOffset * 2);
            var player = this.add.sprite(offset, this.world.height - 150, 'dude');
            this.physics.arcade.enable(player);
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 300;
            player.body.collideWorldBounds = true;
            return player;
        }
    };

})(window);

(function(window, undefined) {
    'use strict';

    var game = Container.game;

    Container.Preload = function(game) {
        this.ready = false;
        this.background = null;
    };

    Container.Preload.prototype = {
        preload: function() {
            this.physics.startSystem(Phaser.Physics.ARCADE);
        },
        create: function() {
            this.state.start('Game');
        },
        quit: function(pointer) {
            alert('Goodbye');
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
        getScore: function() {
            return this._orderScore(Local.get('score'));
        },
        getHighscore: function(objfy) {
            var result = this.getScore()[0];
            return objfy ? result : result.score;
        },
        _orderScore: function(score) {
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
        resetScore: function() {
            Local.set('score', []);
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

    var game = new Phaser.Game(config.width, config.height, config.mode, config.node);

    //adding all the required states
    game.state.add('Boot', Container.Boot);
    game.state.add('Preload', Container.Preload);
    game.state.add('Game', Container.Game);
    game.state.start('Boot'); //starting the boot state

    Container.game = game;

})(window);
