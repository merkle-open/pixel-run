'use strict';

const fs = require('fs');
const path = require('path');
const async = require('async');
const uuid = require('shortid');
const moment = require('moment');
const express = require('express');
const settings = require('./provider/settings');
const router = express.Router();

const BASE = path.join(__dirname, 'data');
const ENCODING = 'utf8';
const SCOREFILE = path.join(BASE, 'scores.json');
const SAVE_AMOUNT = 50;

var sortScore = (a, b) => {
    if(a.score > b.score) {
        return -1;
    } else if (a.score < b.score) {
        return 1;
    } else {
        return 0;
    }
};

var capitalize = value => {
    return typeof value === 'string' ?
        value.charAt(0).toUpperCase() + value.slice(1) : '';
};

var cleaning = finished => {
    fs.readFile(SCOREFILE, ENCODING, (err, data) => {
        if(err) {
            next(err);
        }

        data = processScores(data);
        console.log(data);

        if(data.length > SAVE_AMOUNT) {
            console.log(`More than ${SAVE_AMOUNT} datasets detected, cutting off the first ${SAVE_AMOUNT} ...`);
            data = data.slice(0, (SAVE_AMOUNT - 1));
        }

        (finished || () => {})(data);
    });
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
        title: 'Play Now'
    });
});

/* GET about page. */
router.get('/about', (req, res, next) => {
    res.render('about', {
        title: 'Über Pixel. Run.',
        isContentPage: true
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
            uuid: uuid.generate(),
            isContentPage: true
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
        data.forEach(dataset => {
            dataset.$stamp = moment(dataset.$stamp).format('DD.MM.YYYY [um] HH:mm');
        })
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
        // Push new score to the array
        (data, resolve) => {
            var insert = req.body;
            insert.$id = uuid.generate();
            insert.$stamp = new Date().toISOString();
            data.push(req.body);

            resolve(null, data, JSON.stringify(data, null, 2));
        },
        // Write the content to the file
        (data, inject, resolve) => {
            fs.writeFile(SCOREFILE, inject, ENCODING, err => {
                if(err) {
                    return resolve(err);
                }

                resolve(null);
            });
        }
    ], err => {
        cleaning(afterCleanData => {
            res.send(err ? false : true);
        });
    });
});

exports = module.exports = router;
