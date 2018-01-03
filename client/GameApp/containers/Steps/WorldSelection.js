import React from "react";
import { connect } from "react-redux";

import StepHeader from "../../components/StepHeader";
import StepFooter from "../../components/StepFooter";
import WorldSelect from "../../components/WorldSelect";
import { addWorld } from "../../redux/actions";
import settings from "../../settings";

class WorldSelection extends React.Component {
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
        <StepFooter link="/fun" active={this.props.activeWorld ? true : false}/>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  activeWorld: state.world
});

const mapDisptachToProps = (dispatch, ownProps) => ({
  addWorld: e => {
    dispatch(addWorld(e.target.dataset.world));
  }
});

export default connect(mapStateToProps, mapDisptachToProps)(WorldSelection);
