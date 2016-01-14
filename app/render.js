(function(window, undefined) {
    'use strict';

    Root.Renderer = Root.$createModule('renderer', function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;

        module.init = function() {
            // Initialize
        };

    });

})(window);
