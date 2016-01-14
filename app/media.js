(function(window, undefined) {
    'use strict';

    Root.Media = Root.$createModule('media', {

    }, function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;

        module.init = function() {
            // Initialize
        };
    });

})(window);
