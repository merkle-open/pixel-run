var fs = require('fs');
var path = require('path');
var uuid = require('shortid');
var express = require('express');
var database = require('./classes/database');
var router = express.Router();

var BASE = path.join(__dirname, 'data');

var FILE = {
    SCORE: path.join(BASE, 'scores.json')
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET highscores page. */
router.get('/scores', function(req, res, next) {
    fs.readFile(FILE.SCORE, 'utf8', (err, data) => {
        if(err) {
            next(err);
        }

        res.render('scores', {
            scores: JSON.parse(data)
        });
    });
});

/* POST save new score. */
router.post('/save/score', function(req, res, next) {
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
