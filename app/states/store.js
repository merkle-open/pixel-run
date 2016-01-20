(function(window, undefined) {
    'use strict';

    var game = Container.game;
    var Local = window.Store;

    var Store = function(game) {
        // Class wrapper
    };

    Store.prototype = {
        score: function(name, value) {
            if(!Local.has('score') || !Array.isArray(Local.get('score'))) {
                this.resetScore();
            }
            var old = Local.get('score');
            old.push({
                holder: name,
                score: value
            });
            Local.set('score', old);
        },
        getScore: function() {
            return this._orderScore(Local.get('score'));
        },
        getHighscore: function(objfy) {
            var result = this.getScore()[0];
            return objfy ? result : result.score;
        },
        _orderScore: function(score) {
            function compare(a, b) {
                if(a.score > b.score) {
                    return -1;
                } else if (a.score < b.score) {
                    return 1;
                } else {
                    return 0;
                }
            }
            return score.sort(compare);
        },
        resetScore: function() {
            Local.set('score', []);
        }
    };

    Container.Store = new Store();

})(window);
