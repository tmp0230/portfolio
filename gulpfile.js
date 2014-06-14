// TODO: When processhtml will be updated with environment, remove Templates Dev section
// TODO: When gulp 4 will be out, remove gulp.start() in clean (something will allow to do so)

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
            '!public/app/js/libs{,/**}',
            '!public/app/js/admin{,/**}',
            'public/app/js/**/*.js'
        ], // All js but not libs or admin
        vendors: [
            'public/app/js/libs/underscore.js',
            'public/app/js/libs/backbone.js',
            'public/app/js/libs/*.js'
        ],
        copyFiles: [
            '!public/app/compass{,/**}',
            'public/app/js/admin/**/*.js', // Admin scripts
            '!public/app/js{,/**}',
            'public/app/**'
        ] // Copy all excepts js and compass
    };

// Scripts
// =======

gulp.task('scripts', function(){
    return gulp.src(paths.scripts)
        .pipe(jshint())
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
    return gulp.src('public/app/compass/scss/**/*.scss')
        .pipe(compass({
            project: path.join(__dirname, 'public/app/compass'),
            sass: 'scss'
        })
            /*.on('error', gutil.log)
            .on('error', gutil.beep)*/)
        .pipe(gulp.dest('public/dist/css'))
        .pipe(livereload())
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss({keepSpecialComments: 0}))
        .pipe(gulp.dest('public/dist/css'));
});

gulp.task('cleanCss', ['css'], function(){
    return gulp.src('public/dist/compass/css', {read: false})
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
    return gulp.src(['!templates/admin{,/**}', 'templates/**/*.html'])
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
    return gulp.src(['!templates/admin{,/**}', 'templates/**/*.html'])
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
    gulp.watch('public/app/compass/scss/**/*.scss', ['cleanCss']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.vendors, ['libs']);
    gulp.watch(paths.copyFiles, ['copy']);
});

// Clean
// =====

gulp.task('clean', function(){
    return gulp.src(['**/.DS_Store', 'public/dist', 'templates/layout/base.html', 'npm-debug.log'], {read: false})
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
