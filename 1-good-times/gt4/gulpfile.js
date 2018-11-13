const gulp = require('gulp');
const less = require('gulp-less');
const minifyCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const order = require('gulp-order');

gulp.task('css', function () {
    gulp.src(['css/*.css'])
        .pipe(less())
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
    gulp.src([
        'js/*.js',
    ])
        .pipe(order([
            'nette.forms.js',
            'nette.ajax.js',
            'main.js'
        ]))
        .pipe(uglify())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist'));
});
