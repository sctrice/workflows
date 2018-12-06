var gulp = require('gulp');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');

var coffeeSource = ['components/coffee/tagline.coffee'];

gulp.task('log', function(){
    gutil.log('workflows are awesome');
});

gulp.task('coffee', function() {
    gulp.src(coffeeSource)
        .pipe(coffee({bare: true})
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'));
});