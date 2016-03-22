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
