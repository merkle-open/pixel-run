(function(window, undefined) {
    'use strict';

    var Controls = window.Controls;
    var keys = [37, 38, 39, 40];
    var disableArrowKeys = function(ev) {
        if (keys.indexOf(ev.keyCode) >= 0) {
            ev.preventDefault();
        }
    };

    Controls.Arrows = {
        disable: function() {
            return $(document).keydown(disableArrowKeys);
        },
        enable: function() {
            return $(document).unbind('keydown', disableArrowKeys);
        }
    };

})(window);
