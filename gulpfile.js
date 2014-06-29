// TODO: When processhtml will be updated with environment, remove Templates Dev section
// TODO: When gulp 4 will be out, remove gulp.start() in clean (something will allow to do so) and check error comportments (lint)
// TODO: Fix copyFiles vars glob syntax
// TODO: Add beep to lint task
// TODO: Add uncss task

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),

    clean = require('gulp-clean'),
    nunjucks = require('gulp-nunjucks'),
    processhtml = require('gulp-processhtml'),
    uncss = require('gulp-uncss'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    livereload = require('gulp-livereload'),
    compass = require('gulp-compass'),
    jshint = require('gulp-jshint'),

// Variables
// =========

    paths = {
        scripts: [
            'public/app/js/**/*.js',
            '!public/app/js/libs{,/**}',
            '!public/app/js/admin{,/**}'
        ], // All js but not libs or admin
        vendors: [
            'public/app/js/libs/underscore.js',
            'public/app/js/libs/backbone.js',
            'public/app/js/libs/**/*.js'
        ],
        copyFiles: [
            'public/app/**',
            '!public/app/scss{,/**}',
            '!public/app/.sass-cache{,/**}'
            //'public/app/js/admin/**/*.js', // Admin scripts
            //'!public/app/js/**',
        ] // Copy all excepts js and compass
    };

// Scripts
// =======

gulp.task('lint', function(){
    return gulp.src([paths.scripts.toString(), 'public/app/js/admin/**/*.js', '!public/app/js/admin/libs/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        //.pipe(jshint.reporter('fail')
        //    .on('error', gutil.beep));
})

gulp.task('scripts', ['lint'], function(){
    return gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(livereload())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/dist/js'));
});

gulp.task('libs', function(){
    return gulp.src(paths.vendors)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('public/dist/js/libs'))
        .pipe(livereload())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/dist/js/libs'));
});

// Styles
// ======

gulp.task('css', function(){
    return gulp.src('public/app/scss/**/*.scss')
        .pipe(compass({
            project: path.join(__dirname, 'public/app'),
            sass: 'scss',
            image: 'img'
        })
            .on('error', gutil.beep))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(livereload())
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss({keepSpecialComments: 0}))
        .pipe(gulp.dest('public/dist/css'));
});

// Clean compass css output because we already copied it in dist folder

gulp.task('cleanCss', ['css'], function(){
    return gulp.src('public/app/css', {read: false})
        .pipe(clean());
});

// Copy
// ====

gulp.task('copy', function(){
    return gulp.src(paths.copyFiles, {base: 'public/app'})
        .pipe(gulp.dest('public/dist'))
        .pipe(livereload());
});

// Templates
// =========

// Prod

gulp.task('templates', ['generateLayout'], function(){
    return gulp.src(['templates/**/*.html', '!templates/admin{,/**}', '!templates/layout{,/**}', '!templates/extends{,/**}'])
        .pipe(nunjucks())
        .pipe(gulp.dest('public/dist/jst'));
});

gulp.task('generateLayout', function(){
    return gulp.src('templates/layout/base.html.original')
        .pipe(processhtml('base.html'))
        .pipe(gulp.dest('templates/layout'));
});

// Dev

gulp.task('templatesDev', ['generateLayoutDev'], function(){
    return gulp.src(['templates/**/*.html', '!templates/admin{,/**}', '!templates/layout{,/**}', '!templates/extends{,/**}'])
        .pipe(nunjucks())
        .pipe(gulp.dest('public/dist/jst'))
        .pipe(livereload());
});

gulp.task('generateLayoutDev', function(){
    return gulp.src('templates/layout/base.html.original')
        .pipe(rename('base.html'))
        .pipe(gulp.dest('templates/layout'));
});

// Watch
// =====

gulp.task('watch', ['templatesDev', 'cleanCss', 'scripts', 'libs', 'copy'], function(){
    gulp.watch(['templates/layout/base.html.original', 'templates/**/*.html'], ['templatesDev']);
    gulp.watch('public/app/scss/**/*.scss', ['cleanCss']);
    gulp.watch('public/app/js/admin/**/*.js', ['lint']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.vendors, ['libs']);
    gulp.watch(paths.copyFiles, ['copy']);
});

// Clean
// =====

gulp.task('clean', function(){
    return gulp.src(['**/.DS_Store', 'public/dist', 'templates/layout/base.html', 'npm-debug.log', 'public/app/.sass-cache'], {read: false})
        .pipe(clean());
});

// Tasks
// =====

gulp.task('default', ['watch']);

gulp.task('build', ['clean'], function(){
    gulp.start('postbuild');
});

gulp.task('postbuild', ['templates', 'cleanCss', 'scripts', 'libs', 'copy'], function(){
    process.exit();
});
