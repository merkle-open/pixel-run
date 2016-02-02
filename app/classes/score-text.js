/**
 * /app/classes/score-text.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var Container = window.Container;

    /**
     * Score text base class which generates the
     * text with the Util.Replacer class.
     * @param {Game} game           Game reference
     * @param {String} player       Name of the player
     * @param {Number} score        Current game score
     */
    function ScoreText(game, player, score) {
        var wtype = Container.settings.worldType;
        this.template = '{name}: {score} {extension}';
        this.injector = game;
        this.player = player;
        this.score = score || 0;
        this.opts = {
            extension: '',
            fontSize: '20px',
            fill: Container.settings.worlds[wtype].contrast || '#ffffff'
        };

        return this;
    }

    ScoreText.prototype = {
        /**
         * Returns the compiled text
         * @return {String}         Compiled text
         */
        get: function() {
            return Util.replace(this.template, {
                name: this.player,
                score: this.score,
                extension: this.opts.extension
            });
        },
        /**
         * Set the score with a new value and updates the text.
         * @param  {Number} score   Score value
         */
        set: function(score) {
            this.score = score;
            this.$update();
        },
        /**
         * Increase the score with a value and updates the text.
         * @param  {Number} add     Increasement value
         */
        increase: function(add) {
            this.score = (this.score + add);
            this.$update();
        },
        /**
         * Add a new option to the internal options.
         * @param  {String} key     Key of option
         * @param  {*} value        Option value
         */
        option: function(key, value) {
            this.opts[key] = value;
        },
        /**
         * Add the text to a specific position on x and y. Set
         * the third parameter to `true` to position it relative to
         * the camera bounds.
         * @param  {Number} x                   X axis position
         * @param  {Number} y                   Y axis position
         * @param  {Boolean} fixedToCamera      If text should be fixed to camera
         * @return {Text}
         */
        add: function(x, y, fixedToCamera) {
            var wtype = Container.settings.worldType;

            x = x || 0;
            y = y || 0;

            this.$text = this.injector.add.text(x, y, this.get(), {
                font: this.opts.fontSize + ' Roboto',
                fill: this.opts.fill
            });

            this.$text.fixedToCamera = fixedToCamera || false;
            if(fixedToCamera) {
                this.$text.cameraOffset.setTo(x, y);
            }

            return this;
        },
        /**
         * Updates the internal text. This method is private and should
         * not be called from outside.
         * @param  {[type]} score [description]
         * @return {[type]}       [description]
         */
        $update: function(score) {
            this.$text.setText(this.get());
        }
    };

    window.Factory.ScoreText = ScoreText;

})(window);
