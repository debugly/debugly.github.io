---
layout: post
title: 提升 Webstorm 开发效率
date: 2018-04-29 21:10:58
tags: macOS
---

> 我并不是一个前端开发者，由于今年转到了小游戏开发，游戏逻辑甚至框架都是用 Javascript 写的，因此选择使用 Webstorm 这款编辑器软件。

- 优点：前端开发支持的相当不错了，支持变量方法跳转，断点调试，Filewatch，CVS，内置 Termianl，JSLint ...
- 缺点：占用内存比较大，付费软件；

# 从命令行打开工程

正常使用流程这里就不多说了，现在聊一聊怎么在命令行里快速打开某个工程（文件夹）？右键然后选择使用 Webstorm 打开 --- 可惜并没有这一服务！这显得很不方便，然而就在我家里的电脑安装 2018.1.2 这个版本时我发现一个选项：安装命令行工具，这样就可以在命令行使用 webstorm 打开这个软件或者带上路径打开工程了，使用起来挺方便的，我去公司后想把公司电脑也升级到 2018.1.2 ，然后使用命令行打开，可是从 2017 的某个版本升级时却没有这个选项，卸载重装也没有，偏好设置里也没能找到，废了好久时间在 app包里面有个 MacOS 文件里，里面有一个可执行程序:

![](/images/201804/2901.png)

但是在命令行里执行的时候，还有别的日志，并且程序也没执行完，好像是开了个进程在这一直运行，看着着实不爽，因为不能继续执行别的命令了，跟家里的那个命令不是一回事。。。

```bash
bogon:~ xuqianlong$ /Applications/WebStorm.app/Contents/MacOS/webstorm 
2018-04-29 22:00:59.910 webstorm[77272:5636690] allVms required 1.8*,1.8+
2018-04-29 22:00:59.913 webstorm[77272:5636698] Value of WEBSTORM_VM_OPTIONS is (null)
2018-04-29 22:00:59.913 webstorm[77272:5636698] fullFileName is: /Applications/WebStorm.app/Contents/bin/webstorm.vmoptions
2018-04-29 22:00:59.913 webstorm[77272:5636698] fullFileName exists: /Applications/WebStorm.app/Contents/bin/webstorm.vmoptions
2018-04-29 22:00:59.913 webstorm[77272:5636698] Processing VMOptions file at /Applications/WebStorm.app/Contents/bin/webstorm.vmoptions
2018-04-29 22:00:59.913 webstorm[77272:5636698] Done
```

于是回到家里后，在 **/usr/local/bin/** 目录下找到了这么一个可执行文件:

![](/images/201804/2902.png)

别的不说，仅从大小上来看这两个就不一样，这个只有 3KB 而已，可以确定和在 MacOS 下找到的不是一个，其实这个是具有执行权限的 shell 脚本，有兴趣的话下载过后可以读一读源码，MacOS 下那个是真正的二进制可执行文件！你可以在这个里下载到这个 [可执行文件](/cmd/webstorm)，下载完毕后把它放到 PATH 搜索路径下就行了，比如: **/usr/local/bin/** 目录下。

配置好之后，应该就可以这么使用了（版本不兼容问题没有测试）:

```bash
bogon:~ xuqianlong$ webstorm /Users/xuqianlong/websites/hexo/debugly
bogon:~ xuqianlong$ 
```

后面可带项目路径或者文件，我觉得还是不够完美，因为我的习惯是在 Finder 里找工程路径，然后右键在终端里直接进入到这个文件夹，这一行为默认是不支持的，可以在服务里配置:

![](/images/201804/2903.png)

并且我配置了快捷键： **`cmd+\`** ，这样一来步骤就更加简单了:

```base
//选中工程文件夹，然后 cmd + \
bogon:debugly xuqianlong$ webstorm ./
bogon:debugly xuqianlong$ //可继续在当前文件夹下执行别的命令
```

# 快捷键

快捷键能够帮节省我们很多时间，提高开发效率，默认帮我们配置了好多快捷键，下面这几个是我认为很用到的，默认没支持的，需要配置下:

- 滚动到文件的顶/底部

![](/images/201804/3001.png)

- 切换文件 Tab

![](/images/201804/3002.png)

默认配置项:

- cmd + shift + o : 查找文件
- cmd + option + o : 查找符号
- cmd + w : 关闭活动tab窗口
- cmd + f : 文件内查找，可以大小写敏感，匹配单词，正则，可以选定全部然后重命名
- cmd + shift + f : 全局查找，可以限定工程，模块，文件夹等范围
- cmd + → : 定位到行末
- cmd + ← : 定位到行首
- cmd + shift + ↑ : 将光标所在行向上移动
- cmd + shift + ↓ : 将光标所在行向下移动
- cmd + [ : 向前跳转到编辑历史，通常很有用
- cmd + ] : 向后跳转到编辑历史
- shift + F6 : 重命名文件名，没反应的话，同时按下 Fn 键。

快捷键还有很多，不再一一列举，我想掌握了上面提到的应该就足够快捷了！

# 支持 ES6 语法

前面提到了，我使用 Webstorm 的目的是编写 JavaScript 的，当下普遍支持 ES6 语法，所以将 JavaScript 默认的版本改为 ES6，这样就可以顺畅的使用 ES6 的新语法了，否则编写时会不提示并报警告，挺烦人的:

![](/images/201804/3003.png)

# 激活

- [http://www.activejetbrains.ml](http://www.activejetbrains.ml)
- [http://hb5.s.osidea.cc:1017](http://hb5.s.osidea.cc:1017)

长期使用请在 [官方](http://www.jetbrains.com/webstorm/buy/#edition=commercial) 购买！！
 
