var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),             //- 压缩css文件为一行；
    jshint = require('gulp-jshint'),                    //- 压缩js文件为一行；
    uglify = require('gulp-uglify'),                    //- 压缩js文件
    rev = require('gulp-rev'),                          //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),       //- 路径替换
    clean = require('gulp-clean');                      //- 清空文件夹，避免资源冗余


//路径
var findPath = './web/**',                              //需要处理的原文件路径
    savePath = './dist';                                //处理完生成新文件的路径


//清空文件夹，避免资源冗余css
gulp.task('cleanCSS',function(){
  return gulp.src('css',{read:false}).pipe(clean());
});

//清空文件夹，避免资源冗余js
gulp.task('cleanJS',function(){
  return gulp.src('js',{read:false}).pipe(clean());
});

//当cleanCSS执行完之后执行css
gulp.task('cssTask', ['cleanCSS'], function() {         //- 创建一个名为 css 的 task
  gulp.src([findPath + '/*.css'])                       //- 需要处理的css文件，放到一个字符串数组里
    .pipe(minifyCss())                                  //- 压缩处理成一行
    .pipe(rev())                                        //- 文件名加MD5后缀
    .pipe(gulp.dest(savePath))                          //- 输出文件本地
    .pipe(rev.manifest())                               //- 生成一个rev-manifest.json
    .pipe(gulp.dest(savePath + '/rev-json/css'));       //- 将 rev-manifest.json 保存到 rev 目录内
});

//当cleanJS执行完之后执行js
gulp.task('jsTask', ['cleanJS'], function() {           //- 创建一个名为 js 的 task
  gulp.src([findPath + '/*.js'])                        //- 需要处理的js文件，放到一个字符串数组里
    .pipe(jshint())                                     //- 压缩处理成一行
    .pipe(uglify())                                     //- 压缩js文件
    .pipe(rev())                                        //- 文件名加MD5后缀
    .pipe(gulp.dest(savePath))                          //- 输出文件本地
    .pipe(rev.manifest())                               //- 生成一个rev-manifest.json
    .pipe(gulp.dest(savePath + '/rev-json/js'));        //- 将 rev-manifest.json 保存到 rev 目录内
});

//当cleanHTML执行完之后,执行rev -> 替换html中的css和js
gulp.task('revTask', function() {
  gulp.src([savePath + '/rev-json/**/*.json',findPath + '/*.html']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件。通过hash来精确定位到html模板中需要更改的部分，然后将修改成功的文件生成到指定目录
    .pipe(revCollector())                               //- 执行文件内css,js名的替换
    .pipe(gulp.dest(savePath));                         //- 替换后的文件输出的目录
});

//执行任务
gulp.task('default', ['cssTask','jsTask','revTask']);