---
layout: post
title: macOS-JavaRuntime
date: 2018-03-06 23:28:58
tags: macOS
---

> Macos 配置 JRE.

我也记不清楚之前本机的 Java 环境是否是配置好了，昨天更新了 Macos 之后，今天想装个 Jenkins 完下，结果在运行 Jenkins 的时候发现 **No Java runtime present, requesting install.**

## 分析问题

点击 系统偏好设置里的 Java 图标

![](/images/201803/1.png)

如果没有这个图标或者点击后没有出来 **Java 控制面板**

![](/images/201803/2.png)

那就需要去 oracle 下载安装 JRE [http://www.oracle.com/technetwork/java/javase/downloads/jre9-downloads-3848532.html](http://www.oracle.com/technetwork/java/javase/downloads/jre9-downloads-3848532.html)；下载 dmg 包就行，需要选中 Accept License Agreement !

![](/images/201803/3.png)

下载完成，双击一路安装即可！

本以为这样就行了，其实不行！

原因如下：

经查找在 /usr/bin 目录里有个 java 的替身:

![](/images/201803/4.png)

经过验证发现该路径已经加入到了PATH里面！

```
bogon:~ xuqianlong$ echo $PATH
/Users/xuqianlong/.rvm/gems/ruby-2.2.6/bin:/Users/xuqianlong/.rvm/gems/ruby-2.2.6@global/bin:/Users/xuqianlong/.rvm/rubies/ruby-2.2.6/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Users/xuqianlong/.rvm/bin:/usr/local/ssl
```

为什么不行，还不能确定，可以确定的是他的原身是在 JavaVM.framework:

![](/images/201803/6.png)

这个 JavaVM.framework 不是我们安装的，好像是苹果自带的，我们刚才装的那个 JRE 其实是在这里:

![](/images/201803/4.png)

我们可以将这个替身改为我们这个JRE里的java，可是很遗憾，对于 /usr/bin 目录没有修改权限，想拥有权限有些麻烦，这里不在介绍。

命令行输入的命令查找顺序是按照设置PATH里设置的路径查找的，因此可以从 PATH 入手，仔细查看发现 **/usr/local/bin** 在 **/usr/bin** 之前搜索，所以我们在 **/usr/local/bin** 里建个 Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home/bin/java 的替身就行了！

## 解决问题

```
ln -s /Library/Internet\ Plug-Ins/JavaAppletPlugin.plugin/Contents/Home/bin/java /usr/local/bin
```
重启终端再次查看环境：

```
java -version
java version "9.0.4"
Java(TM) SE Runtime Environment (build 9.0.4+11)
Java HotSpot(TM) 64-Bit Server VM (build 9.0.4+11, mixed mode)
```

OK 啦！

## 参考博客

- [https://anas.pk/2015/09/02/solution-no-java-runtime-present-mac-yosemite/](https://anas.pk/2015/09/02/solution-no-java-runtime-present-mac-yosemite/)