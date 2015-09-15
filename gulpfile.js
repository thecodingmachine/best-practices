/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2011-2014 Webcomm Pty Ltd
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Load plugins
var
    gulp         = require('gulp'),
    less         = require('gulp-less'),
    minifycss    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    rimraf       = require('gulp-rimraf'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    livereload   = require('gulp-livereload');

var config = {

    // If you do not have the live reload extension installed,
    // set this to true. We will include the script for you,
    // just to aid with development.
    appendLiveReload: false, // TODO a passer en false

    // Should CSS & JS be compressed?
    minifyCss: true,
    uglifyJS: true

}

// CSS
gulp.task('css', function() {
    var stream = gulp
        .src('template/less/style.less')
        .pipe(less().on('error', notify.onError(function (error) {
            return 'Error compiling LESS: ' + error.message;
        })))
        .pipe(gulp.dest('template/dist/css'));

    if (config.minifyCss === true) {
        stream.pipe(minifycss());
    }

    return stream
        .pipe(gulp.dest('template/dist/css'))
        .pipe(notify({ message: 'Successfully compiled LESS' }));
});

// Images
gulp.task('images', function() {
    return gulp
        .src('template/img/**/*')
        .pipe(gulp.dest('template/dist/img'))
        .pipe(notify({ message: 'Successfully processed image' }));
});

// JS
gulp.task('js', function() {
    var scripts = [
        'template/js/GlobalFunction.js',
        'template/js/scripts.js',
        'template/js/libs/bootstrap.min.js',
        'template/js/libs/FitVids.js-master/jquery.fitvids.js',
        'template/js/fitvid.js',
        'template/js/inner-plan.js'
    ];

    var stream = gulp
        .src(scripts)
        .pipe(concat('template/script.js'));

    if (config.uglifyJS === true) {
        stream.pipe(uglify());
    }

    return stream
        .pipe(gulp.dest('template/dist/js'))
        .pipe(notify({ message: 'Successfully compiled JavaScript' }));
});


// Fonts
gulp.task('fonts', function() {
    return gulp
        .src([
            'template/less/font-awesome/fonts/**/*'
        ])
        .pipe(gulp.dest('template/dist/fonts'))
        .pipe(notify({ message: 'Successfully processed font' }));
});

// Rimraf
gulp.task('rimraf', function() {
    return gulp
        .src(['template/css', 'template/js', 'template/images'/*, 'template/fonts'*/], {read: false})
        .pipe(rimraf());
});

// Default task
gulp.task('default', function() {
    gulp.start('css');
    gulp.start('js');
    gulp.start('images');
    //gulp.start('fonts');
});

// Petit Chaton ! Chaton, chaton...
gulp.task('chaton', function() {
    gulp.start('css');
    gulp.start('js');
    gulp.start('images');
    //gulp.start('fonts');
});

// Watch
gulp.task('watch', function() {

    // Watch .less files
    gulp.watch('template/less/**/*.less', ['css']);
    gulp.watch('template/img/**/*', ['images']);
    gulp.watch('template/js/**/*', ['js']);

    // Create LiveReload server
    //var server = livereload();
    livereload.listen();
    // Watch any files in , reload on change

    gulp.watch(['template/dist/css/base.css']).on('change', livereload.changed);
    /*gulp.watch(['template/css/style.css']).on('change', function(file) {
     server.changed(file.path);
     });*/
});
