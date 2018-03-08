---
layout: post
title: "使用 Framewrok 管理共享代码"
date: 2017-05-16 19:43:28 +0800
comments: true
tags: 千帆SDK
keywords: framework,static library
---

这不是一篇讲解如何使用 Xcode 创建 Framework 的教程，而是代码共享的一个解决方案！

# 背景

今年 2 月刚迭代完千帆直播 SDK 之后，我们启动了 `夺宝SDK` 的开发工作，除了常规的产品需求外，有个特殊的要求：

- 作为千帆直播 SDK 的组成部分（集成到搜狐视频）
- 单独提供给千帆直播 App

# 思考

听起来挺简单的，仔细考虑后，并不简单，原因如下：

- 时间有限，不可能重复造轮子，所以千帆直播SDK里的代码要共享
- 为了日后维护方便，相同的代码不能 copy 两份(这是我的原则)
- 夺宝 SDK 要具备单独提供的能力
- 夺宝 SDK 要具备组件的能力

为了更加简单的解决这个问题，我是这么思考的，先解决上面列举的前 3 条，先不考虑第 4 条；因此我需要考虑夺宝 SDK 如何共享 `千帆直播SDK` 的通用代码，我不喜欢 copy 代码，所以没有更好的办法，只能是将通用代码抽取出来了，可以使用静态库（.a），也可以使用框架（.framework），你会怎么选择 ？

# 开搞

我不喜欢静态库，因为使用的时候很不方面，他的可执行文件和头文件是分开的，甚至于使用的时候还要设置下 search path ！因此我毫不犹豫的选择了框架，框架的名字命名为 **SohuLiveFoundation**。

辛好千帆直播 SDK 工程的代码组织的还不错，所有通用的库均在 libs 文件下，接下来的工作几乎成为了搬运 libs 到 SohuLiveFoundation 工程，由于现在还没开始做，只是准备工作，因此只把网络库，解析库，缓存库，下载图片库等很通用的搬运下，日后用到哪些再具体分析决定是否搬运，如何搬运的问题。

接下来创建了夺宝 SDK 的工程，命名为 **SohuOneSDK**，为了使用通用库，所以要引用下 SohuLiveFoundation 库，然后随便写了个界面，发了个请求，简单模拟下，只要能用就行，然后再来到我的 Demo （模拟 千帆App），尝试在 Demo 里调用 SohuOneSDK 的功能，这里要注意的是：

- SohuOneSDK 只是引用了 SohuLiveFoundation，并不包含（copy）其可执行文件，这个从大小上可以看出来，SohuOneSDK 刚创建，文件比较少，很小的；而 SohuLiveFoundation 包含了的文件多，要大一些；
- 由于 SohuOneSDK 没有包含 SohuLiveFoundation 的可执行文件，那么在执行的时候就要保证能够找到对应的可执行文件！因此要在 demo 里导入 SohuLiveFoundation 和 SohuOneSDK ！

> 假如 A.framework 使用了 B.framework ，在编译 A 的时候，并不需要找到 B 的可执行文件，只需要 B 库的头文件即可，从而避免编译报错，并且给调用 B 库的地方分配个相对的函数调用地址或者说是占位符，以后再具体填充；所以在集成 A 库的 App 里必须导入 B 库，而在 link 的时候也会把 A 库里的占位符换成 B 库的可执行地址.具体怎么换的我也不清楚，因为 App 里使用了 A 库，也需要把 A 库的占位符替换下，具体按照什么循序来的，我也不确定。

# 搞定组件化

到目前为止，已经实现了前 3 条了，我们再回过头来看下第 4 条 --- 将夺宝 SDK 作为直播 SDK 的一部分；由上面提到的理论大家很容易想到，可将 SohuOneSDK 引用到 SohuLiveSDK（千帆直播SDK），而 SohuLiveFoundation 为 SohuOneSDK 和 SohuLiveSDK 提供基础支持，集成到视频的时候，将这三个 framework 一并提供集成即可，这里需要说明的是，SohuOneSDK 和 SohuLiveSDK 均不包含 SohuLiveFoundation 的可执行文件，好处就是避免符号重复定义！！！ 

最初的时候感觉不好实现呢，现在看来貌似这倒是成了简单的事情了，O(∩_∩)O哈哈~。接下来的事情，就是在 SohuLiveSDK 里完成对 SohuOneSDK 的调用封装，我们不希望视频 App 去调用 SohuOneSDK 的任何功能，毕竟他只是个组成部分而已，况且入口都在 SohuLiveSDK 里面！
 
事实证明，这个方案是可行的，确实满足了单独提供和作为组件的需求！

> 经过试验，如果 A.framework 里使用了 b.a 的话，你也可以只导入 b 库的头文件，而在 A 集成的 App 里添加下 b 库的可执行文件！道理是一样的，毕竟 framework 可以简单的等同于一个包含了可执行文件和头文件的 bundle(文件夹).

# 思维导图

- 集成到视频

![](/images/201705/01.png)

- 集成到千帆App

![](/images/201705/02.png)

# SLF -> SCF

随着时间的推移，我们做了更多的项目，包括 `搜狐课堂` 和几款 `千帆小游戏`，我们在做搜狐课堂的时候发现 SohuLiveFoundation 这个名字不太合理，里面包含有直播字眼，透漏出的是直播相关的内容，课堂是个单独的项目，虽然也要集成到搜狐视频了，但跟千帆直播SDK 没关系，最初共用于夺宝 SDK 还没问题，但是这时我们发现 SohuLiveFoundation 这个名字已经不合时宜了，我们是个最求完美的团队，哪怕是个名字也要完美！

因此我们在开启搜狐课堂的开发之前，就将 SohuLiveFoundation 重命名为 SohuCoreFoundation 了！并且这也作为我们的新纪元，开始了 Foundation 的 2.0 版本，内部简称 SCF ！

随后的项目---搜狐课堂，千帆小游戏均是构建在 SCF 的基础之上。

