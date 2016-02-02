(function(window, undefined) {
    'use strict';

    Util.calculate = {
        score: function(pixels) {
            var calc = pixels / 100;
            return Math.round(calc);
        }
    };

})(window);
