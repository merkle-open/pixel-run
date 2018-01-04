import { Debugger } from "../provider/Util";

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
    this.$id = id;
    id += 1;
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
    // TODO: validate legimitaion of Util.default
    const savePath = path || this.path;
    this.injector.load.image(this.image, savePath);
    return this;
  }

  /**
   * Adds the sprite to a specific x and y position in the game
   * @param  {Number} x           Coordinates on X
   * @param  {Number} y           Coordinates on Y
   * @return {Spritesheet} $internal
   */
  add(x, y) {
    Debugger.log("Sprite mounted ->", this.image, x, y);
    const saveX = x || 0;
    const saveY = y || 0;
    this.$internal = this.injector.add.sprite(saveX, saveY, this.image);
    return this.$internal;
  }
}

export default Sprite;
