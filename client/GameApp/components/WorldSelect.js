import React from "react";

const WorldSelect = ({ worlds, activeWorld, onSelection }) => {
  return (
    <div
      className="grid grid-full grid-border grid-lg-img js-s3-in"
      data-process="select"
      data-use="world"
      data-key="world"
    >
      {worlds.map((world, index) => (
        <div
          key={index}
          className={`col-1-3 ${
            world.name === activeWorld ? "selected" : ""
          } js-selectable`}
          data-world={world.name}
          tabIndex={index + 1}
          onKeyPress={onSelection}
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
};

export default WorldSelect;
