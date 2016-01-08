(function(window, undefined) {
    'use strict';

    Root.Util = Root.$createModule('util', function(App) {
        console.log('Loading module %s ...', this.name);

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

        this.Replacer = Replacer;
        this.$createReplacer = function(input, data) {
            return new Replacer(input, data);
        };

        this.clone = function(obj) {
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
        }
    });

})(window);
