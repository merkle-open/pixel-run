exports = module.exports = function(handlebars) {
    handlebars.registerHelper('each', function(context, options) {
        var ret = '';

        for(var i = 0, j = context.length; i < j; i++) {
            ret += options.fn(context[i]);
        }

        return ret;
    });
}
