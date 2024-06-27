---
layout: post
title: 搞定 macOS JRE
date: 2018-03-06 23:28:58
tags: ["macOS"]
---

> macOS 是自带了 JRE 的，但实际上却没那么好用，今天就来聊下我遇到的问题以及解决方案.

我也记不清楚之前本机的 Java 环境是否是配置好了，昨天更新了 macOS 之后，今天想装个 Jenkins 玩下，结果在运行 Jenkins 的时候发现 **No Java runtime present, requesting install.**

## 查看 Java 环境

![](/images/201803/0.jpg)

如果看到需要安装的话，择说明没有 Java 环境，需要配置 JRE 了。

<!--more-->

## 安装 JRE

*JRE : Jave Runtime Environment，即运行 Java程序的环境。*

- 点击 **系统偏好设置** 里的 Java 图标

![](/images/201803/1.jpg)

如果没有这个图标或者点击后没有出来 **Java 控制面板**

![](/images/201803/2.jpg)

那就需要去 oracle 下载安装 JRE [http://www.oracle.com/technetwork/java/javase/downloads/jre9-downloads-3848532.html](http://www.oracle.com/technetwork/java/javase/downloads/jre9-downloads-3848532.html)；下载 dmg 包就行，需要选中 Accept License Agreement !

![](/images/201803/3.jpg)

下载完成，双击一路安装即可！

本以为这样就行了，其实不行，安装完成后 **Java 控制面板** 到是有了！

## 查找问题

既然 **Java 控制面板** 里显示了 java 环境了，那么肯定是环境已经有了，只不过命令行里使用的时候没找到而已，这好办，查一查 java 的真实身份吧：

```shell
which java
/usr/bin/java
ls -al /usr/bin/java
lrwxr-xr-x  1 root  wheel  74 11 28 23:06 /usr/bin/java -> /System/Library/Frameworks/JavaVM.framework/Versions/Current/Commands/java
```

这说明了 java 命令搜索路径是 **/usr/bin/java** 并且这只是个替身，原身是 */System/Library/Frameworks/JavaVM.framework/Versions/Current/Commands/java* ！！！

如下图:

![](/images/201803/4.jpg)

原身 JavaVM.framework:

![](/images/201803/6.jpg)

这个 JavaVM.framework 不是我们安装的，好像是苹果自带的！！再回过头检查了下，**发现 Desktop 这里的路径跟苹果自带的 JRE 路径不一样**，这个路径是安装过 Oracle JRE 的路径！！

![](/images/201803/7.jpg)

目录结构如下图:

![](/images/201803/5.jpg)

因此解决方案就是将苹果自带的 JRE 修改为 Oracle 的 JRE，原本想着将这个替身直接改为我们安装的这个JRE里的java，可是很遗憾，对于高版本的 macOS 而言 /usr/bin 目录没有修改权限，想拥有权限有些麻烦，这里不再介绍。所以换个思路去解决。

我们知道命令行输入的命令查找顺序是按照设定的 PATH 路径查找的，因此可以从 PATH 入手，先来看下完整的 PATH 搜索路径:

```shell
bogon:~ xuqianlong$ echo $PATH
/Users/xuqianlong/.rvm/gems/ruby-2.2.6/bin:/Users/xuqianlong/.rvm/gems/ruby-2.2.6@global/bin:/Users/xuqianlong/.rvm/rubies/ruby-2.2.6/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Users/xuqianlong/.rvm/bin:/usr/local/ssl
```
由于是按顺序查找的，所以只要在 **/usr/bin** 之前搜索到就不会使用默认的苹果指定的 JRE 了，经过仔细查看发现 **/usr/local/bin** 在 **/usr/bin** 之前搜索，所以我们可以在 **/usr/local/bin** 里建个 Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home/bin/java 的替身！

## 解决问题

上面讨论了解决方案，下面实施下：

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

这次对啦，正是我们刚装的 9.0.4 版本！

为什么苹果自带的不行呢，我还不能确定！

## 参考博客

- [https://anas.pk/2015/09/02/solution-no-java-runtime-present-mac-yosemite/](https://anas.pk/2015/09/02/solution-no-java-runtime-present-mac-yosemite/)