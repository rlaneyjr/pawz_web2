var gulp = require('gulp')
var browserSync = require('browser-sync') 
var sass = require('gulp-sass')
var order = require('gulp-order')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var postcss = require('gulp-postcss')
var flexibility = require('postcss-flexibility')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var del = require('del')

gulp.task('clean', function(done) {
  return del([
    'src/css/*',
    'src/js/*'
  ])
})

// compile sass same as running this from commandline:
// sass 'node_modules/bootstrap/scss/bootstrap.scss src/scss/*.scss' src/css
gulp.task('compile-sass', function() {
  const plugins = [ autoprefixer({browsers: ['last 2 versions','ie 9']}), cssnano() ];
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 
    'src/scss/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([flexibility]))
    .pipe(gulp.dest('src/css'))
    .pipe(postcss(plugins))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream:true}));
})

// move the minimized versions of vendor javascript into our project
gulp.task('move-js', function() {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/flexibility/flexibility.js',
    'node_modules/responsive-nav/responsive-nav.min.js'])
    .pipe(gulp.dest('src/dev/js/libraries'))
    .pipe(browserSync.reload({stream:true}));
})

gulp.task('concat-js', function() {
  var glob = [];
  // Push the theme JS first to concat everything
  glob.push('src/dev/js/libraries/**/*.js')
  glob.push('src/dev/js/app.js')
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
    .pipe(browserSync.reload({stream:true}));
})

// run 'compile-sass' when server runs
gulp.task('launch-server', function() {
  // run server
  browserSync.init({
    server: './src',
    port: 4000
  })
  gulp.watch('src/scss/*.scss', gulp.series('compile-sass'))
  gulp.watch('src/dev/js/*.js', gulp.series('concat-js'))
  // watch for html changes
  gulp.watch('src/*.html').on('change', browserSync.reload)
});

// run gulp, execute js task, launch server and browser
gulp.task('default',
  gulp.series('clean', 'move-js', 'concat-js', 'compile-sass', 'launch-server')
);
