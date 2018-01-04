import React from "react";
import PropTypes from "prop-types";

const isSelected = (world, activeWorld) =>   world.name === activeWorld;

const WorldSelect = ({ worlds, activeWorld, onSelection }) => (
  <div
    className="grid grid-full grid-border grid-lg-img js-s3-in"
    data-process="select"
    data-use="world"
    data-key="world"
  >
    {worlds.map((world, index) => (
      <div
        key={world.name}
        className={`col-1-3 ${
          isSelected(world, activeWorld) ? "selected" : ""
        } js-selectable`}
        data-world={world.name}
        tabIndex={index + 1}
        onKeyPress={onSelection}
        role="switch"
        aria-checked={isSelected(world, activeWorld)}
      >
        <img
          className="world-image"
          src={world.image}
          alt={`${world.name} World`}
        />
      </div>
    ))}
  </div>
);

WorldSelect.propTypes = {
  worlds: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeWorld: PropTypes.string.isRequired,
  onSelection: PropTypes.func.isRequired
}

export default WorldSelect;
