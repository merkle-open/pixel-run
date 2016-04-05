var hbs = require('hbs');
var path = require('path');
var pollution = require('hpp');
var logger = require('morgan');
var helmet = require('helmet');
var express = require('express');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var hbutils = require('hbs-utils')(hbs);
var cookieParser = require('cookie-parser');
var base = path.join(__dirname, '..', '..', 'www');

exports = module.exports = function(app) {
    // Registering partials
    hbutils.registerWatchedPartials(path.join(base, 'components'));

    // Defining views and templates
    app.set('views', [
        path.join(base, 'views'),
        path.join(base, 'templates')
    ]);

    // View-engine setup
    app.set('view engine', 'hbs');
    app.engine('hbs', hbs.__express);
    app.set('view options', {
        layout: 'default'
    });

    // Security settings
    app.disable('x-powered-by');
    app.use(helmet());
    app.use(pollution());

    // Parser and static-dir settings
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use('/public', express.static(path.join(base, 'dist')));
    app.use('/public/avatars', express.static(path.join(base, '..', 'avatars')));
    app.use('/public/worlds', express.static(path.join(base, '..', 'worlds')));
};
