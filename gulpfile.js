const autoprefixer = require('gulp-autoprefixer')
const babelify = require('babelify')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const gulp = require('gulp')
const gutil = require('gulp-util')
const minifyCSS = require('gulp-minify-css')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')
const sourcemaps = require('gulp-sourcemaps')
const watchify = require('watchify')

const browserifyEntryPath = 'src/index.js'
const distPath = 'dist'

gulp.task('styles', () => gulp.src('src/index.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 Chrome versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(distPath)))

gulp.task('scriptsDev',
  () => watchify(browserify(browserifyEntryPath, Object.assign({}, watchify.args, {debug: true})))
      .transform(babelify, {
        stage: 0,
        blacklist: [
          'es6.arrowFunctions',
          'es6.spread',
          'es6.templateLiterals',
          'regenerator',
          'es6.forOf',
          'es6.constants'
        ]
      })
      .bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(distPath)))

gulp.task('watch', () => {
  gulp.watch('src/**/*.scss', ['styles'])
  gulp.watch('src/**/*.js', ['scriptsDev'])
})

gulp.task('build', ['styles'])
gulp.task('default', ['styles', 'scriptsDev', 'watch'])
