/**
 * /app/provider/global.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    Object.assign(window, {
        Util: {},
        Game: {},
        Container: {
            $indicate: {},
            World: {
                players: []
            },
            Audio: {}
        },
        Factory: {},
        Session: {},
        Emergency: {},
        HUD: {
            $store: {},
            Factory: {}
        },
        $index: {
            session: {}
        }
    });

})(window);
