var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),

    clean = require('gulp-clean'),
    swig = require('gulp-swig-precompile');

// Templates
// =========

gulp.task('templates', function(){
    return gulp.src('templates/**/*.html')
        .pipe(swig({output: 'tpl[\'<%= file.relative.replace(/\\/g, \'/\') %>\'] = <%= template %>;' }))
        .pipe(gulp.dest('jst'));
});

// Watch
// =====

gulp.task('watch', ['templates'], function(){
    gulp.watch('templates/**/*.html', ['templates']);
});

// Clean
// =====

gulp.task('clean', function(){
    return gulp.src('jst', {read: false})
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
