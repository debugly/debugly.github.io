---
layout: post
title: "使用 Framework 包裹静态库共享代码"
date: 2017-05-17 22:19:28 +0800
comments: true
tags: ["千帆SDK"]
keywords: framework wrap static library
---

正如上篇博客介绍的，提取公共 Framework 确实能够让多个 SDK 共享基础代码 ！这毋庸置疑，我们已经实践了好几个项目了，但是随着业务的发展，发现这个粒度有时还不够细，换句话说 SCF 包含的东西多了些，对于某些项目而言不需要用这么多的功能，SCF 显得有些臃肿了，这要怎么办？

# 背景

去年的这个时候，我来到了这个团队之后，开始做千帆直播 SDK ，经过一年的时间已经迭代到了线上 2.4 版本，而现在我又接到任务做开放平台的点播 SDK，且称之为 SohuVideoFoundation。这只是个巧合，但时间上的重合挺有趣的。

# 准备开搞

开始做之前，我都会去思考下架构上的问题，这次又遇到了新的问题了： SohuVideoFoundation 是需要对外公开的，目前只需要用到网络库，解析库，这些库已经包含在 SCF 里了，不过 SCF 提供的功能不止这些，所以包的体积自然会大些，既然是对外公开，那就代表的是公司的技术水平，逼格自然要提升上去，我不禁心里一颤，因为我是第一次对外去做，之前面向的都是公司的兄弟部门，较为熟悉！

基于以上的顾虑，因此我决定 SohuVideoFoundation 不依赖 SCF ，但是如何共享网络库和解析库呢？这是个新的问题，我也不愿意去 copy 代码，因为日后难以维护，给代码升级带来麻烦！

为了方便，以下将 SohuVideoFoundation 简称为 SVF 。

# 寻找方案

我最初的设想是，将网络库打成 Framework ，然后分别包含到 SCF 和 SVF 里，结果我失败了，得出的结论是：

> A.Framework 不能包裹 B.Framework ，即不能把 B 的可执行文件一并打 A 里面，或者说不能嵌套。

如果有办法的话，请联系我，谢谢！

然后我就转向了使用静态库的方案，我将网络库打成了静态库，然后分别包含到 SCF 和 SVF 里，结果我成功了，得出的结论是：

> A.Framework 能包裹 B.a ，能把 B 的可执行文件一并打 A 里面，或者说 Framwork可以包裹静态库。还记得上一篇博客的总结吗？（Framwork包裹静态库时，也可以不copy可执行文件！）

所以，最终的方案就是：**将需要在 Framework 之间共享的代码打成静态库，然后 Framework 包裹该静态库！**

## 思维导图

这是调整后的工程框架结构图：

![](/images/201705/03.jpg)

解释：

- SCNetworkKit.a : 最底层的共享网络库
	- SohuVideoFoundation.framework : 开放平台的播放器 SDK ，包裹了 SCNetworkKit
	- SohuCoreFoundation.framework : 共享框架，包裹了 SCNetworkKit 为以下几个 SDK 提供服务
		- SohuLiveSDK.framework : 千帆直播SDK ，基于 SCF
		- SohuOneSDK.framework : 千帆夺宝SDK ，基于 SCF
		- SohuGameSDK.framework : 千帆小游戏SDK ，基于 SCF
		- SohuEduSDK.framework : 搜狐课堂SDK ，基于 SCF


# 完

到此为止，我们的目的已经达到了，怎么样？是不是感觉做 SDK 越来越有意思了呢？几乎每做一个项目都会引发一次对工程的结构的变革，这些变革也正是一次的尝试与思考的成果！