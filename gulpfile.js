var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cleanCSS = require('gulp-clean-css');
var sassLint = require('gulp-sass-lint');

var errorHandler = function (e) {
	console.log(e);
}

gulp.task('compile-sass', ['lint-sass'], function () {
	var plugins = [
		autoprefixer({ browsers: ['last 2 versions'] })
	];
	return gulp.src('sass/style.scss')
	.pipe(sass({
		includePaths: 'node_modules/normalize-scss/sass'
	}))
	.on('error', errorHandler)
	.pipe(postcss(plugins))
	.pipe(cleanCSS())
	.pipe(gulp.dest('css/'))
});

gulp.task('build', ['compile-sass']);

gulp.task('watch', ['build'], function () {
	gulp.watch('sass/**/*.scss', ['compile-sass']);
})

gulp.task('default', ['watch']);
