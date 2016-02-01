(function(window, undefined) {
    'use strict';

    var id = 0;

    /**
     * Constructor for a new procedure
     * @param {String} name             Name of the procedure
     * @param {Object} opts             Optional options
     * @param {Function} procedure      Main procedure method
     */
    function Procedure(name, opts, procedure) {
        if(typeof opts === 'function') {
            this.options = {};
            this.procedure = opts;
        } else {
            this.options = opts;
            this.procedure = procedure;
        }
        this.$id = 0;
        this.name = name;

        return Container.procedures[this.name] = this;
    };

    Procedure.prototype = {
        /**
         * Returns the main procedure
         * @return {Function}       Procedure
         */
        getFunction: function() {
            return this.procedure;
        },
        /**
         * Get the name of the procedure
         * @return {String}         Name
         */
        getName: function() {
            return this.name;
        },
        /**
         * Run the procedure with arguments and callback
         * @param  {*} input                Data to pass
         * @param  {Function} finished      Callback handler
         */
        run: function(input, finished) {
            finished = Util.default(finished, Util.noop);
            try {
                var result = this.procedure(input);
                finished(result);
            } catch(failed) {
                finished(failed);
            }
        }
    };

    window.Factory.Procedure = Procedure;

})(window);
