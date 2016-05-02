'use strict';

const fs = require('fs');
const path = require('path');
const async = require('async');
const uuid = require('shortid');
const express = require('express');
const settings = require('./provider/settings');
const router = express.Router();

const BASE = path.join(__dirname, 'data');
const ENCODING = 'utf8';
const SCOREFILE = path.join(BASE, 'scores.json');

var sortScore = (a, b) => {
    if(a.score > b.score) {
        return -1;
    } else if (a.score < b.score) {
        return 1;
    } else {
        return 0;
    }
};

var capitalize = function(value) {
    return typeof value === 'string' ?
        value.charAt(0).toUpperCase() + value.slice(1) : '';
};

var processScores = data => {
    let previous = 0;
    let i = 0;
    data = JSON.parse(data);

    // Parsing values
    data.forEach(dataset => {
        dataset.world = capitalize(dataset.world);
        dataset.score = Number.parseInt(dataset.score);
    });

    // Order the score
    data.sort(sortScore);

    // Apply the users rank
    data.forEach(dataset => {
        if(previous !== dataset.score) {
            i++;
        }

        dataset.index = i;
        previous = dataset.score;
    });

    // Cut off the array
    if(settings.scores.limit > 0) {
        data = data.slice(0, settings.scores.limit);
    }

    return data;
};

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Play Now',
        uuid: uuid.generate()
    });
});

/* GET about page. */
router.get('/about', (req, res, next) => {
    res.render('about', {
        title: 'About Pixel. Run.',
        uuid: uuid.generate()
    });
});

/* GET highscores page. */
router.get('/scores', (req, res, next) => {
    fs.readFile(SCOREFILE, ENCODING, (err, data) => {
        if(err) {
            next(err);
        }

        data = processScores(data);

        res.render('scores', {
            scores: data,
            title: 'Highscores',
            uuid: uuid.generate()
        });
    });
});

/* GET send scores as JSON. */
router.get('/api/get/scores', (req, res, next) => {
    fs.readFile(SCOREFILE, ENCODING, (err, data) => {
        if(err) {
            next(err);
        }

        data = processScores(data);
        res.json(data);
    });
});

/* POST save new score. */
router.post('/api/save/score', (req, res, next) => {
    async.waterfall([
        resolve => {
            fs.readFile(SCOREFILE, ENCODING, (err, data) => {
                if(err) {
                    return resolve(err);
                }

                try {
                    var data = JSON.parse(data);
                } catch(ex) {
                    data = [];
                }

                resolve(null, data);
            });
        },
        (data, resolve) => {
            var insert = req.body;
            insert.$id = uuid.generate();
            data.push(req.body);

            resolve(null, data, JSON.stringify(data, null, 2));
        },
        (data, inject, resolve) => {
            fs.writeFile(SCOREFILE, inject, ENCODING, err => {
                if(err) {
                    return resolve(err);
                }

                resolve(null);
            });
        }
    ], err => {
        res.send(err ? false : true);
    });
});

module.exports = router;
