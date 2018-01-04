import Phaser from "phaser-ce";
import { Debugger } from "../provider/Util";


/**
 * Constructor of the Tilemap Class
 * @constructor
 * @param {Game} game           Game injector point
 * @param {String} name         Name of the tilemap
 */
class Tilemap extends Phaser.Tilemap {
  constructor(game, name) {
    super();
    this.name = name;
    this.injector = game;
    this.map = null;
    this.layers = {};
    return this;
  }

  /**
   * Adds a new tileset image to the tilemap. Needed is
   * the tileset itself and the tile asset.
   * @param  {String} tileset         Name of the tileset
   * @param  {String} asset           Asset of the tileset
   */
  addImage(tileset, asset) {
    Debugger.log("Tilemap image added with asset ->", tileset, asset);
    return this.map.addTilesetImage(tileset, asset);
  }

  /**
   * Add the tilemap to the game, the constructor game
   * can be used, alternatively you can pass a new game param
   * to this method.
   * @param  {Game} game          Phaser game
   * @return {Tilemap}            The tilemap itself
   */
  addToGame(game) {
    const saveGame = game || this.game;
    this.map = saveGame.add.tilemap(this.name);
    return this.map;
  }

  /**
   * Create a new layer defined in the tilemap itself.
   * @param  {String} name        Name of the layer
   * @return {TilemapLayer}       Phaser tilemap layer
   */
  createLayer(name) {
    Debugger.log("Layer created ->", name);
    const layer = this.map.createLayer(name);
    this.layers[name] = layer;
    return this.layers[name];
  }

  /**
   * Set collision bounds between start and endpoint on
   * a specific layer. Needed for the players to collide
   * with the tilemap itself!
   * @param  {String} layer       Name of the layer
   * @param  {Number} start       Startpoint of collision
   * @param  {Number} end         Endpoint of collision
   */
  setCollision(layer, start, end) {
    Debugger.log("Collision set on layer with start/end ->", layer, start, end);
    try {
      const collide = this.map.setCollisionBetween(start, end, true, layer);
      return collide;
    } catch (noCollide) {
      throw new Error(`Tilemap.setCollision faield: ${noCollide.message}`);
    }
  }

  /**
   * Resize the world with the size of the target layer.
   * @param  {String} targetLayer     Layer to get size from
   */
  resize(targetLayer) {
    try {
      this.layers[targetLayer].resizeWorld();
      Debugger.log("World resized to the layer ->", targetLayer);
    } catch (resizeErr) {
      Debugger.throw(`Tilemap.resize failed: ${resizeErr.message}`, 0);
    }
  }
}

export default Tilemap;
