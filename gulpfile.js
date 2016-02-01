'use strict';

var gulp = require('gulp');
var remove = require('del');
var gulpif = require('gulp-if');
var header = require('gulp-header');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var config = require('./build.json');

gulp.task('clean:dist', function() {
    return remove(config.clean.dist);
});

gulp.task('clean:dist:app', function() {
    return remove(config.app.target + '/' + config.app.name + '.*');
});

gulp.task('clean:dist:bundle', function() {
    return remove(config.bundle.target + '/' + config.bundle.name + '.*');
})

gulp.task('clean:dist:dependencies', function() {
    return remove(config.dependencies.target + '/' + config.dependencies.name + '.*');
});

gulp.task('build:dependencies', ['clean:dist:dependencies'], function() {
    return gulp.src(config.dependencies.files)
        .pipe(concat(config.dependencies.name + '.js'))
        .pipe(gulp.dest(config.dependencies.target));
});

gulp.task('build:app', ['clean:dist:app'], function() {
    return gulp.src(config.app.files)
        .pipe(gulpif(config.app.minify === true, uglify()))
        .pipe(concat(config.app.name + '.js'))
        .pipe(gulp.dest(config.app.target));
});

gulp.task('build:bundle', ['clean:dist:bundle', 'build:app', 'build:dependencies'], function() {
    return gulp.src(config.app.target + '/*.js')
        .pipe(uglify())
        .pipe(concat(config.bundle.name + '.min.js'))
        .pipe(gulp.dest(config.app.target));
});

gulp.task('watch:app', function() {
    var watcher = gulp.watch(config.app.files, ['build:app']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('watch:dependencies', function() {
    var watcher = gulp.watch(config.dependencies.files, ['build:dependencies']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('bundle', ['build:bundle']);

gulp.task('default', [
    'build:dependencies',
    'build:app',
    'watch:dependencies',
    'watch:app'
]);
