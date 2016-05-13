'use strict';

const fs = require('fs');
const path = require('path');
const settings = require('./../provider/settings');
const pkg = require(path.join(__dirname, '..', '..', 'package.json'));

exports = module.exports = app => {
    app.use((req, res, next) => {
        res.locals.$debug = settings.debug;
        next();
    });

    app.use((req, res, next) => {
        let buildPath = path.join(__dirname, '..', '..', '.build');

        fs.readFile(buildPath, 'utf8', (err, data) => {
            if(err) {
                res.locals.$build = `pkg-${pkg.version}`;
            } else {
                res.locals.$build = data;
            }

            next();
        });
    });
};
