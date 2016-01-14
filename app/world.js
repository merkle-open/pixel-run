 (function(window, undefined) {
    'use strict';

    Root.World = Root.$createModule('world', {

    }, function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;

        module.init = function() {
            // Initialize
        };

    });

})(window);
