'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const base = path.join(__dirname, '..');

const paths = {
    worlds: path.join(base, 'worlds'),
    avatars: path.join(base, 'avatars')
};

var getDirectories = srcpath => {
    return fs.readdirSync(srcpath).filter(file => {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
};

exports.getWorlds = () => {
    let worlds = getDirectories(paths.worlds);
    return Array.isArray(worlds) ? worlds : [worlds];
};

exports.BASE = base;
exports.getDirectories = getDirectories;
