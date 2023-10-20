---
layout: post
title: "解决 CALayerInvalidGeometry 问题"
date: 2016-03-28 22:08:16 +0800
comments: true
tags: ["iOS"]
---

今天遇到了很多 calyer 设置坐标的崩溃，原因如下：

> Fatal Exception: **CALayerInvalidGeometry**
CALayer position **contains NaN**: [nan 8]

坐标竟然是 NaN (非数字)！这还得了，马上排查！！！
下面是具体崩溃信息：

```objc
Thread : Fatal Exception: CALayerInvalidGeometry
0  CoreFoundation                 0x23a2a5f7 __exceptionPreprocess
1  libobjc.A.dylib                0x3129cc77 objc_exception_throw
2  CoreFoundation                 0x23a2a53d -[NSException initWithCoder:]
3  QuartzCore                     0x268f01cf CA::Layer::set_position(CA::Vec2<double> const&, bool)
4  QuartzCore                     0x268f00d3 -[CALayer setPosition:]
5  QuartzCore                     0x268f0065 -[CALayer setFrame:]
6  UIKit                          0x26ec8fe3 -[UIView(Geometry) setFrame:]
7  SOHUVideo                      0xa937d -[DiskStatusView updateDiskStatus] (DiskStatusView.m:65)
...
```
<!--more-->

立马定位到 DiskStatusView 类的 updateDiskStatus 方法，发现他的一个子 view 的宽度在某种情况下会出现非数字的情况！知道问题所在就好改了，判断下就 OK 啦！

说来也怪，宽度是非数字，为何异常却是：**CALayer position contains NaN: [nan 8]**   呢？！这个 8 是哪里来的，y 坐标本来设置的是 0 啊，这点真不理解呢 ...

> NaN : 非数字，一般都是 0 作除数的结果！

简单的说：rect 里面不能包含非数字，否则就会报 CALayerInvalidGeometry 异常！解决办法就是仔细检查 rect 的4个值！
