var path = require('path');
var fs = require('fs');
var uuid = require('shortid');

var BASE = path.join(__dirname, '..', 'data');

function Database(name) {
    this.$base = BASE;
    this.$pointer = name;
    this.$db = this.read();
}

Database.prototype = {
    save: function(handler) {
        var res = JSON.stringify(handler(this.read()));
        fs.writeFile(this.$getDbPath(), res, 'utf-8', (err) => {
            if(err) {
                throw err;
            }
        });
    },
    read: function() {
        return require(this.$getDbPath());
    },
    $getDbPath: function() {
        return path.join(BASE, this.$pointer + '.json');
    }
}

exports.Database = Database;

exports.connect = function(name) {
    return new Database(name);
};
