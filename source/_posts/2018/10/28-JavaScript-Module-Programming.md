---
layout: post
title: JavaScript 模块化编程
date: 2018-10-28 10:09:10
tags: [JavaScript]
---

> JavaScipt 是一门非常流程的脚本语言，特别是 Node.js 的出现，让这门语言大放异彩！也给前端开发人员转型做后端敞开了大门，同时也对 JavaScript 模块化编程产生了深远影响。
> 一起来看下模块化的发展历程吧！

## 无模块化

下面是不使用模块的方式，比如要使用 jquery 库，找到源文件使用 script 标签进行导入，type 指定为 'text/javascript'，src 是一个相对或绝对的 js 源码地址。

```html
<script type="text/javascript" src="libs/jquery.js"/>
<script type="text/javascript" src="source/util.js"/>
<script type="text/javascript" src="source/A.js"/>
<script type="text/javascript" src="source/B.js"/>
// ...
<script>
    // code...
</script>
```

这种方式可以工作，不过有些弊端:

1. 全局变量挂载重复或污染
2. 依赖关系不明显，但导入顺序还不能错
3. 更新麻烦，需要手动操作，不知道何时 jquery 库会更新
4. 版本管理混乱，可能需要通过版本控制工具追踪
5. 相同功能代码复制严重，共用代码不容易维护

带着这么多问题上路，长此以往代码会混乱不堪，需要找到一种规范去解决，开源社区为此做出了巨大努力(此处应有掌声)，下面详细看下！

## CommonJS 规范

CommonJS 规范是为了解决 JavaScript 的作用域问题而定义的模块形式，可以使每个模块都有自身的空间，定义的变量也都在这一空间里有效，不会污染全局变量。

规范规定:

1. 每个文件都是一个模块
2. 在每个模块内提供 module 对象，表示当前模块
2. 模块必须通过 module.exports 对外导出变量、对象、类、方法、数据等一切合法符号
3. 通过 require() 来导入其他模块的输出到当前模块

记住: **模块导出的是什么，导入的就是什么**！

一个很直观的例子：

```js
// moduleA.js
module.exports = function( value ){
    return value * 2;
}
// moduleB.js
var multiplyBy2 = require('./moduleA');
var result = multiplyBy2(4);
```

CommonJS 是同步加载模块，并且做了缓存，即加载一次后不再加载，而是将缓存的结果直接返回。

Node.js 遵循的正是 CommonJS 规范，并且提供了一个默认的包管理工具 --- npm，用于管理模块之间的依赖关系，可以方便的开发，安装，更新，卸载依赖包！

## AMD 规范

