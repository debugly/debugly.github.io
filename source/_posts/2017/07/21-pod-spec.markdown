---
layout: post
title: "pod spec 命令"
date: 2017-07-21 11:23:12 +0800
comments: true
tags: [iOS,CocoaPods]
keywords: CocoaPods,podspec,library
---

CocoaPods 工具安装好了，为了更好的利用这个工具，有必要去熟悉下支持的功能，本篇博客介绍的是 pod spec 二级命令。

## pod spec

先看下 spec 命令支持了哪些参数吧

```
➜  ~ pod spec --help
Usage:

    $ pod spec COMMAND

      Manage pod specs

Commands:

    + cat       Prints a spec file
    + create    Create spec file stub.
    + edit      Edit a spec file
    + lint      Validates a spec file
    + which     Prints the path of the given spec

Options:

    --silent    Show nothing
    --verbose   Show more debugging information
    --no-ansi   Show output without ANSI codes
    --help      Show help banner of specified command
```

可以看出共有 5 个命令，还可以加些可选参数，用于控制日志等

- pod spec cat

查看已经发布库的 spec 文件

```
➜  ~ pod spec cat AFNetworking
{
  "name": "AFNetworking",
  "version": "3.2.1",
  "license": "MIT",
  "summary": "A delightful iOS and OS X networking framework.",
  "homepage": "https://github.com/AFNetworking/AFNetworking",
  "social_media_url": "https://twitter.com/AFNetworking",
  "authors": {
    "Mattt Thompson": "m@mattt.me"
  },
  "source": {
    "git": "https://github.com/AFNetworking/AFNetworking.git",
    "tag": "3.2.1",
    "submodules": true
  },
  "requires_arc": true,
  "public_header_files": "AFNetworking/AFNetworking.h",
  "source_files": "AFNetworking/AFNetworking.h",
  "prefix_header_contents": "#ifndef TARGET_OS_IOS\n  #define TARGET_OS_IOS TARGET_OS_IPHONE\n#endif\n\n#ifndef TARGET_OS_WATCH\n  #define TARGET_OS_WATCH 0\n#endif\n\n#ifndef TARGET_OS_TV\n  #define TARGET_OS_TV 0\n#endif",
  "platforms": {
    "ios": "7.0",
    "osx": "10.9",
    "watchos": "2.0",
    "tvos": "9.0"
  },
  "subspecs": [
    {
      "name": "Serialization",
      "source_files": "AFNetworking/AFURL{Request,Response}Serialization.{h,m}",
      "public_header_files": "AFNetworking/AFURL{Request,Response}Serialization.h",
      "watchos": {
        "frameworks": [
          "MobileCoreServices",
          "CoreGraphics"
        ]
      },
      "ios": {
        "frameworks": [
          "MobileCoreServices",
          "CoreGraphics"
        ]
      },
      "osx": {
        "frameworks": "CoreServices"
      }
    },
    {
      "name": "Security",
      "source_files": "AFNetworking/AFSecurityPolicy.{h,m}",
      "public_header_files": "AFNetworking/AFSecurityPolicy.h",
      "frameworks": "Security"
    },
    {
      "name": "Reachability",
      "platforms": {
        "ios": "7.0",
        "osx": "10.9",
        "tvos": "9.0"
      },
      "source_files": "AFNetworking/AFNetworkReachabilityManager.{h,m}",
      "public_header_files": "AFNetworking/AFNetworkReachabilityManager.h",
      "frameworks": "SystemConfiguration"
    },
    {
      "name": "NSURLSession",
      "dependencies": {
        "AFNetworking/Serialization": [

        ],
        "AFNetworking/Security": [

        ]
      },
      "ios": {
        "dependencies": {
          "AFNetworking/Reachability": [

          ]
        }
      },
      "osx": {
        "dependencies": {
          "AFNetworking/Reachability": [

          ]
        }
      },
      "tvos": {
        "dependencies": {
          "AFNetworking/Reachability": [

          ]
        }
      },
      "source_files": [
        "AFNetworking/AF{URL,HTTP}SessionManager.{h,m}",
        "AFNetworking/AFCompatibilityMacros.h"
      ],
      "public_header_files": [
        "AFNetworking/AF{URL,HTTP}SessionManager.h",
        "AFNetworking/AFCompatibilityMacros.h"
      ]
    },
    {
      "name": "UIKit",
      "platforms": {
        "ios": "7.0",
        "tvos": "9.0"
      },
      "dependencies": {
        "AFNetworking/NSURLSession": [

        ]
      },
      "public_header_files": "UIKit+AFNetworking/*.h",
      "source_files": "UIKit+AFNetworking"
    }
  ]
}
```

这个有什么用呢，我主要用他来学习别人的 spec 文件，以改造自己库的 spec 文件。

- pod spec create

创建一个 spec 文件，使用模板把必要信息填充好

```
pod spec create SCNetworkKit

Specification created at SCNetworkKit.podspec
```

- pod spec edit

编辑 cocoapods spec 仓库里 spec 文件

```
pod spec edit SCNetworkKit 
///进入vim编辑器编辑
{
  "name": "SCNetworkKit",
  "version": "1.0.14",
  "summary": "SCNetworkKit is a simple but powerful iOS and OS X networking framework.",
  "description": "SCNetworkKit is a simple but powerful iOS and OS X networking framework,based on NSURLSession and NSURLSessionConfiguration, written by Objective-C, Support iOS 7+ ;",
  "homepage": "http://debugly.cn/SCNetworkKit/",
  "license": "MIT",
  "authors": {
    "qianlongxu": "qianlongxu@gmail.com"
  },
  "platforms": {
    "ios": "7.0",
    "osx": "10.10"
  },
  "source": {
    "git": "https://github.com/debugly/SCNetworkKit.git",
    "tag": "1.0.14"
  },
  "source_files": "SCNetworkKit/Classes/**/*.{h,m}",
  "requires_arc": true
}
```

- pod spec which

查找 spec 文件路径，这个验证了上述 edit 命令编辑的是 cocoapods spec 仓库里的这一说法

```
pod spec which SCNetworkKit
/Users/qianlongxu/.cocoapods/repos/edu-git-cocoapods-specs/Specs/3/1/4/SCNetworkKit/1.0.14/SCNetworkKit.podspec.json
```

- pod spec lint

检验 spec 文件是否合法，不仅检验文件内容是否符合格式，并且会对 pod 库文件进行检查，以免发布后出现链接等报错问题。

```
pod spec lint TestPod.podspec 

 -> TestPod (0.1.0)
    - WARN  | summary: The summary is not meaningful.
    - WARN  | url: The URL (https://github.com/summerhanada@163.com/TestPod) is not reachable.
    - ERROR | [iOS] unknown: Encountered an unknown error ([!] /usr/bin/git clone https://github.com/summerhanada@163.com/TestPod.git /var/folders/hw/trnqbttn445dj8s7jchxhk6r0000gn/T/d20190819-24321-cjtl0w --template= --single-branch --depth 1 --branch 0.1.0

Cloning into '/var/folders/hw/trnqbttn445dj8s7jchxhk6r0000gn/T/d20190819-24321-cjtl0w'...
fatal: unable to access 'https://github.com/summerhanada@163.com/TestPod.git/': The requested URL returned error: 400
) during validation.

Analyzed 1 podspec.

[!] The spec did not pass validation, due to 1 error and 2 warnings.
```

如果自己有 pod 库的话，这个命令很有用，常用的可选参数有:

- --allow-warnings
- --no-clean 
- --fail-fast

## 参考

- [CocoaPods Command-line Reference](https://guides.cocoapods.org/terminal/commands.html#group_specifications)