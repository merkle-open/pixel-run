import React from "react";

const ScoreEntry = ({ $id, index, score, name, world }) => {
  return (
    <tr data-pid={$id}>
      <td>
        <strong># {index}</strong>
      </td>
      <td>{score}</td>
      <td>{name}</td>
      <td>{world}</td>
    </tr>
  );
};

export default ScoreEntry;
