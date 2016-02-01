(function(window, undefined) {
    'use strict';

    var Contianer = window.Container;

    Container.Procedures = function(game) {
        // Empty class wrapper
    };

    Container.Procedures.prototype = {
        preload: function() {
            Container.procedures = {};
        },
        create: function() {
            /**
             * Adding a tilemap to the game procedure
             * @procedure addTilemap
             */
            new Factory.Procedure('addTilemap', function(data) {
                var map = new Factory.Tilemap(data.game, data.tilemap);
                map.addToGame(data.game);
                map.addImage(data.tile.name, data.tile.asset);
                var layer = map.createLayer(data.layer.name);
                map.setCollision(data.layer.name, data.layer.start, data.layer.end);
                map.resize(data.layer.name);

                return {
                    tilemap: map,
                    layer: layer
                };
            });

            this.state.start('Game');
        }
    };

})(window);
