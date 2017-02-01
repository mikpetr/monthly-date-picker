var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var templates = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');

gulp.task('css', function () {
    return gulp.src('src/styles/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist'));
});

gulp.task('templates', function () {
    gulp.src([
        'src/js/date-picker/*.html'
    ])
    .pipe(minifyHTML({
        quotes: true
    }))
    .pipe(templates('templates.js', {
        standalone: true
    }))
    .pipe(gulp.dest('tmp'));
});

gulp.task('angular', ['templates'], function () {
  gulp.src([
      './tmp/*.js',
      './src/js/date-picker/*.js'
    ])
    .pipe(concat('monthlyDatePicker.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['css', 'angular']);