/**
 * /app/provider/settings.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(undefined) {
    'use strict';

    var settings = {
        debug: true, // DO NOT DISABLE!
        audio: {
            fx: [
                'jump',
                'die'
            ]
        },
        render: {
            width: '100%',
            height: 1000,
            mode: 'canvas', // Phaser.[VALUE]
            node: 'js-launch-phaser-game',
            fontSize: 26
        },
        physics: {
            mode: 'arcade', // Phaser.Physics[ARCADE]
        },
        game: {
            jumpOn: 'push', // release
            players: {
                height: 160,
                width: 153,
                baseName: 'avatar-',
                basePath: 'assets/img/avatars/',
                mimeType: 'png',
                amount: 0,
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

    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = settings;
    } else {
        if(!window) {
            throw new Error('Couldn\'t inject settings into Container');
        }
        window.Container.settings = settings;
    }

})();
