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

            this.physics.arcade.gravity.y = Container.settings.physics.arcadeGravity || 200;
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
            this.ready = false;
        }
    };

})(window);
