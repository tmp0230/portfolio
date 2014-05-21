var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),

    clean = require('gulp-clean');

// Templates
// =========


// Watch
// =====


// Clean
// =====

gulp.task('clean', function(){
    return gulp.src('jst', {read: false})
        .pipe(clean());
});

// Tasks
// =====

//gulp.task('default', ['watch']);

gulp.task('build', ['clean'], function(){
    gulp.start('postbuild');
});

gulp.task('postbuild', ['template'], function(){
    process.exit();
});
