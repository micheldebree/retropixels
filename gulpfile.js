var gulp = require('gulp'),
  typescript = require('gulp-tsc'),
  del = require('del');

gulp.task('clean', function() {
  return del(['target']);
});

gulp.task('compile', function() {
  gulp.src(['src/**/*.ts'])
    .pipe(typescript())
    .pipe(gulp.dest('target/'));
});

gulp.task('default', ['clean', 'compile'], function() {
  // place code for your default task here
  });
