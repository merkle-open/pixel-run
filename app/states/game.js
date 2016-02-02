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
