var assert = require('chai').assert;
var bower = require('bower-json');

describe('Pixel-Run Game', function() {
    describe('bower.json', function() {
        it('should be a valid bower file', function() {
            bower.read('./../bower.json', function (err, json) {
                assert.ifError(err);
                assert.isUndefined(err);
                assert.isDefined(json);
            });
        });
    });
});
