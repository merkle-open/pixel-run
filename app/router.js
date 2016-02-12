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

        var i = 1;
        data = JSON.parse(data);

        data.sort(sortScore);

        data.forEach((dataset) => {
            dataset.index = i++;
        });

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

        var i = 1;
        data = JSON.parse(data);

        data.sort(sortScore);

        data.forEach((dataset) => {
            dataset.index = i++;
        });

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

        fs.writeFile(FILE.SCORE, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if(err) {
                next(err);
            }

            res.send(true);
        });
    });
});

module.exports = router;
