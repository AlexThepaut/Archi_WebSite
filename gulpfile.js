/* Needed gulp config */

var gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const { series } = require('gulp');
const del = require('del');

/* Setup scss path */
var paths = {
    scss: './sass/*.scss'
};

/* Scripts task */
function scripts() {
    return gulp.src([
        /* Add your JS files here, they will be combined in this order */
        'js/vendor/jquery.min.js',
        'js/vendor/jquery.easing.1.3.js',
        'js/vendor/jquery.stellar.min.js',
        'js/vendor/jquery.flexslider-min.js',
        'js/vendor/imagesloaded.pkgd.min.js',
        'js/vendor/isotope.pkgd.min.js',
        'js/vendor/jquery.timepicker.min.js',
        'js/vendor/bootstrap-datepicker.js',
        'js/vendor/photoswipe.min.js',
        'js/vendor/photoswipe-ui-default.min.js',
        'js/vendor/owl.carousel.min.js',
        'js/vendor/bootstrap.min.js',
        'js/vendor/jquery.waypoints.min.js'
    ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
}

function minifyCustom() {
    return gulp.src([
        /* Add your JS files here, they will be combined in this order */
        'js/custom.js'
    ])
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
}

/* Sass task */
function sassTask() {
    return gulp.src('scss/style.scss')
        .pipe(plumber())
        .pipe(sass({
            errLogToConsole: true,

            //outputStyle: 'compressed',
            // outputStyle: 'compact',
            // outputStyle: 'nested',
            outputStyle: 'expanded',
            precision: 10
        }))

        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(gulp.dest('css'))

        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('css'))
        /* Reload the browser CSS after every change */
        .pipe(reload({ stream: true }));
}

function mergeStyles() {
    return gulp.src([
        'css/vendor/bootstrap.min.css',
        'css/vendor/animate.css',
        'css/vendor/icomoon.css',
        'css/vendor/flexslider.css',
        'css/vendor/owl.carousel.min.css',
        'css/vendor/owl.theme.default.min.css',
        'css/vendor/photoswipe.css',
        'css/vendor/jquery.timepicker.css',
        'css/vendor/bootstrap-datepicker.css',
        'css/vendor/default-skin.css',
    ])
        // .pipe(sourcemaps.init())
        // .pipe(autoprefixer({
        //     browsers: ['last 2 versions'],
        //     cascade: false
        // }))
        .pipe(concat('styles-merged.css'))
        .pipe(gulp.dest('css'))
        // .pipe(rename({suffix: '.min'}))
        // .pipe(minifycss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
        .pipe(reload({ stream: true }));
}

/* Reload task */
function bsReload() {
    browserSync.reload();
}

/* Prepare Browser-sync for localhost */
function serve() {
    browserSync.init(['css/*.css', 'js/*.js'], {

        proxy: 'localhost/'
        /* For a static server you would use this: */
        /*
        server: {
            baseDir: './'
        }
        */
    });
}

function build() {
    return gulp.src(['index.html'])
    .pipe(gulp.dest('dist/'))
    .pipe(gulp.src([
        'css/style.min.css',
        'css/styles-merged.css'
    ]))
    .pipe(gulp.dest('dist/css'))
    .pipe(gulp.src([
        'js/scripts.min.js',
        'js/custom.min.js'
    ]))
    .pipe(gulp.dest('dist/js'))
    .pipe(gulp.src(['img/**/*']))
    .pipe(gulp.dest('dist/img'))
    .pipe(gulp.src(['fonts/**/*']))
    .pipe(gulp.dest('dist/font'));
}

function clean(cb) {
    del('dist/**', {force:true});
    cb();
}

/* Watch scss, js and html files, doing different things with each. */

function defaultTask() {
    gulp.watch(['scss/*.scss', 'scss/**/*.scss'], sassTask);
    gulp.watch(['js/custom.js'], minifyCustom);
    gulp.watch(['*.html'], bsReload);
}

exports.build = series(clean, scripts, minifyCustom, sassTask, mergeStyles, build)
exports.scripts = scripts
exports.sass = sassTask
exports.default = defaultTask