---
layout: post
title: iOS 脚本打包之 xcodebuild 用法
date: 2018-08-29 14:09:10
tags: [iOS,Script]
---

> 1、不要把脚本打包想象的那么难
> 
> 2、你应当至少会使用一门脚本语言来提升效率

## 一行命名就能打包

```shell
xcodebuild
```

该命名会使用默认配置+默认Target（多个Target会选择第一个作为默认）+ Release Configuration 进行打包。

- 如果目录下有多个 project 就不能打了，因为他还没有聪明到可以自动选择你想要打包 project 的地步。
- 如果目录下没有 project 文件，而是 *.xcworkspace 的话，也必须加上一些额外参数才能打，因为我们知道一个 workspace 里面可以包含多个  project，每个 project 可以包含多个 Target，可以为每个 Target 建立 Scheme，多以工程环境是很复杂的；比如我之前的一个项目：
	
	```
	xcodebuild -list -workspace SohuLive.xcworkspace/
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

为了让打包更加灵活，可以实际使用时都会带上一些参数，下面举例说明。

## Project + Scheme

适用于一个 Project 里面包含 N 个 Scheme 的工程:

### Clean

```shell
xcodebuild -project "${XC_PROJECT}" \
	        -scheme "${SCHEME_NAME}" \
	        -configuration "${XC_CONFIGURATION}" \
	        clean
```

### Build

```shell
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
	        OTHER_LDFLAGS="$OTHER_LDFLAGS"
```

## Man xcodebuild

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