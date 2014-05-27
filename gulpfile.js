var gulp = require('gulp'),
    gutil = require('gulp-util'),

    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    nunjucks = require('gulp-nunjucks'),
    processhtml = require('gulp-processhtml');

// Templates
// =========

gulp.task('templates', function(){
    return gulp.src('templates/**/*.html')
        .pipe(nunjucks())
        .pipe(gulp.dest('public/jst'));
});

gulp.task('templateCopy', function(){
    return gulp.src('templates/layout/base.html')
        .pipe(rename({prefix: 'orig.'}))
        .pipe(gulp.dest('templates/layout'))
        .pipe(processhtml('base.html'))
        .pipe(gulp.dest('templates/layout'));
});

gulp.task('templateCompile', ['templateCopy'], function(){
    return gulp.src(['!templates/layout/orig.base.html', 'templates/**/*.html'])
        .pipe(nunjucks())
        .pipe(gulp.dest('public/jst'));
});

gulp.task('templateRename', ['templateCompile'], function(){
    return gulp.src('templates/layout/orig.base.html')
        .pipe(rename('base.html'))
        .pipe(gulp.dest('templates/layout'));
});

gulp.task('templateClean', ['templateRename'], function(){
    return gulp.src('templates/layout/orig.base.html', {read: false})
        .pipe(clean());
});

// Watch
// =====

gulp.task('watch', ['templates'], function(){
    gulp.watch('templates/**/*.html', ['templates']);
});

// Clean
// =====

gulp.task('clean', function(){
    return gulp.src(['public/jst', '**/.DS_Store'], {read: false})
        .pipe(clean());
});

// Tasks
// =====

gulp.task('default', ['watch']);

gulp.task('build', ['clean'], function(){
    gulp.start('postbuild');
});

gulp.task('postbuild', ['templateClean'], function(){
    process.exit();
});
