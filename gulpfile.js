var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var connect = require('gulp-connect');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
/*var htmlmin = require('gulp-htmlmin');*/
var jsonminify = require('gulp-jsonminify');

var env = process.env.NODE_ENV || 'development';
var outputDir;
var sassStyle;
if(env === 'development'){
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else{
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}


var coffeeSource = ['components/coffee/tagline.coffee'];
var jsSource = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
var sassSource = ['components/sass/style.scss'];
var htmlSource = [outputDir + '*.html'];
var jsonSource = [outputDir + 'js/*.json'];

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
    console.log('env=' + env + '; ' + 'outputdir=' + outputDir);
    /* concatenate all of the js files into one file. */
    gulp.src(jsSource)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify()))
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload());
});

gulp.task('compass', function() {
    gulp.src(sassSource)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'images',
            style: sassStyle
        })
            .on('error', gutil.log))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload());
    });

gulp.task('watch', function() {
    gulp.watch(coffeeSource, ['coffee']);
    gulp.watch(jsSource, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);
});

/* Reload page when files change in the specified root directory. */
gulp.task('connect', function(){
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('html', function(){
    gulp.src('builds/development/*.html')
   /* .pipe(gulpif(env === 'production', htmlmin()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))*/
    .pipe(connect.reload());
});

gulp.task('json', function(){
    gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
    .pipe(connect.reload());
});

gulp.task('default', ['html', 'json','coffee', 'js', /*'compass',*/ 'connect', 'watch']);