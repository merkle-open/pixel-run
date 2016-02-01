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
