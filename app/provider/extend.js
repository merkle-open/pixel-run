/**
 * /app/provider/extend.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
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
    $.fadeOut = function(element, callback) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
                (callback || Util.noop)();
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 50);
    };

    /**
     * Fade in <element> with opacity filter in CSS3
     * @param  {Node} element   HTML Node
     */
    $.fadeIn = function(element, callback) {
        var op = 0;  // initial opacity
        var timer = setInterval(function () {
            if (op >= 1){
                clearInterval(timer);
                element.style.display = 'block';
                (callback || Util.noop)();
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 50);
    };

    $.requestFullscreen = function(elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        }
    };

    window.$ = $;

})(window);
