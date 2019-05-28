// theme_scripts
// Concat and export both minified and unminified JavaScript files theme folder ('theme/js/')

const gulp = require('gulp');
const order = require('gulp-order');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

gulp.task('theme_scripts', function(){
	var glob = [];
	glob.push('src/libraries/**/*.js');
	glob.push('src/app.js');
	return gulp.src(glob)
    .pipe(order([
      '*jquery.min.js*', // If jQuery is included, move to the top
      '*popper.min.js*', // Then Popper
      '*bootstrap.min.js*', // Then Bootstrap
      '*flexibility.js*',
      '*responsive-nav.min.js*']))
	  .pipe(concat('app.js'))
	  .pipe(gulp.dest('src/js'))
	  .pipe(uglify())
	  .pipe(rename({ extname: '.min.js' }))
	  .pipe(gulp.dest('src/js'))
});
