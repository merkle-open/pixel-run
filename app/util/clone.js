(function(window, undefined) {
    'use strict';

    /**
     * Generates a clone of an object (without proto values)
     * @param  {Object} obj         Object to clone
     * @return {Object}             Cloned object
     */
    Util.clone = function(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr) && attr !== '_saveState') {
                copy[attr] = obj[attr];
            }
        }
        return copy;
    };

})(window);
