---
layout: post
title: 搭建同时支持 ES6 Module 和 CommonJS 的开发环境
date: 2018-10-30 10:09:10
tags: [JavaScript]
---
 
> 我在编写 RxJS 入门教程的时候，折腾了大半上午都没能跑出一个 demo 来，让我感到沮丧，我知道使用 node.js 分分钟就能出现效果，可我就是想用 node 的 npm 去管理项目依赖，然后在浏览器里执行，因为我感觉使用这种方式才是做前端项目管理依赖的正确方式，而不是拿来源码，拖到 H5 工程里！我坚信我是对的，因为使用 Creator 编写小游戏时就能这么用，它是如何做到的呢？又经过一个下午的折腾，终于搞明白了全部流程，并对 JavaScript 模块化编程有的新的认识。

本文是一篇基础教程，前端大神可直接忽略；旨在学习:
 
 1. 浏览器如何加载 ES6 模块(Module)？
 2. 最新语法如何兼容老版本引擎(浏览器，Node...)？
 3. Node.js 如何支持 ES6 模块(Module)?
 4. 浏览器如何加载 CommonJS 模块？
 5. 代码修改后如何自动编译并刷新浏览器预览？

本文不会讲以下概念，但可以通过准备好的连接去补习:

- 什么是 npm ？[https://www.npmjs.com.cn/](https://www.npmjs.com.cn/)
- ES6 Module 规范 [http://es6.ruanyifeng.com/#docs/module](http://es6.ruanyifeng.com/#docs/module)
- CommonJS 规范 [http://javascript.ruanyifeng.com/nodejs/module.html](http://javascript.ruanyifeng.com/nodejs/module.html)

## 浏览器加载 ES6 模块

很简单，只需要按照 ES6 的 Module 规范去编写代码，然后在 HTML 导入即可:

```js
// utils.js
export function sayHello(text) {
  const div = document.createElement('div');
  div.textContent = text || 'Hello World!';
  document.body.appendChild(div);
}

/// index.html
<script type="module">
  import {sayHello} from './utils.js';
  sayHello('ES6 Module worked.');
</script>
```

一定要注意，type 必须是 ‘module’，与导入普通 js 文件区别开，告诉浏览器你使用了 Module 。

上一篇 [《JavaScript 模块化编程》](/2018/10/28-JavaScript-Module-Programming.html)中曾提到并不是所有的浏览器版本都完全支持 ES6 语法，所以使用 ES6 模块之后，就要想办法让他在不支持 ES6 的浏览器里跑起来！

## Babel

`Babel is a JavaScript compiler.`

Babel 通过语法转换器支持最新版本的 JavaScript，允许你立刻使用新语法，无需等待浏览器支持。

- [https://babeljs.io](https://babeljs.io)
- [https://www.babeljs.cn](https://www.babeljs.cn)

### 1、安装与使用

1. 通过 npm 安装 Babel CLI

	npm install --save-dev babel-cli babel-preset-env
2. 创建 .babelrc 配置文件

	定义 .babelrc 文件，当 babel 转化时会读取这个配置文件，可以在配置文件里指定支持到哪个版本。具体参考:  [Env preset](https://www.babeljs.cn/docs/plugins/preset-env/).
		
	```
	{
	"presets": ["env"]
	}
	```
3. 在 package.json 中的 "scripts" 属性里添加一个 build 属性

	```
	"scripts": {
    	"build": "babel source -d dist"
   }
	```
4. 打开终端，	运行以下命令开始转换

	```
	npm run build
	```

### 2、运行

将 index.html 里路径修改为:

```
<script type="module">
    // import './source/index.js'
    import './dist/index.js';
</script>
```

然后浏览器运行，发现出错了，报错如下:

```
ReferenceError: Can't find variable: require
or
ReferenceError: require is not defined
```

立即搜索问题，找到这个答案:

> &nbsp;&nbsp;&nbsp;&nbsp; Yes, Babel is just intended for translating new language features to be compatible with modern javascript engines. Babel doesn't compile to require.js module import syntax. Rather it uses the CommonJS module syntax as used by Node.js. So you could run the code directly without further build dependencies in Node.js.
&nbsp;&nbsp;&nbsp;&nbsp; As it operates on single files at a time and is a straight forward translation, it doesn't make any decisions as to how you want to include the source code of those other files into the current one.
&nbsp;&nbsp;&nbsp;&nbsp; That said, if you are going to use it in browser, you will need a build system or bundler that supports CommonJS modules statements:
· See https://babeljs.io/docs/setup/#installation for a list of many typical build configurations
· Browserify and Webpack are two of the most popular ones in the Javacript ecosystem
· These systems 'bundle' your javascript code by injecting files wherever 'require' is referenced and thus typically produce one output js file which you can run in ecma5

- [https://stackoverflow.com/questions/38166498/babel-transpiles-import-to-require-but-require-isnt-useable-in-ecma5](https://stackoverflow.com/questions/38166498/babel-transpiles-import-to-require-but-require-isnt-useable-in-ecma5)
- [https://stackoverflow.com/questions/19059580/client-on-node-uncaught-referenceerror-require-is-not-defined](https://stackoverflow.com/questions/19059580/client-on-node-uncaught-referenceerror-require-is-not-defined)

意思是 Babel 没有将 ES6 Module 转成 AMD 模块规范，而是转成了 CommonJS 规范！所以需要 Browserify 或者 Webpack 这样的打包工具，将依赖处理下，并提供 CommonJS 执行的环境，从而可以在 ES5 的环境中执行！

我之前用过 webpack 这个打包工具，她的功能十分强大，不仅可以处理 JS 文件模块，资源文件也可当做模块，可以使用对应的 loader 去处理，学习成本略高，今天的目的是搞懂流程，所以选择相对简单的 Browerify 举例。

## Browerify

`Browserify lets you require('modules') in the browser by bundling up all of your dependencies.`

Browserify 通过打包依赖库，让你具备在浏览器里使用 require 的能力。

- [http://browserify.org](http://browserify.org)

### 1、安装与使用

1. 通过 npm 安装 browserify
	
	npm install browserify --save-dev
	
2. 在 package.json 中的 "scripts" 属性里添加一个 bundle 属性

	```
	"scripts": {
    	"bundle": "browserify --entry dist/index.js --outfile dist/bundle.js"
  }
	```
	
3. 打开终端，	运行以下命令开始打包

	```
	npm run bundle
	```

### 2、运行

将 index.html 里路径修改为:

```
<script type="text/javascript" src="dist/bundle.js"/>
```

然后浏览器运行，再次看到了期待已久的日志输入！

## 了解 Browserify 工作原理

阮一峰老师很好的解释了这一原理，我们也来走一遍这个过程:

1. 通过 npm 安装 browser-unpack
	
	`npm install browser-unpack --save-dev`
	
2. 在 package.json 中的 "scripts" 属性里添加一个 bundle 属性

	```
	"scripts": {
    	"unpack": "browser-unpack < dist/bundle.js > dist/unpack.json"
  }
	```
	
3. 打开终端，	运行以下命令开始打包

	```
	npm run unpack
	```
	打开 dist/unpack.json 文件，可以看到 browerify 将所有模块放入一个数组，id 属性是模块的编号，source 属性是模块的源码，deps 属性是模块的依赖。
	
	因为 index.js 里面加载了 test.js，所以 deps 属性就指定 ./test 对应 2 号模块。执行的时候，浏览器遇到 require('./test') 语句，就自动执行 2 号模块的 source 属性，并将执行后的 module.exports 属性值输出。

## Node.js 支持 ES6 模块(Module)

上一篇[《JavaScript 模块化编程》](/2018/10/28-JavaScript-Module-Programming.html)里强调了，目前 Node.js 还不支持 ES6 Module ！接下来拿 RxJS 这个库做个试验:

`npm install rxjs rxjs-compat --save`

然后编写测试代码:

```
//rx.js
var Rx = require('rxjs/Rx');

Observable.of(1,2,3).subscribe((e)=>{
  console.log('=====:' + e);
});
```

直接通过 node 执行，完成没问题！然后我们把它导入到我的 index.js 里

```
//index.js
import works from './test.js';
import './rx.js';
works("Hello,MR !");
```

然后运行会报错:

```
(function (exports, require, module, __filename, __dirname) { import works from './test.js';
                                                                     ^^^^^

SyntaxError: Unexpected identifier

```

肯定报错！Node.js 不支持这个语法！

你可能会想到刚才不是刚介绍了 Babel 吗？用它转换下语法不就行了！是的，所以只要先执行下刚写过的 

npm run build

进行编译，再让 node 执行 dist/index.js 就OK了! 

## 浏览器加载 CommonJS 模块 

有了 Browserify 的支持，我们已经具备了加载 CommonJS 规范的能力，刚才 dist/index.js 已经是 Babel 编译过的 CommonJS 规范的代码了，所以用 Browserify 直接打包按道理就能在浏览器里运行了！

是的，你成功了！这样做到了通过 npm 管理依赖库问题！

## 自动编译 & 刷新预览

我们的工作流程也随之确定了:

1. 编写/修改源文件
2. 通过 npm build 编译
3. 通过 npm bundle 打包
4. 通过 node 运行 index.html

每次写两行代码想看个效果就这么费劲么！有没有省时省力的办法啊！当然有，让我们一起来搭建一个专业的前端开发环境吧！

### 自动化构建工具 Gulp

1. 作为项目的开发依赖（devDependencies）安装：

	npm install --save-dev gulp

2. 在项目根目录下创建一个名为 gulpfile.js 的文件：

	```
	var gulp = require('gulp');
	
	gulp.task('start', function() {
	  console.log('Gulp works!');
	});
	```

3. 在 package.json 中的 "scripts" 属性里添加一个 start 属性

	```
	"scripts": {
    	"start": "gulp start"
  }
	```
	
4. 打开终端，	运行以下命令执行 gulp 任务

	```
	npm run start
	```
	
5. 添加 gulp 任务

	```
	/// babel任务
	const babel = require('gulp-babel');
	
	gulp.task('babel',function (cb) {
    gulp.src('source/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        // .pipe(uglify())
        .pipe(gulp.dest('dist'));
    cb();
	});

	/// browserify任务
	
	const browserify = require('browserify');
	const source = require('vinyl-source-stream');

	gulp.task('browserify',function (cb) {
    var b = browserify({
        entries: "dist/index.js"
    });

    b.bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist"));
    cb();
	});
	
	/// 修改 start 任务，把 'babel' 和 'browserify' 任务作为它的同步依赖：
	gulp.task('start',['server','babel','browserify','watch2'],function () {
    console.log('OK!');
	});
	```
	终端里重新执行 npm run start，看下效果吧，其实是将 build 和 bundle 合二为一了。接下来做个文件监听，当文件发生变化，自动触发这个编译打包过程！
	```
	/// watch 任务
	gulp.task('watch',function () {
	    gulp.watch('source/*.js', ['babel']);
	    gulp.watch('dist/index.js', ['browserify']);
	});
	
	```
	再次修改 start 任务:
	```
	gulp.task('start',['babel','browserify','watch'],function () {
    console.log('OK!');
	});
	```
	这样一来，只要 js 文件发生变化就会自动编译，打包了！万事俱备，只差一个听使唤的资源服务器了，当打包完毕后让服务器通知浏览器去刷新 H5 页面:
	```
	/// server任务
	const browserSync = require('browser-sync').create();
	const reload      = browserSync.reload;

	gulp.task('server',function () {
    browserSync.init({
        server: "./"
    });
	});
	
	gulp.task('watch-html',function () {
    gulp.watch('*.html').on('change',reload);
	});
		
	gulp.task('watch',['watch-html'],function () {
	    const watcher = gulp.watch('source/*.js', ['babel','browserify']);
	    watcher.on('change',function () {
	        console.log('bundle done,auto reload!');
	        reload();
	    });
	});

	gulp.task('start',['babel','browserify','server','watch'],function () {
    console.log('OK!');
	});
	```
	再次执行 npm run start ，你会看到浏览器窗口自动打开了，终端输出如下信息:
	```
	[14:42:41] Using gulpfile ~/Documents/demoWorkspace/rxjs/gulpfile.js
	[14:42:41] Starting 'server'...
	[14:42:41] Finished 'server' after 12 ms
	[14:42:41] Starting 'babel'...
	[14:42:41] Finished 'babel' after 6.03 ms
	[14:42:41] Starting 'browserify'...
	[14:42:42] Finished 'browserify' after 5.67 ms
	[14:42:42] Starting 'watch-html'...
	[14:42:42] Finished 'watch-html' after 6.62 ms
	[14:42:42] Starting 'watch'...
	[14:42:42] Finished 'watch' after 2.77 ms
	[14:42:42] Starting 'start'...
	OK!
	[14:42:42] Finished 'start' after 72 μs
	[Browsersync] Access URLs:
	 ------------------------------------
	       Local: http://localhost:3000
	    External: http://10.7.36.117:3000
	 ------------------------------------
	          UI: http://localhost:3001
	 UI External: http://localhost:3001
	 ------------------------------------
	[Browsersync] Serving files from: ./
	```
	每当你修改了 html，或者 js 文件，浏览器就会自动刷新，帮你节省下来一大把时间！
	
# 参考

- [ECMAScript modules in browsers](https://jakearchibald.com/2017/es-modules-in-browsers/)
- [An Intro To Using npm and ES6 Modules for Front End Development](https://wesbos.com/javascript-modules/)
- [浏览器加载 CommonJS 模块的原理与实现](http://www.ruanyifeng.com/blog/2015/05/commonjs-in-browser.html)
- [Gulp入门](https://www.gulpjs.com.cn/docs/getting-started/)
- [Browsersync + Gulp.js](http://www.browsersync.cn/docs/gulp/)