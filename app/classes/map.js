(function(window, undefined) {
    'use strict';

    var root = window.Container;

    function MapGenerator(options) {
        this.tilemap = options.tilemap;
        this.settings = options.gameSettings;
        this.factory = {};
        return this;
    }

    MapGenerator.protoytpe = {
        updater: function(handler) {
            return function() {
                handler(root, window);
            }
        },
        $createTilemap: function(game) {
            var map = new Factory.Tilemap(game, this.tilemap.name);
            map.addToGame(game);
            map.addImage(this.tilemap.tile.name, this.tilemap.tile.id);
            map.createLayer(this.tilemap.layer.name); // Works until here
            map.resize(this.tilemap.layer.name);
        },
        apply: function(handler) {
            return handler(this);
        }
    };

    window.Factory.Map = MapGenerator;

})(window);
