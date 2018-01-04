import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { toggleGameState } from "../../redux/actions";

const RedirectToGame = ({ shouldRedirect }) =>
  shouldRedirect ? <Redirect to="/game" /> : null;

class HaveFun extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.toggleGameState();
      this.setState({
        redirect: true
      });
    }, 1000);
  }

  render() {
    return (
      <div className="step">
        <div className="body">
          <h5 className="fullscreen-text">Have Fun!</h5>
        </div>
        <RedirectToGame shouldRedirect={this.state.redirect} />
      </div>
    );
  }
}

RedirectToGame.propTypes = {
  shouldRedirect: PropTypes.bool.isRequired
}

HaveFun.propTypes = {
  toggleGameState: PropTypes.func.isRequired
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => ({
  toggleGameState: () => {
    dispatch(toggleGameState());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HaveFun);
