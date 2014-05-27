var gulp = require('gulp'),
    gutil = require('gulp-util'),

    clean = require('gulp-clean'),
    nunjucks = require('gulp-nunjucks'),
    processhtml = require('gulp-processhtml');

// Templates
// =========

gulp.task('templates', function(){
    return gulp.src('templates/**/*.html')
        .pipe(nunjucks())
        .pipe(gulp.dest('public/jst'));
});

gulp.task('templatesProcess', function(){
    return gulp.src('templates/layout/base.html')
        .pipe(gulp.dest('templates/layout/base.html.original'))
        .pipe(processhtml('base.html'))
        .pipe(gulp.dest('templates/layout'));
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
