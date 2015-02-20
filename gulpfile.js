/*jshint node: true*/
'use strict';
var gulp = require('gulp');
var less = require('gulp-less');
var autoprefix = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var size = require('gulp-size');
var jade = require('gulp-jade');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var _ = require('lodash');

var result = 'dist';
var messagesSrc = './src/messages.js';
var indexSrc = './src/templates/**/*.jade';
var assetsSrc = './src/assets/**/*';
var lessSrc = './src/styles/**/*';
require('colors');

function wrap(stream) {
  function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------".bold.red.underline,
        ("[" + error.name + " in " + error.plugin + "]").red.bold.inverse,
        error.message,
        "----------ERROR MESSAGE END----------".bold.red.underline,
        ''
    ].join('\n'));

    stream.emit('end'); //ohh, this one restarts watch
    stream.end();
  }

  return stream.on('error', log);
}

/**
 * Copy assets
 */
gulp.task('assets', function() {
  return gulp.src(assetsSrc)
    .pipe(gulp.dest(result));
});

/**
 * Build less files
 */
gulp.task('less', function() {
  return gulp.src('./src/styles/foodzzilla.less')
    .pipe(wrap(less()))
    .pipe(autoprefix('last 2 versions'))
    .pipe(size({title: 'Unminified css'}))
    .pipe(minifyCss())
    .pipe(size({title: 'Minified css'}))
    .pipe(gulp.dest(result));
});

/**
 * Generate index file
 */
gulp.task('index', function() {
  delete require.cache[require.resolve(messagesSrc)];

  return gulp.src('./src/templates/index.jade')
    .pipe(wrap(jade({
      pretty: true,
      locals: {
        messages: require(messagesSrc)
      }
    })))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(result));
});

/**
 * Start simple server
 */
gulp.task('server', function() {
  connect.server({
    port: 8777,
    livereload: true,
    root: result
  });
});

/**
 * Big Brother
 */
gulp.task('watch', function() {
  gulp.watch(assetsSrc, ['assets']);
  gulp.watch(lessSrc, ['less']);
  gulp.watch([indexSrc, messagesSrc], ['index']);
  gulp.watch('./dist/**/*', _.debounce(function(){
    gulp.src(result).pipe(connect.reload());
  }, 1000));
});

gulp.task('default', ['assets', 'less', 'index', 'server', 'watch']);
