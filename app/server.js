var hbs = require('hbs');
var http = require('http');
var cluster = require('cluster');
var express = require('express');
var chalk = require('chalk');

if(cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    console.log([
        'Starting the gameserver in', chalk.cyan('%d cores/threads'), '...'
    ].join(' '), cpuCount);

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        // Replace the dead worker,
        // we're not sentimental
        console.log('Worker %d died, restarting ...', worker.id);
        cluster.fork();
    });
} else {
    // Create a new express instance
    var app = express();

    // Apply different helper methods
    require('./lib/helpers')(hbs);

    // Adding general setup stuff for views, router etc.
    require('./lib/setup')(app);

    // Apply some new middleware for preloading
    require('./lib/middleware')(app);

    // Attach all routes and routing stuff
    app.use('/', require('./router'));

    // Loading the error handlers
    require('./lib/error')(app);

    // Setting the port to environement port or 3000
    var port = process.env.PORT || '3000';
    app.set('port', port);

    // Starts a http server with the express app
    var server = http.createServer(app);
    server.listen(port);

    console.log([
        'Server running on', chalk.cyan('port %d'), 'in',
        chalk.magenta('worker %d'), 'with', chalk.green('pid %d')
    ].join(' '), port, cluster.worker.id, cluster.worker.process.pid);
}
