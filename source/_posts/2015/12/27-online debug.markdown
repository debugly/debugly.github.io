---
layout: post
title: "通过浏览器调试视图和沙河"
date: 2015-12-27 21:30:26 +0800
comments: true
tags: iOS
---

Introduction
============

最近在 GitHub 上看到了 Damian 写的一个在浏览器调试视图的工程 [iOS Hierarchy Viewer](https://github.com/glock45/iOS-Hierarchy-Viewer) ，跟 xCode 自带的类似，不过几乎没什么版本限制，我在他的基础上增加了查看沙河文件的功能，增加了一个首页，和返回首页...

# At a glance
- 首页：

<img src="/images/201512/img201512272145-1.png" width="1040" height="393">

<!--more-->

- 调试试图：

<img src="/images/201512/img201512272145-2.png" width="1040" height="610">

- 调试沙河：

<img src="/images/201512/img201512272145-3.png" width="1040" height="348">

# 沙河调试

之前都是使用 iFunBox 导出沙河里的文件，iOS 8之后不能导出线上，这可能出于更加安全的考虑，但是也给开发人员导出日志增加了难度；因此开发了这个线上导出的功能，用于 debug 调试；

# 用到的技术
设备这边作为 socket 服务器端，看了实现下跟大学学习的 Linux 网络编程是一样，所以看了下就明白了，使用 HTTP 协议传输数据，为了使下载的文件有文件名和后缀名还要学习下 HTTP 相应头，通过 socket 以 JSON 格式传输本地遍历的目录数据，然后通过 JS 处理下数据使用开源的 zTree 展示；你或许还要了解这些技术才行 js，jQuery，html，css，socket...

# 下载沙河文件
如上图看到的树状结构，你可以点击加号展开，这个使用 ajax 异步加载的；点击文件就直接下载到本地了，我是用的是 chrom 浏览器，safari 的表现可能没有这么好，这个日后再来调整；


# 使用方法

* 1.执行 build_fat 就能自动打出一个静态库来了;
* 2.连同 bundle 拖到你的工程里，导入头文件，调用 startService 方法启动服务;
* 观察控制台输出的 IP 地址，粘贴到浏览器就可以啦...

```objc
@interface iOSOnlineDebug : NSObject

+ (BOOL)startService;
+ (void)stopService;

@end
```

项目地址： [iOSOnlineDebug](https://github.com/debugly/iOSOnlineDebug)
