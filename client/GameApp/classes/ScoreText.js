import Util, { Debugger } from "../provider/Util";
import store from "../redux/store";
import settings from "../settings";

/**
 * Score text base class which generates the
 * text with the Util.Replacer class.
 * @constructor
 * @param {Game} game           Game reference
 * @param {String} player       Name of the player
 * @param {Number} score        Current game score
 */
class ScoreText {
  constructor(game, player, score) {
    const wtype = store.getState().world;
    this.template = "{name}: {score} {extension}";
    this.injector = game;
    this.player = player;
    this.score = score || 0;
    this.opts = {
      extension: "",
      fontSize: "20px",
      fontFamily: "Arial",
      fill: settings.worlds.find(w => w.name === wtype).contrast || "#ffffff"
    };

    return this;
  }

  /**
   * Returns the compiled text
   * @return {String}         Compiled text
   */
  get() {
    return Util.replace(this.template, {
      name: this.player,
      score: this.score,
      extension: this.opts.extension
    });
  }

  /**
   * Set the score with a new value and updates the text.
   * @param  {Number} score   Score value
   */
  set(score) {
    this.score = score;
    this.$update();
  }

  /**
   * Increase the score with a value and updates the text.
   * @param  {Number} add     Increasement value
   */
  increase(add) {
    this.score = this.score + add;
    this.$update();
  }

  /**
   * Add a new option to the internal options.
   * @param  {String} key     Key of option
   * @param  {*} value        Option value
   */
  option(key, value) {
    this.opts[key] = value;
  }

  /**
   * Add the text to a specific position on x and y. Set
   * the third parameter to `true` to position it relative to
   * the camera bounds.
   * @param  {Number} x                   X axis position
   * @param  {Number} y                   Y axis position
   * @param  {Boolean} fixedToCamera      If text should be fixed to camera
   * @return {Text}
   */
  add(x, y, fixedToCamera) {
    const saveX = x || 0;
    const saveY = y || 0;

    // Create basic text node and inject it to the game
    this.$text = this.injector.add.text(saveX, saveY, this.get(), {
      font: `${this.opts.fontSize} ${this.opts.fontFamily}`,
      fill: this.opts.fill
    });

    // Is the text fixed to the camera?
    this.$text.fixedToCamera = fixedToCamera || false;
    if (fixedToCamera) {
      this.$text.cameraOffset.setTo(x, y);
    }

    Debugger.log(
      "Text added with props x, y, fixed ->",
      saveX,
      saveY,
      fixedToCamera
    );

    return this;
  }

  /**
   * Updates the internal text. This method is private and should
   * not be called from outside.
   */
  $update() {
    this.$text.setText(this.get());
  }
}

export default ScoreText;
