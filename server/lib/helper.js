const sortScore = (a, b) => {
  if (a.score > b.score) {
    return -1;
  } else if (a.score < b.score) {
    return 1;
  }
  return 0;
};

const capitalize = value => {
  return typeof value === "string"
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "";
};

module.exports.sortScore = sortScore;
module.exports.capitalize = capitalize;

module.exports.processScores = data => {
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