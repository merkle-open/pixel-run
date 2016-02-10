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
