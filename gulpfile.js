var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),

    handlebars = require('gulp-handlebars'),
    nodemon = require('gulp-nodemon');


// HBS

gulp.task('hbs', function(){
    return gulp.src('templates/**/*.hbs')
        .pipe(handlebars())
        .pipe(gulp.dest('templates/jst'));
});


// Watch
// =====

gulp.task('watch', function(){
    return nodemon({script: 'server/server.js', ext: 'js'})
        .on('restart', function(){
            console.log('server restarted');
        });
});


// Tasks
// ====

gulp.task('default', ['hbs', 'watch']);
