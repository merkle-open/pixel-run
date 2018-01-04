import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { addPlayerName } from "../../redux/actions";
import StepHeader from "../../components/StepHeader";
import StepFooter from "../../components/StepFooter";
import StepInput from "../../components/StepInput";
import techieNude from "../../assets/img/avatars/nude/techie.png";
import designerNude from "../../assets/img/avatars/nude/designer.png";
import consultantNude from "../../assets/img/avatars/nude/consultant.png";

const images = [techieNude, designerNude, consultantNude];

class PlayerSelection extends React.Component {
  componentDidUpdate() {}
  render() {
    return (
      <div className="step">
        <StepHeader
          wordmark="Individuell. Auswahl. Avatar."
          quetion="Spielerauswahl"
        />
        <div className="body space-xl">
          <StepInput images={images} onInput={this.props.addPlayerName} />
        </div>
        <StepFooter
          link="/world"
          active={this.props.playerNames.some(p => p.length > 0)}
        />
      </div>
    );
  }
}

PlayerSelection.propTypes = {
  playerNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  addPlayerName: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  playerNames: state.playerNames
});

const mapDisptachToProps = dispatch => ({
  addPlayerName: e => {
    dispatch(addPlayerName(e.target.value, e.target.dataset.index));
  }
});

export default connect(mapStateToProps, mapDisptachToProps)(PlayerSelection);
