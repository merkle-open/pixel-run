'use strict';

var gulp = require('gulp');
var remove = require('del');
var gulpif = require('gulp-if');
var header = require('gulp-header');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var commentify = require('gulp-header');
var config = require('./build.json');
var pkg = require('./package.json');

var banner = ['/**',
  ' * <%= pkg.header %> ',
  ' * @author <%= pkg.author %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %> Licensed by <%= pkg.company %>',
  ' */',
  ''].join('\n');

gulp.task('clean:dist', function() {
    return remove(config.clean.dist);
});

gulp.task('clean:dist:app', function() {
    return remove(config.app.target + '/' + config.app.name + '.*');
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

gulp.task('build:dependencies', ['clean:dist:dependencies'], function() {
    return gulp.src(config.dependencies.files)
        .pipe(concat(config.dependencies.name + '.js'))
        .pipe(gulp.dest(config.dependencies.target));
});

gulp.task('build:app', ['clean:dist:app'], function() {
    return gulp.src(config.app.files)
        .pipe(gulpif(config.app.minify === true, uglify()))
        .pipe(concat(config.app.name + '.js'))
        .pipe(commentify(banner, { pkg: pkg }))
        .pipe(gulp.dest(config.app.target));
});

gulp.task('build:bundle', ['clean:dist:bundle', 'build:app', 'build:dependencies'], function() {
    return gulp.src([
            config.dependencies.target + '/' + config.dependencies.name + '*.js',
            config.app.target + '/' + config.app.name + '*.js'
        ])
        .pipe(uglify())
        .pipe(concat(config.bundle.name + '.min.js'))
        .pipe(commentify(banner, { pkg: pkg }))
        .pipe(gulp.dest(config.bundle.target));
});

gulp.task('build:styles', ['clean:dist:styles'], function() {
    return gulp.src(config.styles.files)
        .pipe(cssmin())
        .pipe(concat(config.styles.name + '.min.css'))
        .pipe(commentify(banner, { pkg: pkg }))
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

gulp.task('bundle', ['build:bundle']);

gulp.task('default', [
    'build:styles',
    'build:dependencies',
    'build:app',
    'watch:styles',
    'watch:dependencies',
    'watch:app'
]);
