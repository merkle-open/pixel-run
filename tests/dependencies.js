var assert = require('chai').assert;
var bower = require('bower-json');
var npm = require('package-json-validator').PJV;

describe('Dependencies', function() {
    describe('bower.json', function() {
        it('should be a valid bower file', function() {
            bower.read('./../bower.json', function (err, json) {
                assert.ifError(err);
                assert.isUndefined(err);
                assert.isDefined(json);
            });
        });
    });

    // TODO: fix this test procedure
    describe('package.json', function() {
        it('should be a valid npm file', function() {
            var res = npm.validate(require('../package.json'), 'npm');
            assert.isTrue(res.valid, 'the file is valid');
        });
    });
});
