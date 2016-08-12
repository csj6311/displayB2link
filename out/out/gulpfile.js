/**
 * Created by win7 on 2016-08-10.
 */
'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

gulp.task('babel', function () {
  return gulp.src('./*.js').pipe(sourcemaps.init()).pipe(babel()).pipe(sourcemaps.write('./', { sourceRoot: './' })).pipe(gulp.dest('out'));
});
//# sourceMappingURL=gulpfile.js.map
//# sourceMappingURL=gulpfile.js.map
