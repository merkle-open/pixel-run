import React from "react";
import ScoreEntry from "../components/ScoreEntry";

class ScoreScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      scores: []
    };
  }

  componentDidMount() {
    this.fetchScores();
    window.setInterval(this.fetchScores, 10 * 1000 || 5000);
  }

  fetchScores() {
    fetch("/api/get/scores")
      .then(scores => scores.json())
      .then(scores => {
        this.setState({
          scores
        });
      });
  }

  render() {
    return (
      <div className="content">
        <div className="grid">
          <div className="col-1-1">
            <div className="score-wrapper paper-layer" id="js-fetch-scores">
              <h1>Highscores.</h1>
              <table>
                <thead>
                  <tr>
                    <td>Platz</td>
                    <td>Score</td>
                    <td>Name</td>
                    <td>Welt</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.scores.map(score => (
                    <ScoreEntry key={score.$id} {...score} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScoreScreen;
