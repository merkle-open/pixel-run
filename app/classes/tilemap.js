(function(window, undefined) {
    'use strict';

    var root = window.Container;

    function Tilemap(game, name) {
        this.name = name;
        this.injector = game;
        this.map = null;
        this.layers = {};
        return this;
    };

    Tilemap.prototype = Object.create(Phaser.Tilemap.prototype);
    Tilemap.prototype.constructor = Tilemap;

    Tilemap.prototype.addImage = function(tileset, asset) {
        return this.map.addTilesetImage(tileset, asset);
    };

    Tilemap.prototype.addToGame = function(game) {
        game = game || this.game || null;
        return this.map = game.add.tilemap(this.name);
    };

    Tilemap.prototype.createLayer = function(name) {
        var layer = this.map.createLayer(name);
        return this.layers[name] = layer;
    };

    Tilemap.prototype.setCollision = function(layer, start, end) {
        try {
            var collide = this.map.setCollisionBetween(start, end, true, layer);
            console.log(collide)
            return collide;
        } catch(noCollide) {
            throw new Error('Tilemap.setCollision faield: ' + noCollide.message);
        }
    };

    Tilemap.prototype.resize = function(targetLayer) {
        try {
            this.layers[targetLayer].resizeWorld();
        } catch(resizeErr) {
            throw new Error('Tilemap.resize failed: ' + resizeErr.message);
        }
    };

    window.Factory.Tilemap = Tilemap;

})(window);
