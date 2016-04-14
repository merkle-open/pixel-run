var assert = require('chai').assert;
var fs = require('fs');

describe('Pixel-Run Game', function() {
    describe('scores', function() {
        it('should return an array with scores', function() {
            fs.readFile('./../app/data/scores.json', function(err, data) {
                assert.ifError(err);
                assert.isArray(data);
            });
        });
    });
});
