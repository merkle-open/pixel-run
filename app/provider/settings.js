(function(window, undefined) {
    'use strict';

    Container.settings = {
        render: {
            width: '100%',
            height: 1000,
            mode: Phaser.AUTO,
            node: 'startgame'
        },
        physics: {
            mode: Phaser.Physics.ARCADE
        },
        game: {
            tilemap: 'tilemap-space',
            doubleJump: true,
            players: {
                offset: {
                    x: 110,
                    y: 500
                },
                baseName: 'avatar-',
                basePath: 'assets/img/avatars/',
                mimeType: 'png',
                amount: 3,
                variations: ['techie', 'designer', 'consultant'],
                keymap: ['up', 'down', 'left'],
                bounce: {
                    y: 0.3
                },
                gravity: {
                    y: 900
                },
                velocity: {
                    y: -600,
                    x: 250
                }
            }
        }
    };

})(window);
