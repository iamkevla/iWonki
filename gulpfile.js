'use strict';

/*jshint camelcase: false */

//var path = require('path');
var gulp = require('gulp');
var plug = require('gulp-load-plugins')({lazy: true});


/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
  return gulp.src(['server/**/*.js'])
		.pipe(plug.jshint())
		.pipe(plug.jshint.reporter('jshint-stylish', {verbose: true}))
		.pipe(plug.jshint.reporter('fail'))
		.pipe(plug.jscs({
			configPath: '.jscs.json',
			esnext: true
		}));
});

/**
 * jshint style
 */
gulp.task('jshint', function() {
	gulp.src(['server/**/*.js'])
		.pipe(plug.jshint('.jshintrc'))
		.pipe(plug.jshint.reporter('default'));
});

/**
 * jscs style
 */
gulp.task('jscs', function() {
	return gulp.src(['server/**/*.js'])
		.pipe(plug.jscs({
			configPath: '.jscs.json',
			esnext: true
		}));
});



/**
 * api Tests
 */
gulp.task('testapi', function() {
	return gulp.src('test/*Spec.js', {
			read: false
		})
		.pipe(plug.mocha({
			//bail: true,
			reporter: 'progress',
			timeout: 50000
		}))
		//.on('error', plug.util.log)
		.pipe(plug.exit());
});


/**
 * Static analysis
 */
gulp.task('jscpd', function() {
	return gulp.src(['server/**/*.js'])
		.pipe(plug.jscpd({
			'min-lines': 10,
			verbose: true
		}));
});



gulp.task('bump', function() {
	gulp.src('./*.json')
		.pipe(plug.bump())
		.pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function() {
	gulp.src('./*.json')
		.pipe(plug.bump({type:'minor'}))
		.pipe(gulp.dest('./'));
});


gulp.task('default', ['vet', 'testapi']);


