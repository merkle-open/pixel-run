var hbs = require('hbs');
var path = require('path');
var logger = require('morgan');
var express = require('express');
var favicon = require('serve-favicon');
var hbutils = require('hbs-utils')(hbs);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var base = path.join(__dirname, '..', '..', 'www');

exports = module.exports = function(app) {
    hbutils.registerWatchedPartials(path.join(base, 'components'));

    app.set('views', [
        path.join(__dirname, '..', '..', 'www/views'),
        path.join(__dirname, '..', '..', 'www/templates')
    ]);

    app.set('view engine', 'hbs');
    app.engine('hbs', hbs.__express);
    app.set('view options', {
        layout: 'default'
    });

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use('/public', express.static(path.join(__dirname, '..', '..', 'www/dist')));
};
