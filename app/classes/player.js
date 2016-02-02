/**
 * /app/classes/player.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    var root = window.Container;

    /**
     * Creates a new player instance
     * @param {Game} game           Reference to the game
     * @param {Number} index        Index of the player (count)
     * @param {Number} posX         Position on x-axis
     * @param {Number} posY         Position on y-axis
     * @param {String} variation    Special variation of player skin
     */
    function Player(game, index, posX, posY, variation) {
        this.$baseSprite = root.settings.game.players.baseName;
        this.$basePath = root.settings.game.players.basePath + root.settings.worldType + '/';
        this.$mimeType = root.settings.game.players.mimeType;
        this.id = index;
        this.type = variation;
        this.jumpKey = root.settings.game.players.keymap[index];
        this.injector = game;
        this.doubleJump = false;
        this.score = null;

        Phaser.Sprite.call(this, game, posX, posY, this.$getSpritesheet());
        game.add.existing(this);

        return this;
    };

    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    /**
     * Initializes a player with the right physic settings
     */
    Player.prototype.init = function() {
        this.injector.physics.arcade.enable(this);
        this.body.bounce.y = root.settings.game.players.bounce.y;
        this.body.gravity.y = root.settings.game.players.gravity.y;
        this.body.collideWorldBounds = true;
        this.body.linearDamping = 1;
    };

    /**
     * Set collision bounds for the player with a target
     * @param  {*} target               Target to collide with
     * @param  {Function} die           Die handler
     */
    Player.prototype.collide = function(target, die) {
        this.injector.game.arcade.collide(this, target, die, null);
    };

    /**
     * Constantly run with the velocity set in the game settings of the players
     */
    Player.prototype.run = function() {
        this.body.velocity.x = root.settings.game.players.velocity.x;
    };

    /**
     * Let the player jump
     */
    Player.prototype.jump = function() {
        if(this.body.onFloor()) {
            Container.Audio.jump.play();
            this.body.velocity.y = root.settings.game.players.velocity.y;
        }
    };

    /**
     * Let a player die
     */
    Player.prototype.die = function() {
        var session = Session[$index.session[this.id]];

        Container.Audio.die.play();
        session.text.option('extension', '(dead)');
        session.text.$update();
        session.score = this.score;
        this.kill();
    };

    /**
     * Generates the action key settings and creates the right
     * cursor for each player instance.
     * @return {Key}            Phaser key stack
     */
    Player.prototype.$addActionKey = function() {
        var cursors = this.injector.input.keyboard.createCursorKeys();
        return this.$actionKey = cursors[this.jumpKey];
    };

    /**
     * General player update method, containing the jump logic
     * and die stuff
     */
    Player.prototype.$update = function() {
        this.score = Util.calculate.score(this.x);
        if(this.y === Container.settings.render.height - 20) {
            this.die();
        }

        if(this.x <= Container.game.camera.view.x - 70) {
            this.die();
        }

        var listenTo = this.$addActionKey();
        if(listenTo.isDown) {
            this.jump();
        }
    };

    /**
     * Generates the path to the right spritesheet of each
     * player and its variation
     * @return {String}         Path to the asset
     */
    Player.prototype.$getSpritesheet = function() {
        this.type = this.type === undefined ? '-' + root.settings.game.players.variations[this.id] : '';
        return this.$baseSprite + root.settings.worldType + this.type;
    };

    window.Factory.Player = Player;

})(window);
