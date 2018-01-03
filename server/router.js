"use strict";

const fs = require("fs");
const path = require("path");
const util = require("util");
const uuid = require("shortid");
const express = require("express");
const router = express.Router();

const BASE = path.join(__dirname, "..", "data");
const ENCODING = "utf8";
const SCOREFILE = path.join(BASE, "scores.json");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const results = [];
setInterval(() => {
  if (results.length === 0) return;

  readFile(SCOREFILE, ENCODING)
    .then(data => {
      return JSON.parse(data);
    })
    .then(jsonData => {
      return flushArrayToScoreFile(jsonData);
    })
    .catch(error => {
      if (error.code === "ENOENT") {
        return flushArrayToScoreFile();
      }
      console.log(error);
    });
}, 1000);

const flushArrayToScoreFile = (scores = null) => {
  let data = scores === null ? results.slice() : scores.concat(results);
  results.length = 0;
  return writeFile(SCOREFILE, JSON.stringify(data, null, 2), ENCODING);
};

const sortScore = (a, b) => {
  if (a.score > b.score) {
    return -1;
  } else if (a.score < b.score) {
    return 1;
  }
  return 0;
};

const capitalize = function(value) {
  return typeof value === "string"
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "";
};

const processScores = data => {
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
    if (previous !== dataset.score) {
      i++;
    }

    dataset.index = i;
    previous = dataset.score;
  });

  // Cut off the array
  // default => show only 10 entries
  data = data.slice(0, 10);

  return data;
};

const saveToJson = () => {};

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("default", {
    script: "gameApp",
    title: "Play Now"
  });
});

/* GET highscores page. */
router.get("/scores", (req, res, next) => {
  res.render("default", {
    script: "scoresApp",
    title: "Highscores"
  });
});

/* GET send scores as JSON. */
router.get("/api/get/scores", (req, res, next) => {
  readFile(SCOREFILE, ENCODING)
    .then(data => processScores(data))
    .then(data => res.json(data))
    .catch(error => next(error));
});

/* POST save new score. */
router.post("/api/save/score", (req, res, next) => {
  req.body.$id = uuid.generate();
  results.push(req.body);
  res.sendStatus(200);
});

module.exports = router;
