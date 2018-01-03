import React from "react";
import { Link } from "react-router-dom";

const StepFooter = ({ link, active = true }) => {
  return (
    <footer>
      {active ? (
        <Link to={link} className="icon icon-arrow-right next" tabIndex={4} />
      ) : null}
    </footer>
  );
};

export default StepFooter;
