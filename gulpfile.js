// TODO: When gulp 4 will be out, remove gulp.start() in clean (something will allow to do so) and check error comportments (lint)
// TODO: Add uncss task
// TODO: When uglify is updated, check if streamify is still needed
// TODO: Remove plumber when no more needed

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),

    streamify = require('gulp-streamify'),
    coffee = require('gulp-coffee'),
    rimraf = require('gulp-rimraf'),
    nunjucks = require('gulp-nunjucks'),
    //uncss = require('gulp-uncss'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifycss = require('gulp-minify-css'),
    livereload = require('gulp-livereload'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),


// Variables
// =========

    files = {
        coffee: [
            'public/app/coffee/Manager.coffee',
            'public/app/coffee/**/*.coffee'
        ],
        libs: [
            'public/app/js/libs/**/*.js'
        ],
        css: [
            'public/app/scss/**/*.scss'
        ],
        templates: [
            'templates/partials/**/*.html'
        ],
        lint: [
            'public/app/js/admin/**/*.js',
            '!public/app/js/admin/libs/**'
        ],
        clean: [
            '**/.DS_Store',
            'public/dist',
            'npm-debug.log'
        ],
        copy: [
            'public/app/*',
            'public/app/img/**',
            'public/app/fonts/**',
            'public/app/js/admin/**/*.js',
            'public/app/templates/admin/**/*.html',
            '!public/app/coffee{,/**}',
            '!public/app/scss{,/**}'
        ],
        browserify: [
            'filters/*.js'
        ]
    };


// Lint admin scripts
// ==================

gulp.task('lint', function(){
    return gulp.src(files.lint)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


// Client scripts
// ==============

gulp.task('coffee', function(){
    return gulp.src(files.coffee)
        .pipe(plumber())
        .pipe(coffee({bare: true})
            .on('error', gutil.log)
            .on('error', gutil.beep)
            .on('error', notify.onError('coffee: <%= error.message %>')))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/dist/js'));
});

gulp.task('browserify', ['coffee'], function(){
    var bundler = watchify(browserify('./public/dist/js/app.js', {
            cache: {},
            packageCache: {},
            fullPaths: true
        }));

    bundler.on('update', rebundle);

    function rebundle(){
        return bundler
            .bundle()
                .on('error', notify.onError('bundle: <%= error.message %>'))
            .pipe(source('bundle.js'))
            .pipe(gulp.dest('public/dist/js'))
            .pipe(livereload())
            .pipe(rename({suffix: '.min'}))
            .pipe(streamify(uglify()))
            .pipe(gulp.dest('public/dist/js'));
    }

    return rebundle();
});

gulp.task('libs', function(){
    return gulp.src(files.libs)
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
    return gulp.src(files.css)
        .pipe(sass({
            errLogToConsole: false,
            onError: function(err){
                notify().write('sass: '+err);
            }
        }))
        .pipe(prefix())
        .pipe(gulp.dest('public/dist/css'))
        .pipe(livereload())
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss({keepSpecialComments: 0}))
        .pipe(gulp.dest('public/dist/css'));
});


// Copy
// ====

gulp.task('copy', function(){
    return gulp.src(files.copy, {base: 'public/app'})
        .pipe(gulp.dest('public/dist'))
        .pipe(livereload());
});


// Templates
// =========

gulp.task('templates', function(){
    return gulp.src(files.templates)
        .pipe(plumber())
        .pipe(nunjucks({
            name: function(file){
                return 'partials/'+file.relative;
            }
        })
            .on('error', notify.onError('nunjucks: <%= error.message %>')))
        .pipe(gulp.dest('public/dist/jst'))
        .pipe(livereload());
});


// Clean
// =====

gulp.task('clean', function(){
    return gulp.src(files.clean, {read: false})
        .pipe(rimraf());
});


// Watch
// =====

gulp.task('watch', ['templates', 'css', 'browserify', 'libs', 'copy', 'lint'], function(){
    gulp.watch(files.templates, ['templates']);
    gulp.watch(files.css, ['css']);
    gulp.watch(files.lint, ['lint']);
    gulp.watch(files.coffee, ['coffee']);
    gulp.watch(files.browserify, ['coffee']);
    gulp.watch(files.libs, ['libs']);
    gulp.watch(files.copy, ['copy']);
});


// Tasks
// =====

gulp.task('default', ['watch']);

gulp.task('build', ['clean'], function(){
    gulp.start('postbuild');
});

gulp.task('postbuild', ['templates', 'css', 'browserify', 'libs', 'copy'], function(){
    process.exit();
});
