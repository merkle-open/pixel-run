'use strict';

const fs = require('fs');
const path = require('path');
const async = require('async');
const uuid = require('shortid');
const express = require('express');
const settings = require('./provider/settings');
const reader = require('./reader');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    let worlds = reader.getWorlds();

    res.render('index', {
        title: 'Play Now',
        uuid: uuid.generate(),
        worlds: worlds.join(','),
        worldsArray: worlds
    });
});

exports = module.exports = router;
