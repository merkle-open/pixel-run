import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const StepFooter = ({ link, active }) => (
  <footer>
    {active ? (
      <Link to={link} className="icon icon-arrow-right next" tabIndex={0} />
    ) : null}
  </footer>
);

StepFooter.defaultProps = {
  active: true
}

StepFooter.propTypes = {
  link: PropTypes.string.isRequired,
  active: PropTypes.bool
}

export default StepFooter;
