/**
 * /app/provider/global.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    window.Util = {};
    window.Game = {
        roundWinner: null
    };
    window.Container = {
        World: {
            players: []
        },
        Audio: {}
    };
    window.Factory = {};
    window.Session = {};
    window.Emergency = {};
    window.HUD = {
        $store: {},
        Factory: {}
    };
    window.$index = {
        session: {}
    };

})(window);
