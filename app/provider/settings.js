/**
 * /app/provider/settings.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    Container.settings = {
        debug: true,
        audio: {
            fx: [
                'jump',
                'die'
            ]
        },
        render: {
            width: '100%',
            height: 1000,
            mode: Phaser.CANVAS,
            node: 'js-launch-phaser-game',
            fontSize: 26
        },
        physics: {
            mode: Phaser.Physics.ARCADE
        },
        game: {
            jumpOn: 'push', // release
            tilemap: 'tilemap-space',
            doubleJump: true,
            players: {
                height: 160,
                width: 153,
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
                    y: -750,
                    x: 450
                }
            }
        },
        worlds: {
            space: {
                contrast: '#ffffff',
                colors: ['#50bcff', '#a8c614', '#ff5050'],
            }
        }
    };

})(window);
