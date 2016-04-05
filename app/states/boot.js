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
            };
        },
        /**
         * Load all dependencies for all worlds saved under settings
         */
        $loadWorldDependencies: function() {
            var current;
            var self = this;
            var game = Container.game;
            var worldKeys = $('#js-worlds').val().split(',');
            var characters = Container.settings.game.players.variations;

            worldKeys.forEach(function(w) {
                self.load.tilemap('tilemap-' + w, '/public/worlds/' + w + '/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
                self.load.image('background-' + w, '/public/worlds/' + w + '/background.png');
                self.load.image('tile-' + w, '/public/worlds/' + w + '/tile.png');

                characters.forEach(function(vr) {
                    // Load default character for each world
                    self.load.image('avatar-' + w + '-' + vr, '/public/avatars/' + vr + '.png');
                });
            });
        },
        /**
         * Load all audio effects and samples
         */
        $loadAudioFX: function() {
            var self = this;
            var fxSounds = Container.settings.audio.fx;
            fxSounds.forEach(function(fxSound) {
                self.load.audio('fx-' + fxSound, '/public/assets/audio/fx/' + fxSound + '.mp3');
            });
        }
    };

})(window);
