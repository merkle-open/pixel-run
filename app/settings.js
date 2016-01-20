(function(window, undefined) {
    'use strict';

    Container.settings = {
        render: {
            width: 800,
            height: 600,
            mode: Phaser.AUTO,
            node: 'startgame'
        },
        physics: {
            mode: Phaser.Physics.ARCADE
        },
        game: {
            doubleJump: true,
            placementOffset: 32,
            players: {
                amount: 2,
                variations: ['green', 'yellow', 'red', 'blue']
            },
            gravity: {

            }
        }
    };

})(window);
