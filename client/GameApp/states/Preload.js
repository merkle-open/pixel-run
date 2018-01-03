import store from "../redux/store";

class Preload {
  constructor() {
    this.ready = false;
    this.error = null;
    this.background = null;
  }

  preload() {
    this.physics.arcade.gravity.y =
      store.getState().settings.physics.arcadeGravity || 200;
    this.ready = true;

    try {
      this.physics.startSystem(Phaser.Physics.ARCADE);
    } catch (notReady) {
      this.error = notReady;
    }
  }

  create() {
    if (this.ready) {
      this.state.start("Game");
    } else {
      throw this.error;
    }
  }

  quit() {
    this.ready = false;
  }
}

export default Preload;
