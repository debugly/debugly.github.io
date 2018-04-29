---
layout: post
title: Use Cmdline Open Webstorm
date: 2018-04-29 21:10:58
tags: macOS
---

> 我并不是一个前端开发者，由于在做小游戏，游戏逻辑甚至框架都用是 Javascript 写的，所以选择了 Webstorm 这编辑器。

- 优点：前端开发支持的相当不错了，变量方法跳转，断点调试都支持，Filewatch，CVS，内置 Termianl，JSLint ...
- 缺点：暂用内存大；

# 命令行支持

不能右键文件夹使用 Webstorm 打开，这显得很不方便，我家里的电脑在安装 2018.1.2 这个版本时发现一个选项：安装命令行工具，这样可以在命令行使用 webstorm 打开，使用起来挺方便的，我去公司后想把公司电脑也升级到 2018.1.2 ，然后使用命令行打开，可是从 2017 的某个版本升级时却没有这个选项，卸载重装也没有，偏好设置里也没能找到，废了好久时间在包里面找到了一个可执行程序...

![](/images/201804/2901.png)

但是在命令行里执行的时候，还有别的日志，并且程序也没执行完，好像是开了个进程在这，看着不爽，不能继续执行别的命令了，跟家里的那个命令不是一回事。。。

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

别的不说，仅从大小上来看这两个就不一样，这个只有 3KB 而已，可以确定和在 MacOS 下找到的不是一个，其实这个是具有执行权限的 shell 脚本，有兴趣的话下载过后可以读一读源码，MacOS 下那个是真正的二进制可执行文件！

你可以在这个里下载到这个 [可执行文件](/cmd/webstorm)，下载完毕后把它放到 PATH 搜索路径下就行了，比如: **/usr/local/bin/** 目录下。

# 使用

```bash
bogon:~ xuqianlong$ webstorm /Users/xuqianlong/websites/hexo/debugly
bogon:~ xuqianlong$ 
```

后面需要带上项目路径，我的习惯是在 Finder 里找好路径，然后 `cmd+\` 在终端里直接进入到这个文件夹，这一行为默认是不支持的，可以在服务里配置:

![](/images/201804/2903.png)

这样一来命名就简单了:

```base
bogon:debugly xuqianlong$ webstorm ./
bogon:debugly xuqianlong$
```

# 激活

- [http://www.activejetbrains.ml](http://www.activejetbrains.ml)
- [http://hb5.s.osidea.cc:1017](http://hb5.s.osidea.cc:1017)

长期使用请在 [官方](http://www.jetbrains.com/webstorm/buy/#edition=commercial) 购买！！
 
