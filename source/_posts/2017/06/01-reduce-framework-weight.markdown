---
layout: post
title: "iOS Framework 瘦身实战"
date: 2017-06-01 13:30:02 +0800
comments: true
tags: [千帆SDK,iOS]
keywords: framework 瘦身,iOS开发
---

![](/images/201706/2014WorldCup.gif)
> 近来业务增多，对应的 Framework 也越做越多，提供给搜狐视频的就多达 5个，物理包大小当然也越来越大了，因此查阅了资料，对 framework 进行瘦身！

## 工程配置

1. 调试符号(Generate Debug Sysmbols)
	
	这个是控制是否生成调试符号的，因此 debug 模式下保持使用 YES，release改为 NO；也就说我们平时调试还生成调试信息，但是打包发布时不需要生成，如果 debug下也改为 NO 的话，会导致没有断点，你设置了断点，但是代码走到那之后不会停下来让你调试！经过试验，我从 97M 减到了 61M，减少了 37 %

2. cpu 架构(Architectures)

	基本上每多支持一种架构，包大小就会翻一倍！目前而言，Architectures 设置为 armv7，arm64 就可以了，下面是架构对应的机型
	
	- armv6 : iPhone,iPhone2,iPhone3G, iPhone3GS
	- armv7 : iPhone4,iPhone4S;
	- armv7s: iPhone5,iPhone5C;
	- arm64 : iPhone5S,iPhoneSE,iPhone6(plus)(S),iPhone7(plus)(S)

3. 压缩等级（Optimization Level）

	使用默认值就行了
	- release : Fastest,Smallest[-Os]
	- debug : None,[-O0]

4. 不可能执行到的代码 (Dead Code Stripping)
  
	使用默认值就行了
	- 设置为 YES

## 资源图片
	
1. 必要的资源图片，比如按钮的背景图，Loading 图标等，均可进行无损压缩；可以使用 [ImageOptim](/效率/2015/09/27/bo-ke-ti-su-shi-yong-imageiptimya-suo-tu-pian.html#2) 这款开源软件！

2. 除了必要的资源图片外，像礼物图片，大动画资源图片等，都可采用动态下载的方式，这样做除了减少包大小外，也能做到及时更新，满足产品需求！

## ipa 瘦身

由于主要精力在 SDK 开发上，所以我暂无实际经验，这是网上找的一篇 [文章](http://blog.csdn.net/a2657222/article/details/45723161) 。