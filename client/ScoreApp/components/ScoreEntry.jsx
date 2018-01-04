import React from "react";
import PropTypes from "prop-types";

const ScoreEntry = ({ $id, index, score, name, world }) => (
  <tr data-pid={$id}>
    <td>
      <strong># {index}</strong>
    </td>
    <td>{score}</td>
    <td>{name}</td>
    <td>{world}</td>
  </tr>
);

ScoreEntry.propTypes = {
  $id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  world: PropTypes.string.isRequired
};

export default ScoreEntry;
