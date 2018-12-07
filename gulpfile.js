var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var connect = require('gulp-connect');

var coffeeSource = ['components/coffee/tagline.coffee'];
var jsSource = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
var sassSource = ['components/sass/style.scss'];

gulp.task('log', function(){
    gutil.log('workflows are awesome');
});

gulp.task('coffee', function() {
    gulp.src(coffeeSource)
        .pipe(coffee({bare: true})
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'));
});

/* Combine all javascript files into a single javascript file. */
gulp.task('js', function() {
    /* concatenate all of the js files into one file. */
    gulp.src(jsSource)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload());
});

gulp.task('compass', function() {
    gulp.src(sassSource)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded'
        })
            .on('error', gutil.log))
        .pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload());
    });

gulp.task('watch', function() {
    gulp.watch(coffeeSource, ['coffee']);
    gulp.watch(jsSource, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
});

/* Reload page when files change in the specified root directory. */
gulp.task('connect', function(){
    connect.server({
        root: 'builds/development/',
        livereload: true
    });
});

gulp.task('default', ['coffee', 'js', /*'compass',*/ 'connect', 'watch']);