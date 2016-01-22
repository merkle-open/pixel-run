(function(window, undefined) {
    'use strict';

    Container.settings = {
        paths: {
            player: 'assets/img/avatars/',
            tilemap: 'assets/tilemap/',
            tiles: 'assets/tilemap/tiles/'
        },
        render: {
            width: '100%',
            height: '100%',
            mode: Phaser.AUTO,
            node: 'startgame'
        },
        physics: {
            mode: Phaser.Physics.ARCADE
        },
        game: {
            tilemap: 'tilemap-default',
            doubleJump: true,
            players: {
                offset: {
                    x: 32,
                    y: 300
                },
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
                    y: -400,
                    x: 150
                }
            }
        }
    };

})(window);
