/**
 * Created by kule on 2016/8/31.
 */
var gulp = require('gulp');
var babel = require('gulp-babel');
var colors = require('colors');
var path = require('path');
var moment = require('moment');
var fs = require('fs');
var _ = require('lodash');
var argv = require('yargs').argv;

var dir = argv.dir || './';
var env = argv.env || {};
if (argv.node) {
    env = {
        targets: {
            node: _.get(process, 'versions.node')
        }
    }
};
env = _.defaultsDeep({}, env, {
    debug: true,
    useBuiltIns: true
});
var babelOptions = {
    presets: [
        [
            require('babel-preset-env'),
            env
        ],
        require('babel-preset-react'),
        require('babel-preset-stage-0')
    ],
    plugins: [
        [
            require('babel-plugin-transform-runtime'),
            {
                "helpers": true,
                "polyfill": false,
                "regenerator": false
            }
        ],
        /*            [
                        require('babel-plugin-external-helpers'),
                    ]*/
    ],
    comments: false
};
console.dir(babelOptions, {depth: 5});
//npm run jsn-watch -- --dir=./ --node --env.targets.node=8.0

var compiles = {};
var regIgnore = /\bnode_modules[\\/]/i;
console.log(colors.green('开始监听jsn文件，使用webstorm时默认 ctrl+s 保存后开始转换'));
console.log(colors.green('如果使用ES6实例方法，请在主main文件中 require(\'babel-polyfill\')'));
fs.watch(dir, {
    recursive: true
}, function (type, filename) {
    if (path.extname(filename) != '.jsn') return;
    if (regIgnore.test(filename)) return;
    compile(filename);
});

function getPath(filename) {
    return path.join(process.cwd(), filename);
}

function compile(filename) {
    var fn = compiles[filename];
    if (!fn) {
        fn = compiles[filename] = _.debounce(_compile, 1000);
    }
    fn(filename);
}

function _compile(filename) {
    var destPath = path.parse(filename);
    filename = getPath(filename);

    console.log(colors.yellow('[' + moment().format('HH:mm:ss') + '] babeling ' + filename));
    gulp.src(filename)
        .pipe(babel(babelOptions))
        .on('error', function (err) {
            console.log(colors.red(err.message));
            console.log(err);
        })
        .pipe(gulp.dest(destPath.dir))
        .on('end', function () {
            console.log(colors.green('[' + moment().format('HH:mm:ss') + '] babeled ' + filename));
        });
}