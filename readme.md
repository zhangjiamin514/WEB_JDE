# 欢迎使用 WEB_JDE 开发环境

------

此环境功能可以自动打包页面，js，css，添加文件后缀，避免缓存问题，使用请遵循基本环境规则，否则会出现不可预知问题：

> * 目录说明
> * 使用说明


## 目录说明 ##
| 目录        | 说明   | 
| --------   | -----  |
|  lib     | 公共文件存放位置  js、css |
|  build     | 开发生成文件 |
|  dist     | 打包生成文件 |
|  src     | 开发文件位置 |
|  gulpfile.js     | 配置命令文件 |
|  package.json     | 配置插件文件 |

| src子目录| 说明   | 
| --------   | -----  |
|  data     | 数据json存放位置 |
|  images   | 图片存放位置 |
|  include  | 公用模版存放位置 |
|  js   | js存放位置 |
|  css    | css样式文件存放位置 |
|  font    | 字体文件存放位置 |
|  page     | 页面存放位置（不包括index的其他子页面） |


------

## 使用说明


一、命令说明

 1. 全局安装 gulp：npm install --global gulp
 2. 构建本地环境 npm install
 3. 直接输入gulp  运行开发环境，自动打开首页
 4. 打包命令 gulp dist
 5. 清除开发文件 gulp clean_b
 6. 清除打包文件 gulp clean_d

二、页面规则说明

 1. js，css文件引用
 公共的文件<br>`<link rel="stylesheet" type="text/css" href="./lib/jquery-1.11.3.min.js">`
其他需要去缓存的文件,在原有名字后面加~hash<br>`<script src="./js/index~hash.js" type="text/javascript" charset="utf-8"></script>`
 2. 公用模版调用
 首页模版引用：@@include('include/header.html')
 二级页面引用：@@include('../include/header.html')
 三级页面引用：@@include('../../include/header.html')
 3. js统一用es6 class方式

## 注意事项 ##

 1. 文件引用要用相对路径，src相对于开发来说就是根目录，所以页面中都是以src为根目录。
 2. 模版的路径也是以src为根目录。
 3. 图片的路径也是以src为根目录。
 4. lib公共目录只用./lib/文件名，就可以了。

