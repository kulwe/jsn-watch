/**
 * Created by kule on 2016/8/31.
 */
var gulp=require('gulp');
var babel=require('gulp-babel');
var colors=require('colors');
var path=require('path');
var moment=require('moment');
var fs=require('fs');
var _=require('lodash');


var compiles={};
var regIgnore=/\bnode_modules[\\/]/i;
console.log(colors.green('开始监听jsn文件，使用webstorm时默认 ctrl+s 保存后开始转换'));
fs.watch('./',{
    recursive:true
},function(type,filename){
    if(path.extname(filename)!='.jsn')return;
    if(regIgnore.test(filename))return;
    compile(filename);
});

function getPath(filename){
    return path.join(process.cwd(),filename);
}
function compile(filename){
    var fn=compiles[filename];
    if(!fn){
        fn=compiles[filename]=_.debounce(_compile,1000);
    }
    fn(filename);
}
function _compile(filename){
    var destPath=path.parse(filename);
    filename=getPath(filename);

    console.log(colors.yellow('['+moment().format('HH:mm:ss')+'] babeling '+filename));
    gulp.src(filename)
        .pipe(babel({
            presets:[
                require('babel-preset-es2015'),
                require('babel-preset-react'),
                require('babel-preset-stage-0')
            ],
            plugins:[],
            comments:false
        }))
        .on('error',function(err){
            console.log(colors.red(err.message));
            console.log(err);
        })
        .pipe(gulp.dest(destPath.dir))
        .on('end',function(){
            console.log(colors.green('['+moment().format('HH:mm:ss')+'] babeled '+filename));
        });
}