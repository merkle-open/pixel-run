(function(window, undefined) {
    'use strict';

    var $ = window.$;
    var saved = $ || null;

    $ = {};

    /**
     * Return the old dollar value
     * @return {Function}       Command Line API
     */
    $.giveBack = function() {
        return saved;
    };

    /**
     * Fade out <element> with opacity filter in CSS3
     * @param  {Node} element   HTML Node
     */
    $.fade = function(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 50);
    };

    window.$ = $;

})(window);
