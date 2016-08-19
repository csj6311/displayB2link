
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename'); // gulp-rename 모듈 호출
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');

gulp.task('lint', function() {
    return gulp.src('*.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('combine:js', function () {
    return gulp.src('*.js')
        .pipe(concat('combine.js'))
        .pipe(uglify({
            mangle : true, // 알파벳 한 글자 압축 과정 설정
            preserveComments : 'all' // 'all', 또는 'some'
        }))
        .pipe(rename('combine.min.js'))
        .pipe(gulp.dest('out'));
});

/**
 * =================================+
 * 지속적인 업무 관찰을 위해 watch 등록
 * 즉, 파일 변경을 감지한다.
 * =================================+
 */

gulp.task('html', function (done) {
browserSync.reload();
done();
});

/**
 * ==============================+
 * @task : browserSync
 * ==============================+
 */
gulp.task('browserSync',['combine:js','html'], function () {
    return browserSync.init({
        proxy: "http://localhost:3000",
        files: ["*.*"],
        port: 7000
    });
});

gulp.task('babel', function() {
    return gulp.src('./*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('./', {sourceRoot: './'}))
        .pipe(gulp.dest('out'));
});

gulp.task('watch', function () {

    /**
     * ====================================+
     * 1. 감지할 디렉터리를 정의
     * 2. 변경이 감지되면 실행할 task 를 지정
     * ====================================+
     */

    gulp.watch('./*.js', ['combine:js']);
    gulp.watch('views/*.ejs',['html']);

});

gulp.task('default', ['browserSync','watch','lint']);