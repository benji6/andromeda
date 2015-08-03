const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cdnizer = require('gulp-cdnizer');
const connect = require('gulp-connect');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const gutil = require('gulp-util');
const minifyCSS = require('gulp-minify-css');
const minifyHTML = require('gulp-minify-html');
const minifyInline = require('gulp-minify-inline');
const plumber = require('gulp-plumber');
const R = require('ramda');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');

const browserifyEntryPath = 'client/scripts/index.js';
const publicPath = 'public';

gulp.task('connect', function () {
  return connect.server({
    livereload: true,
    root: publicPath,
  });
});

gulp.task('clean', function () {
  return del('public/scripts/index*');
});

gulp.task('css', function () {
  gulp.src('client/styles/index.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest(publicPath + '/styles'))
    .pipe(connect.reload());
});

gulp.task('htmlDev', function () {
  return gulp.src('client/index.html')
    .pipe(plumber())
    .pipe(minifyInline())
    .pipe(minifyHTML())
    .pipe(gulp.dest(publicPath))
    .pipe(connect.reload());
});

gulp.task('htmlProd', function () {
  return gulp.src('client/index.html')
    .pipe(plumber())
    .pipe(cdnizer({
      allowRev: false,
      allowMin: true,
      files: [
        {
          file: 'scripts/lib/three.min.js',
          cdn: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r71/three.min.js',
        },
      ],
    }))
    .pipe(minifyInline())
    .pipe(minifyHTML())
    .pipe(gulp.dest(publicPath))
    .pipe(connect.reload());
});

gulp.task('scriptsDev', function () {
  return watchify(browserify(browserifyEntryPath, R.assoc('debug', true, watchify.args)))
    .transform(babelify, {stage: 0})
    .bundle()
    .pipe(plumber())
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(publicPath + '/scripts'))
    .pipe(connect.reload());
});

gulp.task('scriptsProd', function () {
  return browserify(browserifyEntryPath)
    .transform(babelify, {stage: 0})
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('index.js'))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(publicPath + '/scripts'));
});

gulp.task('lint', function () {
  return gulp.src('client/scripts/**/*')
    .pipe(eslint())
    .pipe(eslint.formatEach());
});

gulp.task('watch', function () {
  gulp.watch('client/html/**/*', function () {
    return runSequence('htmlDev');
  });
  gulp.watch('client/styles/**/*', function () {
    return runSequence('css');
  });
  gulp.watch('client/scripts/**/*', function () {
    return runSequence(['scriptsDev', 'lint']);
  });
});

gulp.task('build', function () {
  return runSequence('clean', ['css', 'htmlProd', 'scriptsProd', 'lint']);
});

gulp.task('default', function () {
  return runSequence('clean', ['css', 'htmlDev', 'scriptsDev', 'lint', 'watch'], 'connect');
});
