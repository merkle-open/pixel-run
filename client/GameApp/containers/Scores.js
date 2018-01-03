import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Scores extends React.Component {
  render() {
    return (
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
            {this.props.currentPlayers
              .sort((player, otherPlayer) => otherPlayer.score - player.score)
              .map((player, index) => {
                return (
                  <tr key={index}>
                    <td>#{index + 1}</td>
                    <td>{player.name}</td>
                    <td>{player.score}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="grid grid-sm actions">
          <div className="col-1-2">
            <button role="button">
              <a href="/" title="Restart Game" tabIndex={1}>
                <i className="icon icon-loop" />
              </a>
            </button>
          </div>
          <div className="col-1-2">
            <button role="button">
              <a href="/scores" title="Highscores" tabIndex={1}>
                <i className="icon icon-trophy" />
              </a>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentPlayers: state.currentPlayers
  };
};

export default connect(mapStateToProps)(Scores);
