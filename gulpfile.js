// TODO: When gulp 4 will be out, remove gulp.start() in clean (something will allow to do so) and check error comportments (lint)
// TODO: Add beep to lint task
// TODO: Add uncss task

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),

    clean = require('gulp-clean'),
    nunjucks = require('gulp-nunjucks'),
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
            'public/app/js/app/**/*.js',
            '!public/app/js/libs{,/**}',
            '!public/app/js/admin{,/**}'
        ], // All js but not libs or admin
        vendors: [
            'public/app/js/libs/underscore.js',
            'public/app/js/libs/backbone.js',
            'public/app/js/libs/**/*.js'
        ],
        copyFiles: [
            'public/app/*',
            '!public/app/scss', // Avoid empty css folder
            'public/app/img/**',
            'public/app/fonts/**',
            'public/app/js/admin/**/*.js',
            'public/app/templates/admin/**/*.html',
        ] // Copy root files, img folder and admin js (that are not uglified)
    };


// Scripts
// =======

gulp.task('lint', function(){
    return gulp.src(['public/app/js/app/**/*.js', 'public/app/js/admin/**/*.js', '!public/app/js/admin/libs/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        // .pipe(jshint.reporter('fail')
        //     .on('error', gutil.beep));
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
            image: 'img',
            font: 'fonts'
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
        //.pipe(clean());
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

gulp.task('templates', function(){
    return gulp.src('templates/partials/**/*.html')
        .pipe(nunjucks())
        .pipe(gulp.dest('public/dist/jst'))
        .pipe(livereload());
});


// Watch
// =====

gulp.task('watch', ['templates', 'cleanCss', 'scripts', 'libs', 'copy'], function(){
    gulp.watch('templates/**/*.html', ['templates']);
    gulp.watch('public/app/scss/**/*.scss', ['cleanCss']);
    gulp.watch('public/app/js/admin/**/*.js', ['lint']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.vendors, ['libs']);
    gulp.watch(paths.copyFiles, ['copy']);
});


// Clean
// =====

gulp.task('clean', function(){
    return gulp.src(['**/.DS_Store', 'public/dist', 'npm-debug.log', 'public/app/.sass-cache'], {read: false})
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
