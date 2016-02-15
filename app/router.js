var fs = require('fs');
var path = require('path');
var uuid = require('shortid');
var express = require('express');
var router = express.Router();

var BASE = path.join(__dirname, 'data');

var FILE = {
    SCORE: path.join(BASE, 'scores.json')
};

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
    return value.charAt(0).toUpperCase() + value.slice(1);
};

var processScores = (data) => {
    var i = 1;
    data = JSON.parse(data);

    // Parsing values
    data.forEach((dataset) => {
        dataset.world = capitalize(dataset.world);
        dataset.score = Number.parseInt(dataset.score);
    });

    // Order the score
    data.sort(sortScore);

    // Apply the users rank
    data.forEach((dataset) => {
        dataset.index = i++;
    });

    return data;
};

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Play Now'
    });
});

/* GET highscores page. */
router.get('/scores', (req, res, next) => {
    fs.readFile(FILE.SCORE, 'utf8', (err, data) => {
        if(err) {
            next(err);
        }

        data = processScores(data);

        res.render('scores', {
            scores: data,
            title: 'Highscores'
        });
    });
});

/* GET send scores as JSON. */
router.get('/api/get/scores', function(req, res, next) {
    fs.readFile(FILE.SCORE, 'utf8', (err, data) => {
        if(err) {
            next(err);
        }

        data = processScores(data);
        res.json(data);
    });
});

/* POST save new score. */
router.post('/api/save/score', function(req, res, next) {
    fs.readFile(FILE.SCORE, 'utf8', (err, data) => {
        if(err) {
            next(err);
        }

        var data = JSON.parse(data);
        var insert = req.body;

        insert.$id = uuid.generate();
        data.push(req.body);

        var serialized = JSON.stringify(data, null, 2);

        fs.writeFile(FILE.SCORE, serialized, 'utf8', (err) => {
            if(err) {
                next(err);
            }

            res.send(true);
        });
    });
});

module.exports = router;
