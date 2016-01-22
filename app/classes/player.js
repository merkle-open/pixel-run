(function(window, undefined) {
    'use strict';

    var root = window.Container;

    function Player(game, index, posX, posY, variation) {
        this.$baseSprite = root.settings.game.players.baseName;
        this.$basePath = root.settings.paths.player;
        this.$mimeType = root.settings.game.players.mimeType;
        this.id = index;
        this.type = variation;
        this.jumpKey = root.settings.game.players.keymap[index];
        this.injector = game;
        this.doubleJump = false;

        Phaser.Sprite.call(this, game, posX, posY, this.$getSpritesheet());
        game.add.existing(this);

        return this;
    };

    Player.prototype = Object.create(Phaser.Sprite.prototype);
    Player.prototype.constructor = Player;

    Player.prototype.$getSpritesheet = function() {
        this.type = this.type === undefined ? '-' + root.settings.game.players.variations[index] : '';
        return this.$baseSprite + this.type;
    };

    Player.prototype.$addActionKey = function() {
        var cursors = this.injector.input.keyboard.createCursorKeys();
        return this.$actionKey = cursors[this.jumpKey];
    };

    Player.prototype.$update = function() {
        var listenTo = this.$addActionKey();
        if(listenTo.isDown) {
            this.jump();
        }
    };

    Player.prototype.init = function() {
        this.injector.physics.arcade.enable(this);
        this.body.bounce.y = root.settings.game.players.bounce.y;
        this.body.gravity.y = root.settings.game.players.gravity.y;
        this.body.collideWorldBounds = true;
    };

    Player.prototype.collide = function(target, die) {
        this.injector.game.arcade.collide(this, target, die, null);
    };

    Player.prototype.run = function() {
        this.body.velocity.x = root.settings.game.players.velocity.x;
    };

    Player.prototype.jump = function() {
        if(this.body.touching.down) {
            this.body.velocity.y = root.settings.game.players.velocity.y;
        }
        /* DOUBLE JUMP LOGIC
        if(this.body.touching.down && !this.doubleJump) {
            this.body.velocity.y = -350;
            this.doubleJump = true;
        } else if(!this.body.touching.down && this.doubleJump) {
            this.body.velocity.y = -550;
            this.doubleJump = false;
        } */
    };

    window.Factory.Player = Player;

})(window);
