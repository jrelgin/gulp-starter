"use strict";

var gulp = require('gulp'),
    watch = require('gulp-watch');
var sass = require('gulp-sass');
var connect = require('gulp-connect'); //run local dev server
var open = require('gulp-open'); //open url in browser
var browserify = require('browserify'); // bundles js
var reactify = require('reactify'); // tranforms react jsx to js
var source = require('vinyl-source-stream'); // use conventional text streams with gulp

var config = {
  port: 3000,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    js: './src/**/*.js',
    scss: './src/**/*.scss',
    dist: './dist/',
    mainJs: './src/main.js'
  }
}

//Start a local dev server
gulp.task('connect', function() {
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

gulp.task('open', ['connect'], function() {
  gulp.src('dist/index.html')
    .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function() {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

gulp.task('js', function() {
  browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload());
})

gulp.task('sass', function() {
  return gulp.src(config.paths.scss)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(config.paths.dist + './styles'))
    .pipe(connect.reload());

})

gulp.task('watch', function() {
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.js, ['js']);
});

gulp.task('sass:watch', function () {
  gulp.watch(config.paths.scss, ['scss']);
});

gulp.task('default', ['html', 'js', 'sass', 'open', 'watch']);
