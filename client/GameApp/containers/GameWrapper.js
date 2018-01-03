import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Controls from "../provider/Controls";
import Boot from "../states/Boot";
import Game from "../states/Game";
import Over from "../states/Over";
import Preload from "../states/Preload";
import Sync from "../states/Sync";
import { setGame } from "../redux/actions";
import settings from "../settings";

class GameWrapper extends React.Component {
  componentDidMount() {
    Controls.Arrows.enable();

    // Create a new phaser game
    const game = new Phaser.Game(
      settings.render.width,
      settings.render.height,
      Phaser.CANVAS,
      settings.render.node
    );

    // Adding all required phaser-game-states
    game.state.add("Boot", Boot);
    game.state.add("Preload", Preload);
    game.state.add("Game", Game);
    game.state.add("Over", Over);
    game.state.add("Sync", Sync);

    this.props.setGame(game);

    game.state.start("Boot"); // starting the boot state
  }

  render() {
    return this.props.gameIsRunning ? (
      <div id="js-launch-phaser-game" />
    ) : (
      <Redirect to="/score" />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  gameIsRunning: state.gameIsRunning
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  setGame: game => {
    dispatch(setGame(game));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GameWrapper);
