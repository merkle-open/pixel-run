import Util from "../provider/Util";

const debug = new Util.Debugger("Sprite.class");
let id = 0;

/**
 * Sprite constructor for creating Spritesheets for background
 * images or player sprites.
 * @constructor
 * @param {Game} game           Game injector point
 * @param {String} image        Name of the (loaded) asset
 * @param {String} path         Path to the asset image (optional)
 */
class Sprite extends Phaser.Sprite {
  constructor(game, image, path) {
    super();
    this.$id = id++;
    this.injector = game;
    this.image = image;
    this.path = path;
    this.setScaleMinMax(1, 1);

    return this;
  }

  /**
   * If the asset hasn't been loaded in the boot state you
   * can load the image with this method.
   * @param  {String} path        Optional path (if not set in ctor)
   * @return {Sprite} this        Return the object itself for chaning
   */
  load(path) {
    path = Util.default(path, this.path);
    this.injector.load.image(this.image, path);
    return this;
  }

  /**
   * Adds the sprite to a specific x and y position in the game
   * @param  {Number} x           Coordinates on X
   * @param  {Number} y           Coordinates on Y
   * @return {Spritesheet} $internal
   */
  add(x, y) {
    debug.log("Sprite mounted ->", this.image, x, y);
    x = Util.default(x, 0);
    y = Util.default(y, 0);
    this.$internal = this.injector.add.sprite(x, y, this.image);
    return this.$internal;
  }
}

export default Sprite;
