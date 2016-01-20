(function(window, undefined) {
    'use strict';

    function Replacer(input, data) {
        this.input = input;
        this.data = data;
        return this;
    }

    Replacer.prototype = {
        replace: function(data) {
            var result = this.input;
            if(data === undefined) {
                data = this.data;
            }
            var keys = Object.keys(data);
            keys.forEach(function(key) {
                result = result.replace('{' + key + '}', data[key]);
            });
            return result;
        }
    };

    Replacer.create = function(input, data) {
        return new Replacer(input, data);
    };

    Util.Replacer = Replacer;
    Util.replace = function(input, data) {
        return new Replacer(input).replace(data);
    };

})(window);
