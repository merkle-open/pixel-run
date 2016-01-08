(function(window, undefined) {
    'use strict';

    Root.Renderer = Root.$createModule('renderer', {
        bird: {
            maxAngle: 20
        }
    }, function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;

        this.update = function() {
            var game = Root.Game.get();
            var bird = Root.World.bird;
            var pipes = Root.World.pipes;

            module._restartIfDead(game, Root.World.bird);
            module._killOnOverlap(game, bird, pipes, module, function() {
                game.state.start('main');
            });
        };

        this._restartIfDead = function(game, target) {
            if(target.inWorld === false) {
                Root.Game.restart();
            }
        };

        this._killOnOverlap = function(game, bird, pipes, ctx, restart) {
            game.physics.arcade.overlap(bird, pipes, restart);
        };

        this._angleObject = function(item, maxAngle) {
            if (item.angle < module.settings.bird.maxAngle) {
                item.angle += 1;
            }
        };

    });

})(window);
