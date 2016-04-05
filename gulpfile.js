'use strict';

var fs = require('fs');
var gulp = require('gulp');
var remove = require('del');
var archive = require('gulp-zip');
var jshint = require('gulp-jshint');
var gulpif = require('gulp-if');
var header = require('gulp-header');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var uuid = require('shortid');
var commentify = require('gulp-header');
var config = require('./config.json');
var pkg = require('./package.json');

var currentBuildID;

var banner = ['/**',
  ' * <%= pkg.header %> (Build <%= uuid %>)',
  ' * @author <%= pkg.developer %>',
  ' * @version v<%= cfg.version %>',
  ' * @license <%= pkg.license %> Licensed by <%= pkg.company %>',
  ' * @see <%= pkg.homepage %>',
  ' */',
  '', ''].join('\n');

gulp.task('lint', function() {
    return gulp.src(config.lint.path)
        .pipe(jshint({ lookup: true }))
        .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('clean:dist', function() {
    return remove(config.clean.dist);
});

gulp.task('clean:dist:bundle', function() {
    return remove(config.bundle.target + '/' + config.bundle.name + '*.js');
});

gulp.task('clean:dist:styles', function() {
    return remove(config.styles.target + '/' + config.styles.name + '*.css');
});

gulp.task('clean:dist:dependencies', function() {
    return remove(config.dependencies.target + '/' + config.dependencies.name + '.*');
});

gulp.task('copy', function() {
    for(var key in config.copy) {
        return gulp.src(key)
            .pipe(gulp.dest(config.copy[key]));
    }
});

gulp.task('archive', ['build:start', 'build:default'], function() {
    return gulp.src(config.release)
        .pipe(archive(currentBuildID + '-' + config.version + '.zip'))
        .pipe(gulp.dest('release'));
});

gulp.task('build:start', function(done) {
    currentBuildID = uuid.generate();
    console.log('=> Initializing new Build with Number ' + currentBuildID + '...');
    fs.writeFile(config.buildFile, currentBuildID, function(err) {
        if(err) {
            throw new Error('Build failed: ' + err.message);
        }
        done();
    });
});

gulp.task('build:dependencies', ['clean:dist:dependencies'], function() {
    return gulp.src(config.dependencies.files)
        .pipe(concat(config.dependencies.name + '.js'))
        .pipe(gulp.dest(config.dependencies.target));
});

gulp.task('build:app', ['clean:dist:bundle'], function() {
    return gulp.src(config.app.files)
        .pipe(gulpif(config.app.minify === true, uglify()))
        .pipe(concat(config.app.name + '.js'))
        .pipe(commentify(banner, {
            cfg: config,
            pkg: pkg,
            uuid: currentBuildID
        }))
        .pipe(gulp.dest(config.app.target));
});

gulp.task('build:bundle', ['clean:dist:bundle', 'build:app', 'build:dependencies'], function() {
    return gulp.src([
            config.dependencies.target + '/' + config.dependencies.name + '*.js',
            config.app.target + '/' + config.app.name + '*.js'
        ])
        .pipe(uglify())
        .pipe(concat(config.bundle.name + '.min.js'))
        .pipe(commentify(banner, {
            cfg: config,
            pkg: pkg,
            uuid: currentBuildID
        }))
        .pipe(gulp.dest(config.bundle.target));
});

gulp.task('build:styles', ['clean:dist:styles'], function() {
    return gulp.src(config.styles.files)
        .pipe(gulpif(config.styles.minify === true, cssmin()))
        .pipe(concat(config.styles.name + '.css'))
        .pipe(commentify(banner, {
            cfg: config,
            pkg: pkg,
            uuid: currentBuildID
        }))
        .pipe(gulp.dest(config.styles.target));
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

gulp.task('watch:styles', function() {
    var watcher = gulp.watch(config.styles.files, ['build:styles']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('watch:default', [
    'watch:styles',
    'watch:dependencies',
    'watch:app'
]);

gulp.task('build:default', [
    'build:styles',
    'build:dependencies',
    'build:app',
    'copy'
]);

gulp.task('develop', [
    'build:default',
    'watch:default'
]);

gulp.task('build:init', [
    'build:start',
    'build:default',
    'watch:default'
]);

gulp.task('bundle', ['build:bundle']);

gulp.task('default', ['build:init'])
