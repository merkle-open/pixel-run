import { Debugger } from "../provider/Util";
import store from "../redux/store";

class Sync {
  create() {
    this.postProgress = [];
    const { currentPlayers } = store.getState();
    const amount = currentPlayers.length;
    Debugger.log(`Syncing scores over AJAX for ${amount} players ...`);

    currentPlayers.forEach(currentPlayer =>
      this.sendScores(currentPlayer)
        .then(res => {
          this.postProgress.push(res);
          Sync.logPostProgress(amount, this.postProgress);
        })
        .catch(error => console.log(error))
    );
  }

  static logPostProgress(amount, postProgress) {
    const percentage = 100 / amount * postProgress.length;
    Debugger.log(
      [
        "Scores saved for",
        postProgress.length,
        "of",
        amount,
        "players",
        `(${percentage}%)`
      ].join(" ")
    );
  }
}

Sync.prototype.sendScores = currentPlayer =>
  new Promise((resolve, reject) => {
    fetch("/api/save/score", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        name: currentPlayer.name,
        score: currentPlayer.score,
        world: store.getState().world,
        username: currentPlayer.username
      })
    })
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export default Sync;
