(function(window, undefined) {
    'use strict';

    var root = window.Container;

    function LoaderHandler(game, type, name, path) {
        this.type = type;
        this.name = name;
        this.path = path;

        return this.$generateHandler();
    };

    LoaderHandler.prototype = {
        image: function(game, name, path) {
            return function() {
                game.load.image(Util.hyphenate(key), path);
            }
        },
        sprite: function(game, name, path, x, y) {
            return function() {
                game.load.spritesheet(name, path, x, y);
            }
        },
        tilemap: function(game, name, path) {
            return function() {
                return new window.Factory.Tilemap(game, name, path);
            }
        }
    };


    window.Factory.LoaderHandler = LoaderHandler;

})(window);
