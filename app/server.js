var hbs = require('hbs');
var path = require('path');
var logger = require('morgan');
var express = require('express');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// Apply different helper methods
require('./lib/helpers')(hbs);

hbs.localsAsTemplateData(require(path.join(__dirname, 'provider', 'settings')));

app.set('views', [
    path.join(__dirname, '..', 'www'),
    path.join(__dirname, '..', 'www/templates')
]);

app.set('view engine', 'hbs');
app.set('view options', {});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'www')));

// Apply some new middleware for preloading
require('./lib/middleware')(app);

// Attach all routes and routing stuff
app.use('/', require('./router'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
