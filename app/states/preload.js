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
