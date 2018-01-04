import React from "react";
import PropTypes from "prop-types";

const StepInput = ({ images, onInput }) => (
  <div
    className="grid js-s2-in"
    data-process="input"
    data-read="js-input"
    data-key="players"
  >
    <div className="col-1-3" data-value="techie">
      <img src={images[0]} alt="Techie" />
      <input
        type="text"
        className="center js-input"
        placeholder="Player 1"
        tabIndex={0}
        data-index="0"
        onChange={onInput}
      />
    </div>
    <div className="col-1-3" data-value="designer">
      <img src={images[1]} alt="Designer" />
      <input
        type="text"
        className="center js-input"
        placeholder="Player 2"
        tabIndex={0}
        data-index="1"
        onChange={onInput}
      />
    </div>
    <div className="col-1-3" data-value="consultant">
      <img src={images[2]} alt="Consultant" />
      <input
        type="text"
        className="center js-input"
        placeholder="Player 3"
        tabIndex={0}
        data-index="2"
        onChange={onInput}
      />
    </div>
  </div>
);

StepInput.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  onInput: PropTypes.func.isRequired
};

export default StepInput;
