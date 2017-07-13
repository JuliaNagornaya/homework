var gulp = require('gulp'), // уст если нап require, установка: npm install --save-dev gulp-complexity
	concatCss = require('gulp-concat-css'), // из многих файлов делает один
	cssmin = require('gulp-cssmin'), // минифицирует css файлы
	rename = require('gulp-rename'), // переименовует файлы
	stylus = require('gulp-stylus'), // Stylus в CSS
    autoprefixer = require('gulp-autoprefixer'), // префиксы к CSS свойствам
    uglify = require('gulp-uglify'), // минифицирует js файлы
    imagemin = require('gulp-imagemin'), // минифицирует jpg файлы
    pngquant = require('imagemin-pngquant'), // минифицирует png файлы
    jade = require('gulp-jade'), // Jade в HTML
    watch = require('gulp-watch'), // при изменении выполняет таски
    uncss = require('gulp-uncss'), // удаляет ненужные стили
    complexity = require('gulp-complexity'), // проверка на качество кода
    jscpd = require('gulp-jscpd'); // для поиска дубликатов в коде

gulp.task('concat', function () {
  return gulp.src('./public/css/*.css') // дописать путь откуда берем файлы
    .pipe(concatCss("bundle.css"))  //
    .pipe(gulp.dest('./public/build/')); // dest куда положить
});

gulp.task('css', function () {
  return gulp.src('./public/css/*.css')
  	.pipe(uncss({
            html: ['./*.html']
         }))
    .pipe(concatCss("bundle.css"))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/build/'));
});

gulp.task('styl', function() {
    return gulp.src('./public/styl/*.styl')
        .pipe(stylus({
            linenos: false
        }))
        .pipe(autoprefixer([
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6'
        ]))
        .pipe(concatCss('styl.css'))
        .pipe(gulp.dest('./public/css/'));

});

gulp.task('js', function () { // минифицирует js
    return gulp.src('./public/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/build/'));
});

gulp.task('image', function () {
    return gulp.src('public/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('public/images/'));
});

gulp.task('jade', function() {
    var YOUR_LOCALS = {};

    return gulp.src('./public/template/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(prettify({indent_char: ' ', indent_size: 3}))
        .pipe(gulp.dest('./public/'))
});

gulp.task('watch', function() {
    gulp.watch("./public/styl/*.styl", ['styl']);
    gulp.watch("./public/css/*.css", ['css']);
    gulp.watch("./public/js/*.js", ['js']);
    gulp.watch("./public/template/*.jade", ['jade']);
});

gulp.task('autopolyfiller', function () {
    return gulp.src('./public/js/*.js')
        .pipe(autopolyfiller('result_polyfill_file.js'))
        .pipe(gulp.dest('./public/build/'));
});

gulp.task('complexity', function () {
    return gulp.src('./public/js/*.js')
        .pipe(complexity());
});

gulp.task('copy-past', function () {
    return gulp.src('./public/js/*.js')
        .pipe(jscpd({
	      'min-lines': 1,
	      'min-tokens': 40,
	      verbose    : true
	}));
});
