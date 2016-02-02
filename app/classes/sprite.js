/**
 * /app/classes/sprite.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var root = window.Container;
    var util = window.Util;
    var id = 0;

    /**
     * Sprite constructor for creating Spritesheets for background
     * images or player sprites.
     * @namespace Factory
     * @param {Game} game           Game injector point
     * @param {String} image        Name of the (loaded) asset
     * @param {String} path         Path to the asset image (optional)
     */
    function Sprite(game, image, path) {
        this.$id = id++;
        this.injector = game;
        this.image = image;
        this.path = path;

        return this;
    };

    Sprite.prototype = Object.create(Phaser.Sprite.prototype);
    Sprite.prototype.constructor = Sprite;

    /**
     * If the asset hasn't been loaded in the boot state you
     * can load the image with this method.
     * @param  {String} path        Optional path (if not set in ctor)
     * @return {Sprite} this        Return the object itself for chaning
     */
    Sprite.prototype.load = function(path) {
        path = util.default(path, this.path);
        this.injector.load.image(this.image, path);
        return this;
    };

    Sprite.prototype.add = function(x, y) {
        x = util.default(x, 0);
        y = util.default(y, 0);
        this.injector.add.sprite(x, y, this.image);
        return this;
    };

    window.Factory.Sprite = Sprite;

})(window);
