var gulp = require('gulp');
var rename = require('gulp-rename');
var server = require('gulp-server-livereload');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cleanCSS = require('gulp-clean-css');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');

var errorHandler = function (e) {
    console.log(e);
};

var path = {
    app: 'dist/',
    sassMain: 'src/sass/style.scss',
    sassGlob: 'src/sass/**/*.scss',
    svgGlob: 'src/images/svgs/**/*.svg',
    distCSS: 'dist/css/',
    distImages: 'dist/images/',
    distJSLib: 'dist/js/lib/'
};

gulp.task('webserver', function () {
    gulp.src(path.app)
        .pipe(server({
            livereload: true,
            open: true,
            host: '0.0.0.0'
        }));
});

gulp.task('sprites', function () {
    return gulp.src(path.svgGlob)
        .pipe(svgmin({
            plugins: [{
                removeTitle: false,
            }]
        }))
        .pipe(cheerio({
            run: function ($) {
                var black = ['#000', '#000000'];
                $('[fill]').each(function() {
                    var $fill = $(this).attr('fill');
                    if (black.indexOf($fill) !== -1) {
                        $(this).removeAttr('fill')
                    }
                });
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(svgstore())
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest(path.distImages))
});

gulp.task('flickity', function () {
    return gulp.src('node_modules/flickity/dist/flickity.pkgd.min.js')
        .pipe(gulp.dest(path.distJSLib));
})

gulp.task('compile-sass', function () {
    return gulp.src(path.sassMain)
        .pipe(sass({
            includePaths: [
                'node_modules/normalize-scss/sass',
                'node_modules/bootstrap/scss'
            ]
        }))
        .on('error', errorHandler)
        .pipe(postcss([
            autoprefixer({browsers: ['last 2 versions']})
        ]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.distCSS))
});

gulp.task('build', ['compile-sass', 'sprites', 'flickity']);

gulp.task('watch', ['build'], function () {
    gulp.watch(path.sassGlob, ['compile-sass']);
});

gulp.task('default', ['watch', 'webserver']);
