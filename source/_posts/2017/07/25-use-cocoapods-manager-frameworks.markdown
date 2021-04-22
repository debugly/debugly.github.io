---
layout: post
title: "使用 CocoaPods 管理 frameworks"
date: 2017-07-25 15:09:56 +0800
comments: true
tags: [iOS,CocoaPods]
keywords: use cocoapods manager frameworks
---

> 通过前几篇博客的介绍，已经知道了如何去创建自己的 pods 库，前提是公开源码的，但有时候你可能不想或者不能把源码提供出去，那还能继续使用 cocoapods 管理库和依赖吗？答案是肯定的，接下来就来介绍下 cocoapods 如何管理 frameworks ！

无论是源码还是库的形式，对于 pod 而言，区别就是 podspec 文件，比如我做了几个管理源码的 pod 库，现在我只需要修改下就可以了，以 [SCNetworkKit](https://github.com/debugly/SCNetworkKit) 举例说明:

将

```
s.source       = { :git => "https://github.com/debugly/SCNetworkKit.git", :tag => "#{s.version}" }
s.source_files  = "SCNetworkKit/Classes/**/*.{h,m}"
```

修改为

```
s.source       = { :http => "http://110.117.36.192/Pods_Static/1.0.55/SCNetworkKit.framework.zip" }
s.vendored_frameworks = "SCNetworkKit.framework"
```

source 支持四种类型:

- :git => :tag, :branch, :commit, :submodules
- :svn => :folder, :tag, :revision
- :hg => :revision
- :http => :flatten, :type, :sha256, :sha1, :headers

这里使用 http 是因为实际项目中更为方便，我们会把库文件放到服务器上，通过不通的文件夹去管理版本，下载也比较快速。

剩下的验证和发布步骤就和创建管理源码的 pods 库一样了，如果你没有创建过 pods 库的话，出门右转: [使用 pod lib 创建 CocoaPods 库](/2017/07/24-pod-lib-create.html)。

## vendored_frameworks 说明

1、从名字上就可以知道，这个配置支持多个 framework，配置时只需要使用逗号分隔即可；

2、可以支持路径，比如 s.vendored_frameworks = "Release/SCNetworkKit.framework" 那么 SCNetworkKit.framework 必须位于相对于 spec 文件的 Release 目录下，发布到服务器上的压缩文件，解压后也必须能够解压出 Release 文件夹，否则会验证失败！

## vendored_libraries 说明

cocoapods 不仅可以管理 frameworks ，还可以管理 .a 静态库，只需要把 **vendored_frameworks** 换成 **vendored_libraries** 即可!

## resources 说明

前面的博客里没提到 resources 管理，这里顺便提下，假设我的 SohuGameSDK.framework 里包含的有 SohuGame.xcassets 文件夹，podspec 配置如下:

```
s.resources = "SohuGameSDK.framework/SohuGame.xcassets"
```

我觉得很赞的是，不用将资源手动添加到主工程里去，pods会自动通过脚本帮你完成这件事，这个是新版 pods 才有的功能，最初是不支持的，大概是从 1.0 开始支持的！！

## 完

我在做 SDK 开发工作期间，并没有通过 cocoapods 管理，也没有提供 pods 库，原因大概是:

我需要去配合集成 SDK 的 App，有的 App 对于 cocoapods 依赖性很大，也经常更新，对于这个 App 来讲，其实可以支持下 pods库，但是有个 App 虽然使用了 cocoapods，但是好久都没更新过了，工程较复杂，他们不愿意使用这种方式集成，避免更新我的库时，搞乱了他们的工程依赖关系！所以都是手动替换的。

其实使用 cocoapods 实现这一过程也是可以的，举例说明(SDK 发布到内网 CDN服务器):

SDK 要更新包了，我需要:

1. 将 SDK（也就是相关的 frameworks）上传到服务器
2. 升级 podspec 版本号
3. 将 podspec 推送到私有 cocospods

这些工作完全可以通过脚本完成，然后通过 jenkins 调用即可；大致的脚本流程如下:

```
build_sdk : 编译SDK工程
zip_frameworks : 压缩生成的 frameworks
scp_frameworks : 将 zip 包推到 cdn 服务器
generate_spec : 通过模板，生成目标 spec 文件，这里推荐使用 json 格式的spec，便于模板替换
push_spec : 将 spec 文件推送到私聊 pod 仓库
send_mail : 发送邮件给开发者
```

集成者的工作是:

1. 升级 Podfile 里 SDK 的版本号
2. 使用 pod update xx 把指定库更新下来
3. 提交 pods 变动

本文更新时，我已经不再做 SDK 开发了，现在做 App 了，但是也不等于这套流程没用了，因为我可以把这套流程修改成 **组件二进制化** 流程。