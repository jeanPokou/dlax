'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var less = require('gulp-less');
var esperanto = require('esperanto');
var map = require('vinyl-map');
var jetpack = require('fs-jetpack');
var utils = require('./utils');
var polybuild = require('polybuild');
var runSequence = require('run-sequence');
var del = require('del');

// var babel = require('gulp-babel');
// var crisper = require('gulp-crisper');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

var paths = {
  jsCodeToTranspile: [
      'app/**/*.js',
      '!app/main.js',
      '!app/spec.js',
      '!app/node_modules/**',
      '!app/bower_components/**',
      '!app/vendor/**'
  ],
  toCopy: [
      'app/**/*',
      'app/main.js',
      'app/spec.js',
      'app/node_modules/**',
      'app/bower_components/**',
      'app/vendor/**',
      '*.jpg'
  ],
};

// -------------------------------------
// Tasks
// -------------------------------------

// deleting all files in destDir
gulp.task('clean', function(callback) {
  return destDir.dirAsync('.', {
    empty: true
  });
});

// Copying everything from projectDir to destDir
var copyTask = function() {
  return projectDir.copyAsync('app', destDir.path(), {
    overwrite: true,
    matching: paths.toCopy
  });
};

//rename index.build.html to index.html
gulp.task('rename-index',function() {
  gulp.src('build/index.build.html')
  .pipe($.rename('index.html'))
  .pipe(gulp.dest('build/'));
  return del(['build/index.build.html']);
});
//polybuild task index.html
var polymerBuild = function(src, dest) {
  return gulp.src(src)
      .pipe(polybuild({maximumCrush: true}))
      .pipe(gulp.dest(dest));

};
gulp.task('polybuild',function() {
  return polymerBuild('build/index.html','build/');
});

// copy after cleaning folder
gulp.task('copy', ['clean'], copyTask);
//copy i.e overwrite if conflict
gulp.task('copy-watch', copyTask);

// function for transpilying all files i.e converting *js files to es6
var transpileTask = function() {
  return gulp.src(paths.jsCodeToTranspile)
        // .pipe(map(function(code, filename) {
        //   var transpiled = babel(code.toString(), {
        //     presets: ['es2015']
        //   });
        //
        //   return transpiled.code;
        // }))
        .pipe($.sourcemaps.init())
        .pipe($.if('*.html',$.crisper()))
        .pipe($.if('*.js', $.babel({presets: ['es2015']})))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('.sourcemaps'))
        .pipe(gulp.dest(destDir.path()));
};
// transpile task
gulp.task('transpile', ['clean'], transpileTask);
gulp.task('transpile-watch', transpileTask);

// less task
var lessTask = function() {
  return gulp.src('app/stylesheets/main.less')
      .pipe($.less())
      .pipe(gulp.dest(destDir.path('stylesheets')));
};
gulp.task('less', ['clean'], lessTask);
gulp.task('less-watch', lessTask);

// task for finialiazing build ie creating the manifest file for Electron
gulp.task('finalize', ['clean'], function() {
  var manifest = srcDir.read('package.json', 'json');
  switch (utils.getEnvName()) {
    case 'development':
      // Add "dev" suffix to name, so Electron will write all
      // data like cookies and localStorage into separate place.
      manifest.name += '-dev';
      manifest.productName += ' Dev';
      break;
    case 'test':
      // Add "test" suffix to name, so Electron will write all
      // data like cookies and localStorage into separate place.
      manifest.name += '-test';
      manifest.productName += ' Test';
      // Change the main entry to spec runner.
      manifest.main = 'spec.js';
      break;
  }
  destDir.write('package.json', manifest);

  var configFilePath = projectDir.path('config/env_' +
 utils.getEnvName() + '.json');
  destDir.copy(configFilePath, 'env_config.json');
});

// watch task
gulp.task('watch', function() {
  gulp.watch(paths.jsCodeToTranspile, ['transpile-watch']);
  gulp.watch(paths.toCopy, ['copy-watch']);
  gulp.watch('*.less', ['less-watch']);
});

gulp.task('build' ,function(cb) {
  runSequence('copy' ,'polybuild','rename-index'/*,'rename-index'
  ['finalize']*/,cb);
});
