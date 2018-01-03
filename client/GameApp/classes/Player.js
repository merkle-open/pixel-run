import Util from "../provider/Util";
import store from "../redux/store";
import {
  updateTextOfACurrentPlayer,
  updateScoreOfACurrentPlayer
} from "../redux/actions";

const KILL_BOUNDS = 20;

const debug = new Util.Debugger("Player.class");

/**
 * Creates a new player instance
 * @constructor
 * @param {Game} game           Reference to the game
 * @param {Number} index        Index of the player (count)
 * @param {Number} posX         Position on x-axis
 * @param {Number} posY         Position on y-axis
 * @param {String} variation    Special variation of player skin
 */
class Player extends Phaser.Sprite {
  constructor(game, index, posX, posY, variation) {
    let baseSprite = store.getState().settings.game.players.baseName;
    let type =
      variation === undefined
        ? `-${store.getState().settings.game.players.variations[index]}`
        : "";
    let sprite = baseSprite + store.getState().world + type;

    super(game, posX, posY, sprite);

    this.$basePath = `${store.getState().settings.game.players.basePath +
      store.getState().world}/`;
    this.$mimeType = store.getState().settings.game.players.mimeType;
    this.jumpOn = store.getState().settings.game.jumpOn;
    this.id = index;
    this.type = variation;
    this.jumpKey = store.getState().settings.game.players.keymap[index];
    this.injector = game;
    this.doubleJump = false;
    this.score = null;
    this.dead = false;

    this.$addActionKey();
    game.add.existing(this);
    debug.log("New player initiaded on x/y ->", posX, posY);

    return this;
  }

  /**
   * Initializes a player with the right physic settings
   */
  init() {
    this.injector.physics.arcade.enable(this);
    this.body.bounce.y = store.getState().settings.game.players.bounce.y;
    this.body.gravity.y = store.getState().settings.game.players.gravity.y;
    this.body.collideWorldBounds = true;
    this.body.linearDamping = 1;
  }

  /**
   * Set collision bounds for the player with a target
   * @param  {*} target               Target to collide with
   * @param  {Function} die           Die handler
   */
  collide(target, die) {
    this.injector.game.arcade.collide(this, target, die, null);
  }

  /**
   * Constantly run with the velocity set in the game settings of the players
   */
  run() {
    this.body.velocity.x = store.getState().settings.game.players.velocity.x;
  }

  /**
   * Let the player jump
   */
  jump() {
    if (this.body.onFloor()) {
      store
        .getState()
        .audio.find(a => a.name == "jump")
        .play();
      this.body.velocity.y = store.getState().settings.game.players.velocity.y;
    }
  }

  /**
   * Let a player die
   */
  die() {
    debug.log("Player died with id ->", this.id);
    debug.log("Updating player session ->", this.id);

    store
      .getState()
      .audio.find(a => a.name == "die")
      .play();
    this.$updateText("dead");
    store.dispatch(updateScoreOfACurrentPlayer(this.id, this.score));
    this.dead = true;
    this.kill();
  }

  /**
   * Update the players text with value
   * @return {String}         Value
   */
  $updateText(val) {
    if (val !== undefined) {
      debug.log("Updating player text ->", this.id);
      const currentPlayer = store
        .getState()
        .currentPlayers.find(p => p.id == this.id);
      currentPlayer.text.option("extension", `(${val})`);
      store.dispatch(updateTextOfACurrentPlayer(this.id, currentPlayer.text));
      currentPlayer.text.$update();
    }
  }

  /**
   * Generates the action key settings and creates the right
   * cursor for each player instance.
   * @return {Key}            Phaser key stack
   */
  $addActionKey() {
    debug.log("Player created actionKey ->", this.jumpKey);
    this.$actionKey = store.getState().cursors[this.jumpKey];
    return this.$actionKey;
  }

  /**
   * General player update method, containing the jump logic
   * and die stuff
   */
  $update() {
    this.score = Util.calculate.score(this.x);
    if (
      this.y >=
      store.getState().settings.game.deadline -
        store.getState().settings.game.players.height -
        KILL_BOUNDS
    ) {
      this.die();
    }

    if (this.x <= store.getState().game.camera.view.x - 70) {
      this.die();
    }
    const listener = this.jumpOn === "push" ? "isDown" : "isUp";
    if (this.$actionKey[listener]) {
      this.jump();
    }
  }
}

export default Player;
