const sortScore = require("./helper").sortScore;
const capitalize = require("./helper").capitalize;
const processScores = require("./helper").processScores;
const rawFakes = `
  [
  {
    "name": "Jason",
    "score": 11,
    "world": "snow",
    "username": "df",
    "$id": "Skrwo7qQf"
  },
  {
    "name": "Martine",
    "score": 16,
    "world": "candy",
    "username": "kldfskl",
    "$id": "S1lHDiQ57G"
  },
  {
    "name": "Paul",
    "score": 10,
    "world": "snow",
    "username": "sdf",
    "$id": "S1WBwiX9QM"
  },
  {
    "name": "Hendrik",
    "score": 1,
    "world": "snow",
    "username": "sdf",
    "$id": "S1WBwiX9QM"
  },
  {
    "name": "Jason",
    "score": 11,
    "world": "snow",
    "username": "df",
    "$id": "Skrwo7qQf"
  },
  {
    "name": "Martine",
    "score": 6,
    "world": "candy",
    "username": "kldfskl",
    "$id": "S1lHDiQ57G"
  },
  {
    "name": "Paul",
    "score": 10,
    "world": "snow",
    "username": "sdf",
    "$id": "S1WBwiX9QM"
  },
  {
    "name": "Hendrik",
    "score": 16,
    "world": "snow",
    "username": "sdf",
    "$id": "S1WBwiX9QM"
  },
  {
    "name": "Jason",
    "score": 11,
    "world": "snow",
    "username": "df",
    "$id": "Skrwo7qQf"
  },
  {
    "name": "Martine",
    "score": 4,
    "world": "candy",
    "username": "kldfskl",
    "$id": "S1lHDiQ57G"
  },
  {
    "name": "Paul",
    "score": 156,
    "world": "snow",
    "username": "sdf",
    "$id": "S1WBwiX9QM"
  },
  {
    "name": "Hendrik",
    "score": 156,
    "world": "snow",
    "username": "sdf",
    "$id": "S1WBwiX9QM"
  }
]`;
const fakes = JSON.parse(rawFakes);

const sortedFakes = fakes.sort(sortScore);

test("Sorted scores array should keep his length", () => {
  expect(sortedFakes.length).toBe(fakes.length);
});

test("Sortet scores should start with the hightest score", () => {
  expect(sortedFakes[0].score).toBe(156);
  expect(sortedFakes[0].score).toEqual(sortedFakes[1].score);
  expect(sortedFakes[1].score).toBeGreaterThan(sortedFakes[2].score);
});

test("Capitalizes only first letter", () => {
  const name = "space";
  expect(capitalize(name)).toBe("Space");
});

let processedScores = processScores(rawFakes);

test("Only 10 scores retruned", () => {
  expect(processedScores.length).toBeLessThanOrEqual(10);
});
