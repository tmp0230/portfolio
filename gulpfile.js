var gulp = require('gulp'),
    gutil = require('gulp-util'),

    clean = require('gulp-clean'),
    nunjucks = require('gulp-nunjucks');

// Templates
// =========

gulp.task('templates', function(){
    return gulp.src('templates/**/*.html')
        .pipe(nunjucks())
        .pipe(gulp.dest('public/jst'));
});

// Watch
// =====

gulp.task('watch', ['templates'], function(){
    gulp.watch('templates/**/*.html', ['templates']);
});

// Clean
// =====

gulp.task('clean', function(){
    return gulp.src('public/jst', {read: false})
        .pipe(clean());
});

// Tasks
// =====

gulp.task('default', ['watch']);

gulp.task('build', ['clean'], function(){
    gulp.start('postbuild');
});

gulp.task('postbuild', ['template'], function(){
    process.exit();
});
