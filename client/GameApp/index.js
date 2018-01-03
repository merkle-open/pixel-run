// Global import of pixi and p2 needed because phaser needs it
// and phaser is not quite there with the whole npm packaging
// for pixi and p2 an alias was defined in webpack.config.js
import "pixi";
import "p2";

import Phaser from "phaser";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { CSSTransitionGroup } from "react-transition-group";

import store from "./redux/store";
import StartScreen from "./containers/Steps/StartScreen";
import PlayerSelection from "./containers/Steps/PlayerSelection";
import WorldSelection from "./containers/Steps/WorldSelection";
import HaveFun from "./containers/Steps/HaveFun";
import GameWrapper from "./containers/GameWrapper";
import Scores from "./containers/Scores";
import Controls from "./provider/Controls";

// Import all styles gloal
// TODO: split these style and attach their component
import "./assets/css/reset.css";
import "./assets/css/grid.css";
import "./assets/css/typo.css";
import "./assets/css/global.scss";
import "./assets/css/error.scss";
import "./assets/css/resume.scss";
import "./assets/css/steps.scss";
import "./assets/css/score.scss";

import "./assets/img/favicon.png";

Controls.Arrows.disable();

ReactDOM.render(
  <Provider store={store}>
    <MemoryRouter>
      <div>
        <Route exact path="/" component={StartScreen} />
        <Route exact path="/player" component={PlayerSelection} />
        <Route exact path="/world" component={WorldSelection} />
        <Route exact path="/fun" component={HaveFun} />
        <Route exact path="/game" component={GameWrapper} />
        <Route exact path="/score" component={Scores} />
      </div>
    </MemoryRouter>
  </Provider>,
  document.getElementById("root")
);
