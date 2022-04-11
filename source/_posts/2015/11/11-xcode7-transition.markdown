---
layout: post
title: "Xcode7 Transition Guide"
date: 2015-11-11 21:41:12 +0800
comments: true
tags: ["iOS"]
toc: false
---

# Introduction

使用 Xcode 7 开发已经有一段时间了，记录下使用时遇见的问题；有些东西记不住，所以当做笔记，需要的时候打开博客复制下就好了。

- Bitcode
    一般好多第三方库不支持这个特性，毕竟是苹果刚推出的，需要一段时间，这个等日后第三方库都支持之后可以开启，暂时需要关闭，否则将出现如下类似的错误！这个设置项默认是开启的，在 build setting 里搜索就可以找到啦。

- NSAppTransportSecurity
    使用 Xcode 7之后发现接口（HTTPS 除外）不好使了，没数据了！尼玛啊，什么情况，坑死老子嘛？！不要慌张，在你工程的 info.plist （这个可以修改，默认是info）里添加个字典配置下就可以啦：（可以右键plist，Open as-> Source Code 然后复制到最后，plist本身也是个文本（xml）文件，所以当然可以这样看啦）

```objc
<key>NSAppTransportSecurity</key>
<dict>
<key>NSAllowsArbitraryLoads</key>
<true/>
</dict>
```

昨天刚从 7GM 版升级到了 7.1,在添加这个字典的时候就发现系统做了修改，自动把你写的 **NSAppTransportSecurity** 变为 **App Transport Security Settings** 这个不用我们管他，是自动变的。
这是比较懒的做法，我们写Demo的时候可以直接这样搞，如果项目里的接口 HTTPS 的居多，则可以过滤特定的，具体怎么做就请自己 Google 吧,建议使用 HTTPS 的接口，最近 Xcode Ghost 事件闹得沸沸扬扬的，如果是 HTTPS 就不会这样了，当然使用 HTTPS 会使得接口更慢，需要增加成本在证书机构购买 SSL 证书...

- 使用条件预编译

使用 __IPHONE_OS_VERSION_MAX_ALLOWED >= 90000 兼容 7之前的 Xcode 编译，可以在 Xcode 7上看到宏定义 __IPHONE_9_0 就是 90000；具体这么写：

```objc
#if (__IPHONE_OS_VERSION_MAX_ALLOWED >= 90000)
//your ios 9 SDK code
#endif
```
有了这些就做 iOS9 的适配工作了...

- 申请自己的证书
使用 Xcode 7之后就可以登录自己的普通账户，调试我们写的 demo 的时候把team改为自己的账户名，然后就会提示自动请求匹配的证书。
- 升级到 OS X EI Captain 之后 jekyll 丢了

`Errno::ENOENT: No such file or directory - jekyll`

所以这篇博客没那么顺利发布了就，苹果搞什么飞机啊！
