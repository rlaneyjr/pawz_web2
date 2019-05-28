const gulp = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const nodemon = require('gulp-nodemon');
// require('dotenv').config(); // Load environment variables

/*--- Load Gulp subtasks ---*/
const requireDir = require('require-dir');
requireDir('./gulp_tasks',{recurse: true});

// Helper function for reloading Nodemon + Server
function reloader(done) {
	browserSync.reload();
	done();
};

// Nodemon => Initialize express server with nodemon
gulp.task('nodemon', function (cb) {
	var called = false;
	return nodemon({
		script: 'app.js',
		ignore: [
			'gulpfile.js',
			'node_modules/',
			'vendor/'
		]
	})
	.on('start', function () {
		if (!called) {
			called = true;
			cb();
		}
	})
	.on('restart', function () {
		setTimeout(function () {
			reload({ stream: false });
		}, 1000);
	});
});

// Browser-Sync => Start and sync the browser when changes happen
gulp.task('browser-sync',
	gulp.parallel('nodemon',
		function initServer() {
			browserSync({
				proxy: "localhost:3000",  // local node app address
				port: 7000,  // use *different* port than above
				notify: false
			});
		},
		function watcher(done) {
			// EJS and HTML Watcher
			gulp.watch(['src/dev/*.ejs', 'src/dev/**/*.ejs', 'src/*.html'],  gulp.parallel(reloader));
			// SASS / CSS Watchers
			gulp.watch(['src/scss/**/*.scss', 'src/scss/*.scss'], gulp.parallel('style_dev'));
			// JS Watcher
			gulp.watch(['src/js/**/*.js'],gulp.parallel('scripts_dev'));
		}
	)
);

/*--- Main Gulp Tasks---*/
gulp.task('default', 
	gulp.series('clean', 'move-js',
		gulp.parallel('scripts_dev', 'style_dev'),
		'browser-sync'
	)
);

// Build => Production-ready theme folder to upload (Default build)
gulp.task('build',
  gulp.parallel('theme_style', 'theme_scripts', 'theme_views')
);

