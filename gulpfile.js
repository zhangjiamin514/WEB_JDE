var gulp = require('gulp');
var less=require('gulp-less');    //less转css
var $ = require('gulp-load-plugins')();   //插件统一加载
var open = require('open');   //打开浏览器
var babel = require('gulp-babel');   //转es5
var fileinclude  = require('gulp-file-include');  //模版
var replace = require('gulp-replace');  //查找替换hash
var rename=require('gulp-rename');   //重命名

var moment = require('moment');  //时间
moment.locale('zh-cn');
var _today = moment();   

var app = {
    srcPath: 'src/',
    devPath: 'build/',//开发目录
    prdPath: 'dist/' //生产目录
};

//操作包文件
gulp.task('lib', function () {
    //操作components下所有的js文件
    gulp.src('lib/**/*.js')
        //在build下创建vendor文件夹，并将包构建进去
        .pipe(gulp.dest(app.devPath + 'lib'))
        //通知浏览器自动刷新更改 低级浏览器不支持
        .pipe($.connect.reload());
    gulp.src('lib/**/*.css')
        //在build下创建vendor文件夹，并将包构建进去
        .pipe(gulp.dest(app.devPath + 'lib'))
        //通知浏览器自动刷新更改 低级浏览器不支持
        .pipe($.connect.reload());
});

//操作json文件
gulp.task('json', function () {
    gulp.src(app.srcPath +'data/**/*.json')
        .pipe(gulp.dest(app.devPath + 'data'))
        .pipe($.connect.reload());
});

//操作less(css)
gulp.task('less', function () {
    //操作主样式文件
    gulp.src(app.srcPath + 'css/**/*.less')
        //解析less文件
        .pipe($.less())
        //在build中生成css文件夹用来存放index.css
        .pipe(gulp.dest(app.devPath + 'css'))
        //压缩css文件
        .pipe($.connect.reload());
});

gulp.task('font', function () {
    //字体文件
    gulp.src(app.srcPath + 'font/**/*.*')
        .pipe(gulp.dest(app.devPath+"font"))
        .pipe($.connect.reload());
});

//操作js
gulp.task('js', function () {
    //对script下的所有js进行操作
    gulp.src(app.srcPath + 'js/**/*.js')
        //将这些js文件进行合并
        .pipe(babel({
            presets: ['es2015']
        }))
//      .pipe($.concat('index.js'))
        .pipe(gulp.dest(app.devPath + 'js'))
        //将这些js文件进行压缩
        .pipe($.connect.reload());
});

//操作图片
gulp.task('images', function () {
    gulp.src(app.srcPath + 'images/**/*')
        .pipe(gulp.dest(app.devPath + 'images'))
        .pipe($.connect.reload());
});

//操作html文件
gulp.task('html', function () {
    //操作src下所有的html文件
    gulp.src(['src/**/*.html','!src/include/**.html'])
	    .pipe(fileinclude({
	          prefix: '@@',
	          basepath: '@file'
	        }))
	    .pipe(replace('~hash', ""))
        .pipe(gulp.dest(app.devPath))
        .pipe($.connect.reload());
});


//打包
gulp.task('build', ['images', 'js', 'less', 'lib', 'html', 'json','font']);

//清除开发目录
gulp.task('clean_b', function () {
    gulp.src(app.devPath)
        .pipe($.clean());
});

//服务

gulp.task('serve', ['build'], function () {
    //连接服务
    $.connect.server({
        //root代表从哪个路径下开始读取 这里是从开发目录下开始读取
        root: [app.devPath],
        //开启后自动刷新浏览器 IE8以下暂不支持
        livereload: true,
        //定义端口
        port: 1232,
    });
    //默认打开浏览器
    open('http://localhost:1232');
    //监控文件 自动构建代码
    gulp.watch('bower_lib/**/*', ['lib']);
    //监控的是src下的各类文件
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/data/**/*.json', ['json']);
    gulp.watch('src/font/**/*.*', ['font']);
    gulp.watch('src/css/**/*.less', ['less']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/images/**/*', ['images']);
});


gulp.task('default', ['serve']);


//清除完成文件
gulp.task('clean_d', function () {
    gulp.src(app.prdPath)
        .pipe($.clean());
});
//生成完成文件
gulp.task('dist', function () {
//	gulp.src(app.prdPath)
//      .pipe($.clean());
        
	var time_now=_today.format('YYYYMMDDHHmm');
    
    //操作components下所有的js文件lib
    gulp.src('lib/**/*.js')
        //在dist下创建vendor文件夹，并将包构建进去
        .pipe(gulp.dest(app.prdPath + 'lib'))
        //通知浏览器自动刷新更改 低级浏览器不支持
        .pipe($.connect.reload());
    gulp.src('lib/**/*.css')
        //在dist下创建vendor文件夹，并将包构建进去
        .pipe(gulp.dest(app.prdPath + 'lib'))
        //通知浏览器自动刷新更改 低级浏览器不支持
        .pipe($.connect.reload());
    //json
    gulp.src(app.srcPath + 'data/**/*.json')
        .pipe(gulp.dest(app.prdPath+ 'data'))
//      .pipe(rename(function(path){
//          path.basename +="_"+time_now;
//      }))
        .pipe($.connect.reload());
    //字体文件
    gulp.src(app.srcPath + 'font/**/*.*')
        .pipe(gulp.dest(app.prdPath+"font"))
        .pipe($.connect.reload());
    //css 
    gulp.src(app.srcPath + 'css/**/*.less')
        //解析less文件
        .pipe($.less())
        //压缩css文件
        .pipe($.cssmin())
        .pipe(replace(".jpg",function(e){
	    	return "_"+time_now+e
	    }))
	    .pipe(replace(".png",function(e){
	    	return "_"+time_now+e
	    }))
	    .pipe(replace(".gif",function(e){
	    	return "_"+time_now+e
	    }))
        //在build中生成css文件夹用来存放压缩后的index.css
        .pipe(rename(function(path){
            path.basename +="_"+time_now;
        }))
        .pipe(gulp.dest(app.prdPath + 'css'))
        .pipe($.connect.reload());
    //对script下的所有js进行操作
    gulp.src(app.srcPath + 'js/**/*.js')
        //将这些js文件进行合并
        .pipe(babel({
            presets: ['es2015']
        }))
//      .pipe($.concat('index.js'))
        //将这些js文件进行压缩
        .pipe($.uglify())
        .pipe(rename(function(path){
            path.basename +="_"+time_now;
        }))
        .pipe(gulp.dest(app.prdPath + 'js'))
        .pipe($.connect.reload());
    //图片
    gulp.src(app.srcPath + 'images/**/*')
        //压缩图片
//      .pipe($.imagemin())
        .pipe(rename(function(path){
        	if(path.extname!=""){
        		path.basename +="_"+time_now;
        	}
        }))
        .pipe(gulp.dest(app.prdPath + 'images'))
        .pipe($.connect.reload());
    //操作src下所有的html文件
    gulp.src(['src/**/*.html','!src/include/**.html'])
	    .pipe(fileinclude({
	          prefix: '@@',
	          basepath: '@file'
	        }))
	    .pipe(replace(".jpg",function(e){
	    	return "_"+time_now+e
	    }))
	    .pipe(replace(".png",function(e){
	    	return "_"+time_now+e
	    }))
	    .pipe(replace(".gif",function(e){
	    	return "_"+time_now+e
	    }))
	    .pipe(replace("~hash","_"+time_now))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());
});
//gulp.task('shiyan', function () {
// 
//});

