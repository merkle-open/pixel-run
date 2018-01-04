const fs = require("fs");
const path = require("path");
const util = require("util");
const uuid = require("shortid");
const express = require("express");

const router = express.Router();

const { processScores} = require("./lib/helper");

const BASE = path.join(__dirname, "..", "data");
const ENCODING = "utf8";
const SCOREFILE = path.join(BASE, "scores.json");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const results = [];
const flushArrayToScoreFile = (scores = null) => {
  const data = scores === null ? results.slice() : scores.concat(results);
  results.length = 0;
  return writeFile(SCOREFILE, JSON.stringify(data, null, 2), ENCODING);
};

setInterval(() => {
  if (results.length === 0) return;

  readFile(SCOREFILE, ENCODING)
    .then(data => JSON.parse(data))
    .then(jsonData => flushArrayToScoreFile(jsonData))
    .catch(error => {
      if (error.code === "ENOENT") {
        return flushArrayToScoreFile();
      }
      throw error;
    });
}, 1000);


/* GET home page. */
router.get("/", (req, res) => {
  res.render("default", {
    script: "gameApp",
    title: "Play Now"
  });
});

/* GET highscores page. */
router.get("/scores", (req, res) => {
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
router.post("/api/save/score", (req, res) => {
  req.body.$id = uuid.generate();
  results.push(req.body);
  res.sendStatus(200);
});

module.exports = router;
