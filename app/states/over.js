/**
 * /app/states/over.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var debug = new Util.Debugger('States.Over');

    Container.Over = function() {
        // Empty class wrapper
    };

    Container.Over.prototype = {
        init: function(gameState) {
            this.last = gameState;
        },
        create: function() {
            var content = $('.js-finished').html();
            var playerScores = Util.getPlayerScoreData();

            // Transform placeholders and apply
            $('.js-finished').html(Util.replace(content, playerScores));
            $('#' + Container.settings.render.node).fadeOut(function() {
                Container.game.state.start('Sync');
                $('.js-finished').fadeIn();
            });
        }
    };

})(window);
