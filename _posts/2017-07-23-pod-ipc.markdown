---
layout: post
title: "pod ipc 命令"
date: 2017-07-22 16:23:12 +0800
comments: true
tags: ["iOS","CocoaPods"]
keywords: CocoaPods,podspec,library
---

本篇博客介绍的是 pod ipc 命令，我们已经知道了 .podspec 文件是 ruby 格式的，在做自动化时，不容易去解析修改，因此可以通过 ipc 命令转为 json 格式，当然 cocoapods 也是支持 json 格式的 podspec 文件的。

## pod ipc

先看下 ipc 二级命令支持了哪些参数吧

```
➜  ~ pod ipc --help   
Usage:

    $ pod ipc COMMAND

      Inter-process communication

Commands:

    + list                  Lists the specifications known to CocoaPods
    + podfile               Converts a Podfile to YAML
    + podfile-json          Converts a Podfile to JSON
    + repl                  The repl listens to commands on standard input
    + spec                  Converts a podspec to JSON
    + update-search-index   Updates the search index

Options:

    --silent                Show nothing
    --verbose               Show more debugging information
    --no-ansi               Show output without ANSI codes
    --help                  Show help banner of specified command
```

可以看出共有 6 个命令，还可以加些可选参数，用于控制日志等

- pod ipc spec

将 ruby 格式 的 podspec 文件转为 json 格式。

```
pod ipc spec SCNetworkKit.podspec     
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

- pod ipc podfile

Podfile 转为 YAML 格式

```
✗ pod ipc podfile Podfile     
---
installation_method:
  name: cocoapods
  options:
    :generate_multiple_pod_projects: true
workspace: SHVideoPlayer.xcworkspace
sources:
  - "git@code.debugly.com:ifox/Pods_Specs.git"
  - https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git
target_definitions:
  - abstract: true
    children:
      - dependencies:
          - KVOController_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - MRFoundation_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - VLCKit
        name: MRMoviePlayerKit
        user_project_path: MRMoviePlayerKit/MRMoviePlayerKit
      - dependencies:
          - MRFoundation_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - SCHTTPServer_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - SCJSONUtil_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - SCNetworkKit_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
        name: LaunchHelper
        user_project_path: SHVideoPlayer/SHVideoPlayer.xcodeproj
      - dependencies:
          - Crashlytics
          - Fabric
          - GCDWebServer_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - KVOController_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - Masonry_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - MMKV_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - MRFoundation_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - SAMKeychain_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - SCJSONUtil_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - SCNetworkKit_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - SDWebImage_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - SSZipArchive_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
          - VLCKit
          - xxtea_B:
            - :path: "./Pods_Static_Agent/Pods_Spec"
        name: SHPlayer
        user_project_path: SHVideoPlayer/SHVideoPlayer.xcodeproj
    name: Pods
    platform:
      osx: '10.10'
    uses_frameworks: true
```

- pod ipc podfile-json

Podfile 转为 JSON 格式

```
pod ipc podfile-json Podfile
{
    "target_definitions": [
        {
            "name": "Pods",
            "abstract": true,
            "platform": {
                "osx": "10.10"
            },
            "uses_frameworks": true,
            "children": [
                {
                    "name": "MRMoviePlayerKit",
                    "user_project_path": "MRMoviePlayerKit/MRMoviePlayerKit",
                    "dependencies": [
                        {
                            "KVOController_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        "VLCKit",
                        {
                            "MRFoundation_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "LaunchHelper",
                    "user_project_path": "SHVideoPlayer/SHVideoPlayer.xcodeproj",
                    "dependencies": [
                        {
                            "SCNetworkKit_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "SCJSONUtil_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "SCHTTPServer_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "MRFoundation_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "SHPlayer",
                    "user_project_path": "SHVideoPlayer/SHVideoPlayer.xcodeproj",
                    "dependencies": [
                        {
                            "SCNetworkKit_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "SCJSONUtil_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "SSZipArchive_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "SDWebImage_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "Masonry_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "GCDWebServer_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "MMKV_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "xxtea_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "KVOController_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        {
                            "SAMKeychain_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        },
                        "VLCKit",
                        "Fabric",
                        "Crashlytics",
                        {
                            "MRFoundation_B": [
                                {
                                    "path": "./Pods_Static_Agent/Pods_Spec"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "sources": [
        "https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git",
        "git@code.debugly.com:ifox/Pods_Specs.git"
    ],
    "workspace": "SHVideoPlayer.xcworkspace",
    "installation_method": {
        "name": "cocoapods",
        "options": {
            "generate_multiple_pod_projects": true
        }
    }
}
```

## 参考

- [CocoaPods Command-line Reference](https://guides.cocoapods.org/terminal/commands.html#group_ipc)