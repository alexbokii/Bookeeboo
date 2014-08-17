var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('default', function() {
  return gulp.src('./scss/*.scss')
  .pipe(watch(function(files) {
    return files.pipe(sass({
      sourceMap: 'sass',
      sourceComments: 'map'
    }))
    .pipe(gulp.dest('./public/stylesheets/'));
  }));
});
