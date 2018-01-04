import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Scores = ({ currentPlayers }) => (
  <div className="js-finished resume">
    <h1>Game Over.</h1>
    <table>
      <thead>
        <tr>
          <td>Platzierung</td>
          <td>Spieler</td>
          <td>Score</td>
        </tr>
      </thead>
      <tbody>
        {currentPlayers
          .sort((player, otherPlayer) => otherPlayer.score - player.score)
          .map((player, index) => (
            <tr key={player.id}>
              <td>#{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.score}</td>
            </tr>
          ))}
      </tbody>
    </table>
    <div className="grid grid-sm actions">
      <div className="col-1-2">
        <button>
          <a href="/" title="Restart Game" tabIndex={-1}>
            <i className="icon icon-loop" />
          </a>
        </button>
      </div>
      <div className="col-1-2">
        <button>
          <a href="/scores" title="Highscores" tabIndex={0}>
            <i className="icon icon-trophy" />
          </a>
        </button>
      </div>
    </div>
  </div>
);

Scores.propTypes = {
  currentPlayers: PropTypes.arrayOf(PropTypes.object).isRequired
}

const mapStateToProps = state => ({
  currentPlayers: state.currentPlayers
});

export default connect(mapStateToProps)(Scores);
