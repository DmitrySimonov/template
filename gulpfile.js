'use strict';

var   gulp          = require('gulp'),
      args          = require('yargs').argv,
      sass          = require('gulp-sass'),
      less          = require('gulp-less'),
      autoprefixer  = require('gulp-autoprefixer'),
      cleanCSS      = require('gulp-clean-css'),
      rename        = require('gulp-rename'),
      concat        = require('gulp-concat'),
      connect       = require('gulp-connect'),
      minifyCss     = require('gulp-minify-css'),
      coffee        = require ('gulp-coffee'),
      wiredep       = require('wiredep').stream,
      jade          = require('gulp-jade'),
      sourcemaps    = require('gulp-sourcemaps'),
      fileinclude   = require('gulp-file-include'),
      csscomb       = require('gulp-csscomb'),
      useref        = require('gulp-useref'),
      gutil         = require('gulp-util'),
      gulpif        = require('gulp-if'),
      uglify        = require('gulp-uglify');

// Livereload
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    port: 8080,
    livereload: true
  });
});

// Добавление библиотек bower


gulp.task('bower-footer', function () {
  gulp.src('app/footer-scripts.html')
    .pipe(wiredep({
      directory: "app/bower_components/",
    }))
    .pipe(gulp.dest('./app'))
    .pipe(connect.reload());
});

gulp.task('bower-head', function () {
  gulp.src('app/head.html')

    .pipe(wiredep({
      directory: "app/bower_components/",
    }))
    .pipe(gulp.dest('./app'))
    .pipe(connect.reload());
});
gulp.task('bower', ['bower-head','bower-footer'],function () {
  gutil.log('Done!');
});
gulp.task('include', function() {
  gulp.src(['./app/templates/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./app'))
    .pipe(connect.reload());
});

// Coffee
// gulp.task('coffee', function() {
//   gulp.src('./app/coffee/*.coffee')
//     .pipe(sourcemaps.init())
//     .pipe(coffee())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('./dest/js'))
//     .pipe(connect.reload());
// });

// Sass
gulp.task('scss', function () {
  gulp.src('./app/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['> 1%', 'IE 7'], cascade: false }))
    .pipe(csscomb())
    .pipe(gulp.dest('./app/css/'))
    .pipe(connect.reload());
});

// gulp.task('sass', function () {
//   gulp.src('app/sass/**/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(sourcemaps.init())
//     .pipe(sass().on('error', sass.logError))
//     .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
//     .pipe(sourcemaps.write('./'))
//     .pipe(csscomb())
//     .pipe(gulp.dest('app/css'))
//     .pipe(connect.reload());
// });

// Less
gulp.task('less', function () {
    gulp.src('app/less/**/*.less')
      .pipe(less())
      .pipe(csscomb())
      .pipe(gulp.dest('app/css/'))
      .pipe(connect.reload());
});
// Jade
gulp.task('jade', function() {
  var YOUR_LOCALS = {};
  gulp.src('app/jade/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('app/'))
    .pipe(connect.reload());
});

// Работа с HTML
gulp.task('html', function () {
  gulp.src('app/*.html')
    .pipe(connect.reload());
});

// Работа с JS
gulp.task('js', function () {
  gulp.src('./app/js/*.js')
    .pipe(connect.reload());
});

// Работа с CSS
gulp.task('css', function () {
  gulp.src('app/css/*.css')
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(connect.reload());
});

// Работа с изображениями
gulp.task('img:build', function() {
    gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img'));
});

// Работа со шрифтами
gulp.task('fonts:build', function() {
    gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('watch', function () {
 gulp.watch('bower.json',['bower']);
 gulp.watch('app/scss/*.scss', ['scss']);
 gulp.watch('app/jade/*.jade', ['jade']);
 gulp.watch('app/less/*.less', ['less']);
 gulp.watch('app/js/**/*.js', ['js']);
 // gulp.watch('app/coffee/**/*.coffee', ['coffee']);
 gulp.watch('app/includes/*.html', ['include']);
 gulp.watch('app/templates/*.html', ['include']);
 gulp.watch('app/head.html', ['include']);
 gulp.watch('app/footer-scripts.html', ['include']);
 // gulp.watch(['app/*.html'], ['html']);
 // gulp.watch(['app/css/*.css'], ['css']);
});

// Создаем папку в продакшн (gulp build)
gulp.task('build', ['fonts:build','img:build'],function () {
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        // .pipe(gulpif('*.js', uglify()))
        // .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-min', ['fonts:build','img:build'],function () {
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['connect', 'html', 'bower','css', 'js', 'scss', 'include', 'watch']);