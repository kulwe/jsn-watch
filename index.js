/**
 * Created by kule on 2016/8/31.
 */
var gulp = require('gulp');
var babel = require('gulp-babel');
var colors = require('colors');
var path = require('path');
var moment = require('moment');

function watch(){
    gulp.watch('**/*.jsn', function (e) {
        var _path = e.path;
        var destPath = path.parse(_path);
        console.log(colors.yellow('[' + moment().format('HH:mm:ss') + '] babeling ' + _path));
        gulp.src(_path)
            .pipe(babel({
                presets: [
                    require('babel-preset-es2015'),
                    require('babel-preset-react'),
                    require('babel-preset-stage-0')
                ],
                plugins: [],
                comments: false
            }))
            .on('error', function (err) {
                console.log(colors.red(err.message));
                console.log(err);
            })
            .pipe(gulp.dest(destPath.dir))
            .on('end', function () {
                console.log(colors.green('[' + moment().format('HH:mm:ss')+ '] babeled' + _path));
            });
    })
        .on('error', function (err) {
            console.log(colors.red(err.message));
            setTimeout(watch, 3000);
        });
}

console.log(colors.green('开始监听jsn文件，使用webstorm时默认 ctrl+s 保存后开始转换'));
watch();