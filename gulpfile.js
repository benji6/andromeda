const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const connect = require('gulp-connect');
const gulp = require('gulp');
const minifyCSS = require('gulp-minify-css');
const minifyHTML = require('gulp-minify-html');
const plumber = require('gulp-plumber');
const react = require('gulp-react');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const publicPath = 'public';

gulp.task('connect', function () {
  return connect.server({
    livereload: true,
    root: publicPath,
  });
});

gulp.task('html', function () {
  return gulp.src('client/html/index.html')
    .pipe(plumber())
    .pipe(minifyHTML())
    .pipe(gulp.dest(publicPath))
    .pipe(connect.reload());
});

gulp.task('css', function () {
  gulp.src('client/sass/index.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(publicPath + '/css'))
    .pipe(connect.reload());
});

gulp.task('jsDev', function () {
  return gulp.src('client/js/**/*.js*')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(react())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(publicPath + '/js'))
    .pipe(connect.reload());
});

gulp.task('jsProd', function () {
  return gulp.src('client/js/**/*.js*')
    .pipe(babel())
    .pipe(react())
    .pipe(uglify())
    .pipe(gulp.dest(publicPath + '/js'));
});

gulp.task('watch', function () {
  gulp.watch('client/html/**/*.html', function () {
    return runSequence('html');
  });
  gulp.watch('client/sass/**/*.scss', function () {
    return runSequence('css');
  });
  gulp.watch('client/js/**/*.js*', function () {
    return runSequence('jsDev');
  });
});

gulp.task('build', function () {
  return runSequence(['html', 'css', 'jsProd']);
});

gulp.task('default', function () {
  return runSequence(['watch', 'html', 'css', 'jsDev'], 'connect');
});
