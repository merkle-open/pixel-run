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
            arcadeGravity: 200
        },
        game: {
            jumpOn: 'release', // release
            players: {
                height: 160,
                width: 153,
                baseName: 'avatar-',
                basePath: 'assets/img/avatars/',
                mimeType: 'png',
                amount: undefined,
                variations: ['techie', 'designer', 'consultant'],
                keymap: ['up', 'down', 'left'],
                bounce: {
                    y: 0.2
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
        scores: {
            limit: -1, // How many entries (-1 equals unlimited)
            refetch: 10 * 1000 // How often the scores should be reloaded
        },
        worlds: { // You must insert all worlds here!
            space: {
                contrast: '#ffffff',
                colors: ['#50bcff', '#a8c614', '#ff5050'],
            },
            candy: {
                contrast: '#000000',
                colors: ['#50bcff', '#a8c614', '#ff5050'],
            },
            snow: {
                contrast: '#000000',
                colors: ['#50bcff', '#a8c614', '#ff5050'],
            }
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = settings;
    } else {
        window.Container.settings = settings;
    }

})();
