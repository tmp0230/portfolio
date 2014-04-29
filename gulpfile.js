var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),

    clean = require('gulp-clean'),
    swig = require('gulp-swig-precompile'),
    nodemon = require('gulp-nodemon');


// Templates
// =========

gulp.task('swig', function(){
    return gulp.src('templates/**/*.html', {base: path.join(__dirname, 'templates')})
        .pipe(swig())
        .pipe(gulp.dest('jst'));
});


// Watch
// =====

gulp.task('watch', function(){
    return nodemon({script: 'server/server.js', ext: 'js'})
        .on('restart', function(){
            console.log('server restarted');
        });
});


// Clean
// =====

gulp.task('superclean', function(){
    return gulp.src('jst', {read: false})
        .pipe(clean());
});


// Tasks
// =====

gulp.task('default', ['swig', 'watch']);

gulp.task('clean', ['superclean']);