CommonJS 规范加载模块是同步的，也就是说，只有加载完成，才能执行后面的操作。AMD规范则是非同步加载模块，允许指定回调函数。由于 Node.js 主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以 CommonJS 规范比较适用。但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式，因此浏览器端一般采用 AMD 规范。而 AMD 规范的实现，就是大名鼎鼎的 [require.js](https://requirejs.org/) 了。

AMD 标准中，定义了下面两个API：

   1. 使用 require([module], callback) 加载模块，并且支持 CommonJS 的模块导出方式
   2. define(id, [depends], callback) 即通过define来定义一个模块

定义模块：

```
define(['dep1', 'dep2'], function (dep1, dep2) {
    //Define the module value by returning a value.
    return function () {};
});
```

引入模块：

```
require(["cart", "store", "store/util"],
function (cart,   store,   util) {
    //use the modules as usual.
});
```

- 优点：
	适合在浏览器环境中异步加载模块。可以并行加载多个模块。
- 缺点：
	提高了开发成本，并且不能按需加载，而是必须提前加载所有的依赖。

## CMD 规范

CMD 规范是阿里的玉伯提出来的，[sea.js](https://seajs.github.io/seajs/docs/#docs) 实现了这个规范。它和 requirejs 非常类似，即一个文件就是一个模块，但是 CMD 的加载方式更加优秀，是通过按需加载的方式，而不是必须在模块开始就加载所有的依赖。如下：

```
define(function(require, exports, module) {
  var $ = require('jquery');
  var Spinning = require('./spinning');
  exports.doSomething = ...
  module.exports = ...
})
```

- 优点:
	同样实现了浏览器端的模块化加载。可以按需加载，依赖就近。
- 缺点:
	依赖SPM打包，模块的加载逻辑偏重。

其实，这时我们就可以看出 AMD 和 CMD 的区别了，前者是对于依赖的模块提前执行，而后者是延迟执行。 前者推崇依赖前置，而后者推崇依赖就近，即只在需要用到某个模块的时候再 require。 如下：

```
// AMD
define(['./a', './b'], function(a, b) {  // 依赖必须一开始就写好  
   a.doSomething()    
   // 此处略去 100 行    
   b.doSomething()    
   ...
});

// CMD
define(function(require, exports, module) {
   var a = require('./a')   
   a.doSomething()   
   // 此处略去 100 行   
   var b = require('./b') 
   // 依赖可以就近书写   
   b.doSomething()
   // ... 
});
```

除此之外，AMD 加载模块后会立即执行，具体可看 Sea.js 的作者写的 [前端模块化开发那点历史](https://github.com/seajs/seajs/issues/588)。

## UMD

CommonJS、AMD、CMD 并行的状态下，就需要一种方案能够兼容他们，做到无需修改代码即可跨平台，开发时不需要再去考虑依赖模块所遵循的规范，而 UMD 的出现就是为了解决这个问题。

```js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        //Node, CommonJS之类的
        module.exports = factory(require('jquery'));
    } else {
        //浏览器全局变量(root 即 window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    //方法
    function myFunc(){};
    //暴露公共方法
    return myFunc;
}));
```

上面的代码是 UMD 的基本写法，从代码就可以看出，其能够同时支持 CommonJS 规范和 AMD 规范。

## ES6 Module

在 ES6 之前，社区制定了上面介绍的几种模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 则是在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。但不可否认，在没有 ES6 的日子里，这些社区规范给开发人员提供了巨大的方便，并推动了 JS 模块化编程的发展。

ES6 的模块化能力由 export 和 import 两个命令构成:

- export 命令用于规定模块的对外接口
- import 命令用于导入其他模块提供的功能

```
//Utils.js
class Utils {
	// ...
}
export {Utils};

//App.js
import {Utils} from "./Utils.js";
```

各大厂商对 ES6 的支持程度和速度有些差异，这是一个简单的对比:

### 桌面端浏览器

- Chrome：51 版起便可以支持 97% 的 ES6 新特性。
- Firefox：53 版起便可以支持 97% 的 ES6 新特性。
- Safari：10 版起便可以支持 99% 的 ES6 新特性。
- IE：Edge 15可以支持 96% 的 ES6 新特性，Edge 14 可以支持 93% 的 ES6 新特性。（IE7~11 基本不支持 ES6）

ES6 提供了许多新特性，并不是所有的浏览器都能够完美支持。好在各大浏览器自身支持 ES6 的速度也很快，支持最友好的是 Chrome 和 Firefox 浏览器，要知道现在最新 Chrome 的版本是 70，FireFox 的版本是 63。

### 移动端浏览器

- iOS：10.0 版起便可以支持 99% 的 ES6 新特性。
- Android：基本不支持 ES6 新特性（5.1 仅支持 25%）

### 服务器端

- Node.js：6.5 版起便可以支持 97% 的 ES6 新特性。（6.0 支持 92%）

**注意：** 截止到 Node 10.10 为止，仍不支持 ES6 Module，换句话说你将不能使用 import 或者 export ! 

# 总结

所谓模块，就是一个 JavaScript 的执行单元，它提供了访问接口，并且可以依赖其他模块，你不需要知道它的内部是如何运作的，但这个模块就是能满足你的需求!

从广义上讲，模块就是对 JavaScript 缺少封装性的一个补充！

# 参考

- [https://caniuse.com/#search=ES](https://caniuse.com/#search=ES)
- [https://github.com/ruanyf/es-checker](https://github.com/ruanyf/es-checker)