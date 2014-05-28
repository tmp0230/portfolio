var gulp = require('gulp'),
    gutil = require('gulp-util'),

    clean = require('gulp-clean'),
    nunjucks = require('gulp-nunjucks'),
    processhtml = require('gulp-processhtml');

// Templates
// =========

gulp.task('templates', ['generateLayout'], function(){
    return gulp.src('templates/**/*.html')
        .pipe(nunjucks())
        .pipe(gulp.dest('public/jst'));
});

gulp.task('generateLayout', function(){
    return gulp.src('templates/layout/base.html.original')
        .pipe(processhtml('base.html'))
        .pipe(gulp.dest('templates/layout'));
});

// Watch
// =====

gulp.task('watch', ['templates'], function(){
    gulp.watch(['templates/layout/base.html.original', 'templates/**/*.html'], ['templates']);
});

// Clean
// =====

gulp.task('clean', function(){
    return gulp.src(['public/jst', '**/.DS_Store', 'templates/layout/base.html', 'npm-debug.log'], {read: false})
        .pipe(clean());
});

// Tasks
// =====

gulp.task('default', ['watch']);

gulp.task('build', ['clean'], function(){
    gulp.start('postbuild');
});

gulp.task('postbuild', ['templates'], function(){
    process.exit();
});
