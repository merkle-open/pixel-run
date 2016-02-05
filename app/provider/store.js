/**
 * /app/states/store.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var Local = window.Store;

    var Store = function() {
        // Class wrapper
    };

    Store.prototype = {
        /**
         * Sets a new score for a new holder
         * @param  {String} name        Name of score holder
         * @param  {Number} value       Score value
         */
        score: function(name, value, map) {
            if(!Local.has('score') || !Array.isArray(Local.get('score'))) {
                this.resetScore();
            }
            var old = Local.get('score');
            old.push({
                holder: name,
                score: value,
                map: map
            });
            Local.set('score', old);
        },
        /**
         * Get the highscore as a number. Set objfy to true,
         * to get the holder and score in object value.
         * @param  {Boolean} objfy      If should objectify the highscore
         * @return {Number|Object}      Highscore
         */
        getHighscore: function(objfy) {
            var result = this.$getScore()[0];
            return objfy ? result : result.score;
        },
        /**
         * Reset the local store and empty all previous values
         */
        resetScore: function() {
            Local.set('score', []);
        },
        /**
         * Get the highest score in array form (private method)
         * @return {Array} scores
         */
        $getScore: function() {
            return Util.orderScore(Local.get('score'));
        }
    };

    Container.Store = new Store();

})(window);
