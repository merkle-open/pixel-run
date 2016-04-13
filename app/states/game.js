/**
 * /app/states/game.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var PLAYER_OFFSET_X = 500;
    var PLAYER_OFFSET_Y = 300;

    var debug = new Util.Debugger('States.Game');
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

            // Add emergency handlers in window
            this.$applyEmergency();
        },
        update: function update() {
            if(this.skipUpdateLoop) {
                return false;
            }

            var self = this;
            var alivePlayers = self.$getAlivePlayers();

            // Follow the first player if the first player dies etc.
            self.camera.follow(self.$furthestPlayer().player);

            if(alivePlayers.length === 0 && !self.finished) {
                // Quit the game if no players are alive
                return self.exit();
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
        },
        /**
         * Finishes the game
         */
        exit: function exit() {
            this.skipUpdateLoop = true;
            Container.game.lockRender = true;
            // clearStage and clearCache params
            Container.game.state.start('Over', true, true, this);
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
                    debug.log('User canceled emergency action');
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

            // Quit game on Ctrl + Y keypress
            $(document).on('keypress', function(ev) {
                console.log('Keypress', ev);
                if(ev.ctrlKey && (ev.which === 25)) {
                    Emergency.$quit();
                }
            });
        }
    };

})(window);
