var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('default', function() {
  gulp.src('./scss/*.scss')
  .pipe(watch(function(files) {
    return files.pipe(sass())
    .pipe(gulp.dest('./public/stylesheets/'));
  }));
});
