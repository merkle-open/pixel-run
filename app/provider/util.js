/**
 * /app/provider/util.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    /**
     * Custom error type for all avaible game failures,
     * can be thrown with the debugger or called manually.
     * @param {String} message      Reason
     */
    function GameError(message) {
        this.name = 'GameError';
        this.message = (message || 'Undefined error');
    }

    GameError.prototype = Error.prototype;
    window.GameError = GameError;

    Util.noop = function() {
        // Basic no-operation method
    };

    /**
     * Private helper to order the score descending
     * @param  {Array} score        Highscore array
     * @return {Array}              Ordered array
     */
    Util.orderScore = function(score) {
        function compare(a, b) {
            if(a.score > b.score) {
                return -1;
            } else if (a.score < b.score) {
                return 1;
            } else {
                return 0;
            }
        }
        return score.sort(compare);
    };

    /**
     * Set the defaults for a variable. Custom handler can
     * also be used to check the value (to prevent long conditions)
     * @param  {T} input                Input value
     * @param  {T} defaultValue         Default value
     * @param  {Function} custom        Custom validator
     * @return {T}                      Right value
     */
    Util.default = function(input, defaultValue, custom) {
        if(typeof custom === 'function') {
            if(custom(input) === true) {
                return input;
            } else {
                return defaultValue;
            }
        } else if(!input || input === undefined || input === null) {
            return defaultValue;
        } else {
            return input;
        }
    };

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

    /**
     * Hyphenates a camelCased string
     * @param  {String} str         Any camel/pascal cased string
     * @return {String}             Hyphenated string
     */
    Util.hyphenate = function(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    };

    /**
     * Creates a new replacer instance
     * @param {String} input        Template string
     * @param {Object} data         Dataset
     */
    function Replacer(input, data) {
        this.input = input;
        this.data = data;
        return this;
    }

    Replacer.prototype = {
        /**
         * Main replace method, replaces each key set with {<value>} with
         * the key associated in the data. Data can be passed in this method
         * or directly in the constructor of the replacer.
         * @param  {Object} data    Optional data
         * @return {String}         Compiled string
         */
        replace: function(data) {
            var result = this.input;
            if(data === undefined) {
                data = this.data;
            }
            var keys = Object.keys(data);
            keys.forEach(function(key) {
                result = Util.replaceAll(result, '{' + key + '}', data[key]);
            });
            return result;
        }
    };

    /**
     * Shorthand for creation and calling the replace method,
     * easiest usage for the replace logic.
     * @param  {String} input       Template string
     * @param  {Object} data        Dataset
     * @return {String}             Compiled string
     */
    Util.replace = function(input, data) {
        return new Replacer(input).replace(data);
    };

    Util.Replacer = Replacer;

    function Debugger(namespace) {
        this.enabled = window.Container.settings.debug === true;
        this.namespace = namespace || 'undefined';
    }

    Debugger.prototype = {
        /**
         * Apply arguments to the warn function if enabled
         */
        warn: function() {
            if(console && console.warn) {
                this.$out(arguments, function(args) {
                    console.warn.apply(console, args);
                });
            }
        },
        /**
         * Apply arguments to the info function if enabled
         */
        info: function() {
            if(console && console.info) {
                this.$out(arguments, function(args) {
                    console.info.apply(console, args);
                });
            }
        },
        /**
         * Apply arguments to the error function if enabled
         */
        error: function() {
            if(console && console.error) {
                this.$out(arguments, function(args) {
                    console.error.apply(console, args);
                });
            }
        },
        /**
         * Apply arguments to the log function if enabled
         */
        log: function() {
            if(console) {
                this.$out(arguments, function(args) {
                    console.log.apply(console, args);
                });
            }
        },
        /**
         * Throws a new game error with a status and reason
         * @param  {String} reason      Error reason
         * @param  {String} status      Error status
         */
        throw: function(reason, status) {
            throw new GameError(reason + '(' + status + ')');
        },
        /**
         * Output provider (internal method)
         * @param  {[type]} handle [description]
         * @return {[type]}        [description]
         */
        $out: function(values, handle) {
            var args = Array.prototype.slice.call(values);
            args.unshift('[' + this.namespace + ']:');
            handle(args);
        }
    };

    Util.Debugger = Debugger;

    /**
     * Like Object.keys but get the values and not keys
     * @param  {Object} dataObject      Object target
     * @return {Array}                  Object values
     */
    Util.getValues = function(dataObject) {
        var dataArray = [];
        for(var o in dataObject) {
            dataArray.push(dataObject[o]);
        }
        return dataArray;
    };

    /**
     * Get playerscores in compressed object form
     * @return {Obejct}                 Compressed score info
     */
    Util.getPlayerScoreData = function() {
        var summaryList = [], res, psess;
        for(psess in Session) {
            summaryList.push(Session[psess]);
        }
        res = Util.orderScore(summaryList);

        return  {
            p1: res[0] ? res[0].name : '-',
            p2: res[1] ? res[1].name : '-',
            p3: res[2] ? res[2].name : '-',
            p1s: res[0] ? res[0].score : '-',
            p2s: res[1] ? res[1].score : '-',
            p3s: res[2] ? res[2].score : '-'
        };
    };

    /**
     * Replace all orccurencies in a string with a replacement
     * @param  {String} target         Input ressource
     * @param  {*} search               Placeholder
     * @param  {*} replacement          Any value to replace
     * @return {String}                 Compiled
     */
    Util.replaceAll = function(target, search, replacement) {
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    /**
     * Gets the score in a HTML string (tr>td) for inserting
     * it into a table body
     * @return {String}                 HTML markup
     */
    Util.getScoreTable = function(opts) {
        var generated = [];
        var index = 1;
        Container.Store.$getScore().forEach(function(score) {
            generated.push('<tr><td>');
            if(opts.index) {
                generated.push('<strong>');
                generated.push('# ' + index);
                generated.push('</strong></td><td>');
            }
            generated.push(score.score);
            generated.push('</td><td>');
            generated.push(score.holder);
            generated.push('</td><td>');
            generated.push(score.map);
            generated.push('</td><tr>');
            index++;
        });
        return generated.join('\n');
    };

    Util.calculate = {
        /**
         * Calculates the score from the x-axis value
         * of a player in the game
         * @param  {Number} pixels      Pixel value
         * @return {Number}             Player score
         */
        score: function(pixels) {
            var calc = pixels / 100;
            return Math.round(calc);
        }
    };

})(window);
