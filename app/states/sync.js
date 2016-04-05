/**
 * /app/states/over.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var debug = new Util.Debugger('States.Sync');

    Container.Sync = function() {
        // Empty class wrapper
    };

    Container.Sync.prototype = {
        create: function() {
            var debugResults = [];
            var amount = Object.keys(Session).length;
            debug.log('Syncing scores over AJAX for ' + amount + ' players ...');

            async.forEachOf(Session, function(value, key, resolve) {
                $.ajax({
                    type: 'POST',
                    url: '/api/save/score',
                    data: {
                        name: value.name,
                        score: value.score,
                        world: Container.settings.worldType,
                        username: value.username
                    },
                    success: function(res) {
                        debugResults.push(res);
                        resolve(null);
                    },
                    error: function(err) {
                        resolve('Request failed');
                    }
                });
            }, function(err) {
                if(err) {
                    return debug.throw(err);
                }

                var percentage = 100 / amount * debugResults.length;
                debug.log([
                    'Scores saved for', debugResults.length, 'of', amount,
                    'players', '(' + percentage + '%)'
                ].join(' '));
            });
        }
    };

})(window);
