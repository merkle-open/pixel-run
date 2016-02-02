(function(window, undefined) {
    'use strict';

    var Container = window.Container;

    function Text(game, player, score) {
        this.template = '{name}: {score}';
        this.injector = game;
        this.player = player;
        this.score = score || 0;
        this.opts = {
            fontSize: '100px'
        };

        return this;
    }

    Text.prototype = {
        get: function() {
            return Util.replace(this.template, {
                name: this.player,
                score: this.score
            });
        },
        set: function(score) {
            this.score = score;
        },
        increase: function(add) {
            this.score = (this.score + add);
        },
        option: function(key, value) {
            this.opts[key] = value;
        },
        add: function(x, y) {
            var wtype = Container.settings.worldType;

            x = x || 0;
            y = y || 0;

            this.$text = this.injector.add.text(x, y, this.get(), {
                font: this.opts.fontSize + ' Roboto',
                fill: Container.settings.worlds[wtype].contrast || '#ffffff'
            });

            this.$text.fixedToCamera = true;
            //this.$text.anchor.set();
        },
        $update: function(score) {
            this.$text.setText(this.get());
        }
    };

    window.Factory.Text = Text;

})(window);
