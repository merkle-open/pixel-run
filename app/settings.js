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
                baseName: 'player',
                mimeType: 'png',
                amount: 2,
                variations: ['green', 'yellow', 'red', 'blue'],
                keymap: ['up', 'down', 'left', 'right'],
                bounce: {
                    y: 0.2
                },
                gravity: {
                    y: 900
                },
                velocity: {
                    y: -400
                }
            }
        }
    };

})(window);
