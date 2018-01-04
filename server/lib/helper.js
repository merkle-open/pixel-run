const sortScore = (a, b) => {
  if (a.score > b.score) {
    return -1;
  } else if (a.score < b.score) {
    return 1;
  }
  return 0;
};

const capitalize = value => (
   typeof value === "string"
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : ""
);

module.exports.sortScore = sortScore;
module.exports.capitalize = capitalize;

module.exports.processScores = rawData => {
  let previous = 0;
  let i = 0;
  const data = JSON.parse(rawData);

  // Parsing values
  const parsedData = data.map(dataset => {
    const newData = dataset;
    newData.world = capitalize(dataset.world);
    newData.score = Number.parseInt(dataset.score, 10);
    return newData;
  });

  // Order the score
  const sortedData = parsedData.sort(sortScore);

  // Apply the users rank
  const rankedData = sortedData.map(dataset => {
    const newDataset = dataset;
    if (previous !== newDataset.score) {
      i += 1;
    }

    newDataset.index = i;
    previous = dataset.score;
    return newDataset;
  });

  // Cut off the array
  // default => show only 10 entries
  return rankedData.slice(0, 10);
};
