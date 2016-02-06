const autoprefixer = require('gulp-autoprefixer')
const gulp = require('gulp')
const minifyCSS = require('gulp-minify-css')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')

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

gulp.task('watch', _ => gulp.watch('src/**/*.scss', ['styles']))

gulp.task('build', ['styles'])
gulp.task('default', ['styles', 'watch'])
