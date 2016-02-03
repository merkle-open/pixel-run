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
        },
        worlds: {
            space: {
                contrast: '#ffffff',
                colors: ['#50bcff', '#a8c614', '#ff5050'],
            }
        }
    };

})(window);
