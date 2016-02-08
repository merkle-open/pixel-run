var settings = require('./../provider/settings');

exports = module.exports = function(app) {
    app.use(function(req, res, next) {
        res.locals.$debug = settings.debug;
        next();
    });
};
