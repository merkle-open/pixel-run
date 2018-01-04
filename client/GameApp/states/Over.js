import store from "../redux/store";
import { toggleGameState } from "../redux/actions";

class Over {
  init(gameState) {
    this.state = gameState;
  }

  create() {
    this.sate = !this.state;
    store.dispatch(toggleGameState());
    store.getState().game.state.start("Sync");
  }
}

export default Over;
