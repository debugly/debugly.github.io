---
layout: post
title: iOS 自动化构建（一）
date: 2018-08-29 14:09:10
tags: [iOS,Script]
---

回想 17 年自己想搞自动化构建，没有相关环境，只好使用 crontab 去做，真是好费劲，因为很多环境变量没有，本地调试好的脚本可是定时任务执行时就报错。这是之前对 crontab 使用的简单介绍：[macOS 定时任务](/2017/09/05-unix-crontab.html)

而现在呢，我们有了自己的打包机，打包机上装了 jenkins，为脚本执行提供了环境，支持参数化构建，定时构建，远程构建等。

jenkins 执行的是脚本，他不能操作我们的 xCode，所以我们要把打包命令写成脚本，交给 jenkins 去执行，因此今天来看下如何使用命令打 iOS 的包。

<!--more-->

# 名词解释

在学习打包命名之前，有必要先简单统一下对 xCode 工程相关概念的理解：

- Project：一个 xCode工程包含了所有文件、资源以及构建一个或者多个产品的必要信息的仓库。工程可包含一个或多个目标产物（target），定义了适用于所有 target的默认构建配置（每个Target可以指定自己的构建配置）。工程文件可以单独存在，也可以包含到 workspace 里，以 .xcodeproj 为后缀。官网解释：[Xcode Project](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Projects.html)
- Workspace：工作空间是一个这样的文档：包含了一个或多个Project（或者其他类型的文档，并不局限于Project）。除此之外，还能很好的解决间接或直接依赖关系。并且这些工程的产物也在同一个build目录下，工程文件以 .xcworkspace 为后缀。官网解释：[Xcode Workspace](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Workspace.html#//apple_ref/doc/uid/TP40009328-CH7-SW1)
- Target：包含了构建指定产品的指令和文件以及如何构建；一个 target 对应一个产品；一个工程可以包含一个或多个 target；同一时刻只能有一个激活的 target，通过指定 scheme 做到这一点。官网解释：[Xcode Target](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Targets.html#//apple_ref/doc/uid/TP40009328-CH4-SW1)
- Scheme：将指定 targets 的构建过程分类，默认情况下新增一个 target 就会自动为其生成一个同名的 Scheme，目前构建过程有：Build、Run、Test、Profile、Analyze、Archive。官网解释：[Xcode Scheme](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Schemes.html#//apple_ref/doc/uid/TP40009328-CH8-SW1)
- BuildSettings：一个 build setting 就是一个变量，这个变量是很具体的，决定了编译器应当如何处理。前面提到了每个工程都有默认的 build settings，每个target 默认继承这些配置，当然可以指定 target 的配置来覆盖工程配置。一个配置就是一个键值对，具体配置信息就比较多了，比如是否支持 bitcode，CPU架构支持哪些，是否开启 ARC 等。除了 xCode 的默认配置外，也可以自定义配置；在 xCode里看到的不是配置的键值对，而是显示名称，如何拿到这些键值对呢？有个小技巧是在 xCode 里选中具体配置，复制下，粘贴到文本编辑器里就行了！官网解释：[Build Settings](https://developer.apple.com/library/archive/featuredarticles/XcodeConcepts/Concept-Build_Settings.html#//apple_ref/doc/uid/TP40009328-CH6-SW1)

说了这么多还没接触到打包命令，是不是着急了呢，客官别急，马上就来。

# 一行命令

```shell
xcodebuild
```

该命令会使用默认配置+默认 Target（多个 Target 会选择第一个作为默认）+ Release Configuration 进行打包。

- 如果目录下有多个 project 就不能打了，因为他还没有聪明到可以自动选择你想要打包 project 的地步。
- 如果目录下没有 project 文件，而是 *.xcworkspace 的话，也必须加上一些额外参数才能打，因为我们知道一个 workspace 里面可以包含多个  project，每个 project 可以包含多个 Target，可以为每个 Target 建立 Scheme，所以工程环境是很复杂的；比如我之前的一个项目，使用 `xcodebuild -list 命令查看工程信息`：
	
```
xcodebuild -workspace SohuLive.xcworkspace -list
Information about workspace "SohuLive":
Schemes:
    OCLint
    SohuCoreFoundation
    SohuDoudizhu4AppStore
    SohuDoudizhu4Inhouse
    SohuDoudizhuDevelop
    SohuDoudizhuLane
    SohuDoudizhuSDK
    SohuEduSDK
    SohuGameSDK
    SohuLiveDemo
    SohuLiveDemo4Car
    SohuLiveDemo4News
    SohuLiveDemo4Puppy
    SohuLiveSDK-Car
    SohuLiveSDK-News
    SohuLiveSDK-Puppy
    SohuLiveSDK-Video
    SohuOneSDK
    SohuOpenSDKDemo
    SohuUploadDemo
    SohuUploadSDK
    SohuVideoFoundation
    SohuVRDemo
    
/// 查看工程
xcodebuild -list -project /Users/qianlongxu/Documents/GitWorkSpace/awesome-smallgame-sdk/iOS-Libs/SSZipArchive/SSZipArchive.xcodeproj 
Information about project "SSZipArchive":
Targets:
    SSZipArchive copy
    SSZipArchive

Build Configurations:
    Debug
    Release

If no build configuration is specified and -scheme is not passed then "Release" is used.

Schemes:
    SSZipArchive
    SSZipArchive copy
```

一般都使用了 workspace ，所以打包时都会带上一些参数，不会直接使用这一行命令，下面举例说明。

## Project + Scheme

适用于一个 Project 里面包含 N 个 Scheme 的工程:

### Clean

这命令相当于我们 xCode 里的 `cmd + k`，要打包了，所以先清理下缓存。

```shell
xcodebuild -project "${XC_PROJECT}" \
           -scheme "${SCHEME_NAME}" \
           clean
```

### Build

这命令相当于我们 xCode 里的 `cmd + b`，用于编译出我们想要的产品。

```shell
#BUILD_DIR="${BUILD_DIR}"就是一个build setting键值对
xcodebuild -project "${XC_PROJECT}" \
	        -scheme "${SCHEME_NAME}" \
	        -configuration "${XC_Configuration}" \
	        -sdk "${tmp_sdk}" \
	        BUILD_DIR="${BUILD_DIR}" \
	        DWARF_DSYM_FOLDER_PATH="${CURRENT_BUILD_DIR}" \
	        DEBUG_INFORMATION_FORMAT="$DEBUG_INFORMATION_FORMAT" \
	        DWARF_DSYM_FILE_NAME="$DWARF_DSYM_FILE_NAME" \
	        GCC_PREPROCESSOR_DEFINITIONS="${GCC_PREPROCESSOR_DEFINITIONS}" \
	        FULL_PRODUCT_NAME="$FULL_PRODUCT_NAME" \
	        PRODUCT_NAME="$PRODUCT_NAME" \
	        MACH_O_TYPE="$MACH_O_TYPE" \
	        ENABLE_BITCODE="$ENABLE_BITCODE" \
	        OTHER_LDFLAGS="$OTHER_LDFLAGS" \
	        build
```

Clean，Build 是什么？这些是构建行为，默认是 build，所以可以不写；出了这个两个常用的之外还有 test，archive 用于测试和归档。

## Workspace + Scheme

适用于 Workspace 工程，命令跟打 Project 的差不多:

### Clean

这命令相当于我们 xCode 里的 `cmd + k`，要打包了，所以先清理下缓存。

```shell
xcodebuild -workspace "${XC_PROJECT}" \
           -scheme "${SCHEME_NAME}" \
           clean
```

### Build

这命令相当于我们 xCode 里的 `cmd + b`，用于编译出我们想要的产品。

```shell
#BUILD_DIR="${BUILD_DIR}"就是一个build setting键值对
xcodebuild -workspace "${XC_PROJECT}" \
	        -scheme "${SCHEME_NAME}" \
	        -configuration "${XC_Configuration}" \
	        -sdk "${tmp_sdk}" \
	        BUILD_DIR="${BUILD_DIR}" \
	        DWARF_DSYM_FOLDER_PATH="${CURRENT_BUILD_DIR}" \
	        DEBUG_INFORMATION_FORMAT="$DEBUG_INFORMATION_FORMAT" \
	        DWARF_DSYM_FILE_NAME="$DWARF_DSYM_FILE_NAME" \
	        GCC_PREPROCESSOR_DEFINITIONS="${GCC_PREPROCESSOR_DEFINITIONS}" \
	        FULL_PRODUCT_NAME="$FULL_PRODUCT_NAME" \
	        PRODUCT_NAME="$PRODUCT_NAME" \
	        MACH_O_TYPE="$MACH_O_TYPE" \
	        ENABLE_BITCODE="$ENABLE_BITCODE" \
	        OTHER_LDFLAGS="$OTHER_LDFLAGS" \
	        build
```

# 如何查看 buildsettings

刚接触打包命令，不知道键值对是啥，上面也提到了，你可以去 xCode 里复制，或者使用命令把当前配置给全部打出来，你去挑选也行：

```
qianlongxu:SSZipArchive qianlongxu$ xcodebuild -project 'SSZipArchive.xcodeproj' -showBuildSettings
Build settings for action build and target SSZipArchive:
    ACTION = build
    AD_HOC_CODE_SIGNING_ALLOWED = NO
    ALTERNATE_GROUP = staff
    ALTERNATE_MODE = u+w,go-w,a+rX
    ALTERNATE_OWNER = qianlongxu
    ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES = NO
    ALWAYS_SEARCH_USER_PATHS = NO
    ALWAYS_USE_SEPARATE_HEADERMAPS = NO
    APPLE_INTERNAL_DEVELOPER_DIR = /AppleInternal/Developer
    APPLE_INTERNAL_DIR = /AppleInternal
    APPLE_INTERNAL_DOCUMENTATION_DIR = /AppleInternal/Documentation
    APPLE_INTERNAL_LIBRARY_DIR = /AppleInternal/Library
    APPLE_INTERNAL_TOOLS = /AppleInternal/Developer/Tools
    APPLICATION_EXTENSION_API_ONLY = NO
    APPLY_RULES_IN_COPY_FILES = NO
    ARCHS = armv7 arm64
    ARCHS_STANDARD = armv7 arm64
	//....
```

除了 -list -showBuildSettings 之外，还有 -version -sdk -showdestinations 等辅助命令。

# Man xcodebuild

如何知道一个命令后面应该加什么参数呢？这可能是很多新手的疑问，答案是通过文档！


```
man xcodebuild
///你会看到如下使用规则
xcodebuild [-project name.xcodeproj]
           [[-target targetname] ... | -alltargets]
           [-configuration configurationname]
           [-sdk [sdkfullpath | sdkname]] [action ...]
           [buildsetting=value ...] [-userdefault=value ...]

xcodebuild [-project name.xcodeproj] -scheme schemename
           [[-destination destinationspecifier] ...]
           [-destination-timeout value]
           [-configuration configurationname]
           [-sdk [sdkfullpath | sdkname]] [action ...]
           [buildsetting=value ...] [-userdefault=value ...]

xcodebuild -workspace name.xcworkspace -scheme schemename
    	  [[-destination destinationspecifier] ...]
    	  [-destination-timeout value]
```

# 结束语

有兴趣的可以去动手实践了，如果是 SDK 开发，那么 build 之后就能顺利拿到 .a 或者 .framework;当如果是 App 开发的话，恐怕还拿不到 .ipa，下一篇准备搞个 带 SDK 的 App 工程并配套打包脚本。