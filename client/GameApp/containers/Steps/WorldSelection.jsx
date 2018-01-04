import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import StepHeader from "../../components/StepHeader";
import StepFooter from "../../components/StepFooter";
import WorldSelect from "../../components/WorldSelect";
import { addWorld } from "../../redux/actions";
import settings from "../../settings";

class WorldSelection extends React.Component {
  componentDidUpdate() {}
  render() {
    return (
      <div className="step">
        <StepHeader
          wordmark="Individuell. Auswahl. Avatar."
          quetion="Spielerauswahl"
        />
        <div className="body space-xl">
          <WorldSelect
            worlds={settings.worlds}
            activeWorld={this.props.activeWorld}
            onSelection={this.props.addWorld}
          />
        </div>
        <StepFooter link="/fun" active={!!this.props.activeWorld} />
      </div>
    );
  }
}

WorldSelection.propTypes = {
  activeWorld: PropTypes.string.isRequired,
  addWorld: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  activeWorld: state.world
});

const mapDisptachToProps = dispatch => ({
  addWorld: e => {
    dispatch(addWorld(e.target.dataset.world));
  }
});

export default connect(mapStateToProps, mapDisptachToProps)(WorldSelection);
