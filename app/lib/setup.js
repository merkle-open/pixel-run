var hbs = require('hbs');
var path = require('path');
var logger = require('morgan');
var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

exports = module.exports = function(app) {
    app.set('views', [
        path.join(__dirname, '..', '..', 'www'),
        path.join(__dirname, '..', '..', 'www/templates')
    ]);

    app.set('view engine', 'hbs');
    app.set('view options', {
        layout: 'default'
    });

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '..', '..', 'www')));
};
