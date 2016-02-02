(function(window, undefined) {
    'use strict';

    var config = Container.settings.game;
    var ttlDie = 0;
    var ttlLastPos = null;

    Container.Game = function(game) {
        // Wrapper
    };

    Container.Game.prototype = {
        create: function() {
            var self = this;

            // Loading all audio effects
            this.$createAudioFX();

            // Adding background image
            this.$createBackground();

            // Instanciate the tilemap
            this.$createTilemap();

            // Create players set in settings file under /app
            this.$createPlayers(function() {

                // Follow the first player with the camera
                self.camera.follow(self.$furthestPlayer().player);
            });

            // Create sessions and score texts for the players
            this.$createScoreTexts();
        },
        update: function() {
            var self = this;
            var alivePlayers = self.$getAlivePlayers();

            // Follow the first player if the first player dies etc.
            self.camera.follow(self.$furthestPlayer().player);

            if(alivePlayers.length === 0) {
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

                // Run update and jump detection/loops
                player.$update();
                player.run();
            }
        },
        /**
         * Finishes the game
         */
        exit: function() {
            var self = this;
            this.finished = true;
            $.fadeOut(document.getElementById(Container.settings.render.node), function() {
                Container.game.lockRender = true;
                self.$savePlayerScores();
                window.location.href = 'scores.html';
            });
        },
        /**
         * Gets all players which are still alive
         * @return {Array}          Alive players
         */
        $getAlivePlayers: function() {
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
        /**
         * Creates all audio FX nodes and inject it to the Audio Container
         */
        $createAudioFX: function() {
            var self = this;
            var fxSounds = Container.settings.audio.fx;

            fxSounds.forEach(function(fxSound) {
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
        $createPlayerSession: function(username, realname, pid) {
            var worlds = Container.settings.worlds;
            var wtype = Container.settings.worldType;
            $index.session[pid] = name;

            return Session[username] = {
                id: pid,
                name: realname,
                username: username,
                color: worlds[wtype].colors[pid],
                player: function() {
                    return Container.World.players[pid];
                }
            };
        },
        /**
         * Creates the score texts for each player. Before that,
         * it will create a session for every player.
         */
        $createScoreTexts: function() {
            var self = this;
            var pid = 0;
            var players = Container.settings.currentPlayers;

            players.forEach(function(name) {
                name = name.trim();
                var username = name.replace(' ', '')
                self.$createPlayerSession(username, name, pid);

                var text = new Factory.ScoreText(self, username.toUpperCase(), 0);
                text.option('fill', Session[username].color);
                text.add(20, 22 * (pid + 1), true);

                Session[username].text = text;

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
        },
        /**
         * Save the score of all session players in localstorage
         */
        $savePlayerScores: function() {
            for(var name in Session) {
                var user = Session[name];
                Container.Store.score(user.name, user.score, Container.settings.worldType);
            }
        }
    };

})(window);
