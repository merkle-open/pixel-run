import React from "react";
import { Link } from "react-router-dom";

import StepHeader from "../../components/StepHeader";
import StepFooter from "../../components/StepFooter";
import gameThumbnail from "../../assets/img/thumbnails/game.png";

const StartScreen = () => {
  return (
    <div className="step">
      <StepHeader wordmark="Wilkommen. Spiel. Challenge. Jump" />
      <div className="body">
        <img
          className="background-image"
          src={gameThumbnail}
          alt="Game Screenshot"
        />
      </div>
      <StepFooter link="/player" />
    </div>
  );
};

export default StartScreen;
