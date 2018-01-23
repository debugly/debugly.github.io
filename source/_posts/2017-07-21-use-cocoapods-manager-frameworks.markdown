---
layout: post
title: "使用 CocoaPods 管理 frameworks"
date: 2017-07-21 15:09:56 +0800
comments: true
tags: [iOS,CocoaPods]
keywords: use cocoapods manager frameworks
---

> 上篇博客介绍了如何创建 pods 库，让 pods 库帮我们管理源码、依赖、编译成库、配置search path等工作；但有时候你可能不想或者不能把源码提供出去，还想要使用 pods 管理版本的话，就可以让 pods 直接管理 frameworks 而不是源码！

我已经实践了过了，确实可以管理 framework 的，这是创建好的包含 demo 的 pods 库地址 ：[https://github.com/debugly/TestSCFPods](https://github.com/debugly/TestSCFPods)。

创建步骤和创建管理源码的 pods 库是一样的，只不过 podspec 里的配置不太一样而已！如果你没有创建过 pods 库的话，最好先去看下上篇博客 : [创建 CocoaPods 库](/ios/2017/07/20/create-pod-library.html#0)。

# 创建 git 仓库

同样的，我们需要先创建一个 git 仓库，用于管理 frameworks 的版本，并且打 tag。然后克隆到本地，进入仓库目录 :

```
cd ~/GitWorkspace/TestSCFPods
```

# 创建 podspec 文件

进入仓库目录后，开始创建 podspec 文件

```
pod spec create TestSCFPods

Specification created at TestSCFPods.podspec
```

我把和创建普通源码 pods 库不一样的地方拿出来说下：

```
//上篇博客里没用到，因此没提；这个是资源路径，我的 SohuGameSDK.framework 里包含的有 SohuGame.xcassets 这个图片库；
s.resources = "SohuGameSDK.framework/SohuGame.xcassets"
///这个很重要，把需要管理的 frameworks 都写出来，如果有依赖关系，最好被依赖的写在前面
s.vendored_frameworks = "SohuCoreFoundation.framework","SohuGameSDK.framework"
///不需要额外暴露头文件
# s.source_files  = "**/*.{h}"
```

# 验证 podspec 文件

同样的，使用 `pod spec lint --allow-warnings` 验证下，通过如下：

```
-> TestSCFPods (1.0.0)

Analyzed 1 podspec.

TestSCFPods.podspec passed validation.
```

有错误的话，就使用 `pod spec lint --allow-warnings --verbose` 再次验证，不过会打印详细的日志，通过日志去找问题！

# 提交 podspec 文件

如果没有账户的话，那就注册一个；注册过了就 push 吧：

`pod trunk push TestSCFPods.podspec --allow-warnings`

```
Updating spec repo `master`

CocoaPods 1.3.0.beta.3 is available.
To update use: `sudo gem install cocoapods --pre`
[!] This is a test version we'd love you to try.

For more information, see https://blog.cocoapods.org and the CHANGELOG for this version at https://github.com/CocoaPods/CocoaPods/releases/tag/1.3.0.beta.3

Validating podspec
 -> TestSCFPods (1.0.0)

Updating spec repo `master`

CocoaPods 1.3.0.beta.3 is available.
To update use: `sudo gem install cocoapods --pre`
[!] This is a test version we'd love you to try.

For more information, see https://blog.cocoapods.org and the CHANGELOG for this version at https://github.com/CocoaPods/CocoaPods/releases/tag/1.3.0.beta.3


--------------------------------------------------------------------------------
 🎉  Congrats

 🚀  TestSCFPods (1.0.0) successfully published
 📅  July 20th, 07:25
 🌎  https://cocoapods.org/pods/TestSCFPods
 👍  Tell your friends!
--------------------------------------------------------------------------------
```

恭喜你，成功了，接下来就可以创建个 demo 试下了！

不仅能管理 frameworks ，还可以管理 .a 静态库，区别是 **s.vendored_frameworks** 改为 **s.vendored_libraries** !

我觉得很赞的是，不用将资源手动添加到主工程里去，pods会自动通过脚本帮你完成这件事，这个是新版 pods 才有的功能，最初是不支持的，大概是从 1.0 开始支持的！！

# 实际效果
 
使用 pods 的最初原因是为了，集成我 SDK 的开发人员能够简单高效的换包，从实际使用的效率上来看，其实没有那么理想，我举个栗子，比如我 SDK 要更新发包了：

我的工作是:

1. 将 SDK（也就是相关的 frameworks）上传到 github
2. 升级一个 tag 号
3. 升级 podspec 版本号
4. 将 podspec 推送到 cocospods

集成者的工作是:

1. 升级 Podfile 的版本号
2. 使用 pod update 把库更新下来
3. 提交更新后的代码

总体看来，SDK更新一个版本一共需要 7 个步骤，我感觉是略繁琐了些，所以我并没有采用 pods 管理 frameworks 来自动换包这个方案！

还有个弊端是，如果 Podfile 里没有指定小版本号，那么可能集成App依赖的其他库也被更新了，或许App开发并不想更新其他依赖库！

