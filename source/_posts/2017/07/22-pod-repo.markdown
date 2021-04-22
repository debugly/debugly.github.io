---
layout: post
title: "pod repo 命令"
date: 2017-07-22 16:23:12 +0800
comments: true
tags: [iOS,CocoaPods]
keywords: CocoaPods,podspec,library
---

本篇博客介绍的是 pod repo 命令，推送 podspec 文件，创建 pods 私有库等均会用到 repo 命令。

## pod repo

先看下 repo 二级命令支持了哪些参数吧

```
➜  ~ pod repo --help                                                 
Usage:

    $ pod repo [COMMAND]

      Manage spec-repositories

Commands:

    + add       Add a spec repo
    + add-cdn   Add a spec repo backed by a CDN
    + lint      Validates all specs in a repo
    > list      List repos
    + push      Push new specifications to a spec-repo
    + remove    Remove a spec repo
    + update    Update a spec repo

Options:

    --silent    Show nothing
    --verbose   Show more debugging information
    --no-ansi   Show output without ANSI codes
    --help      Show help banner of specified command
```

可以看出共有 7 个命令，还可以加些可选参数，用于控制日志等

- pod repo add

添加 podspec 仓库，用于搭建私有库

```
pod repo add Pods_Specs git@code.debugly.com:ifox/Pods_Specs.git    
Cloning spec repo `Pods_Specs` from `git@code.debugly.com:ifox/Pods_Specs.git
```

Pods_Specs 为私有仓库别名，默认是 master，这个名字在推送 spec 文件时也需要用到，因此需要留意下，别起的太随意了！


- pod repo add-cdn

cocoapods 1.7 之后添加的新功能，暂时还没去尝试。

- pod repo lint

验证仓库下的所有 spec 文件

```
➜  ~ pod repo lint Pods_Specs  

Linting spec repo `Pods_Specs`

.......................................................................................

Analyzed 87 podspecs files.

All the specs passed validation.
```

- pod repo list

查看所有的 spec 仓库

```
➜  ~ pod repo list           

edu-git-cocoapods-specs
- Type: git (master)
- URL:  https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git
- Path: /Users/qianlongxu/.cocoapods/repos/edu-git-cocoapods-specs

master
- Type: git (master)
- URL:  https://github.com/CocoaPods/Specs.git
- Path: /Users/qianlongxu/.cocoapods/repos/master

Pods_Specs
- Type: git (master)
- URL:  git@code.debugly.com:ifox/Pods_Specs.git
- Path: /Users/qianlongxu/.cocoapods/repos/Pods_Specs

3 repos
```

- pod repo push

将 spec 文件推送到仓库，不执行仓库时，默认是官方的 master 仓库。

```
pod repo push Pods_Specs SCHTTPServer_B.podspec --allow-warnings

Validating spec
 -> SCHTTPServer_B (1.0.56)
    - WARN  | http: The URL (`http://110.117.36.192/Pods_Static/1.0.56/SCHTTPServer.framework.zip`) doesn't use the encrypted HTTPS protocol. It is crucial for Pods to be transferred over a secure protocol to protect your users from man-in-the-middle attacks. This will be an error in future releases. Please update the URL to use https.
    - WARN  | [OSX] license: Unable to find a license file
    - NOTE  | xcodebuild:  note: Using new build system
    - NOTE  | [OSX] xcodebuild:  note: Planning build
    - NOTE  | [OSX] xcodebuild:  note: Constructing build description

Updating the `Pods_Specs' repo


Adding the spec to the `Pods_Specs' repo

 - [Update] SCHTTPServer_B (1.0.56)

Pushing the `Pods_Specs' repo


[!] 'SCHTTPServer_B' uses the unencrypted 'http' protocol to transfer the Pod. Please be sure you're in a safe network with only trusted hosts. Otherwise, please reach out to the library author to notify them of this security issue.

[!] Unable to read the license file `LICENSE` for the spec `SCHTTPServer_B (1.0.56)`

[!] Unable to read the license file `LICENSE` for the spec `SCHTTPServer_B (1.0.56)`
```

- pod repo remove

移除现有的 spec 仓库，这里只做个测试玩下。

```
✗ pod repo remove abc            
[!] repo abc does not exist

Usage:

    $ pod repo remove NAME

      Deletes the remote named `NAME` from the local spec-repos directory at
      `/Users/qianlongxu/.cocoapods/repos`.
```

- pod repo update

pods spec 仓库本质上是个 git 仓库，所以 update 命名是从远程拉取 git 仓库而已。

```
✗ pod repo update Pods_Specs
Updating spec repo `Pods_Specs`
  $ /usr/bin/git -C /Users/qianlongxu/.cocoapods/repos/Pods_Specs fetch origin
  --progress
  $ /usr/bin/git -C /Users/qianlongxu/.cocoapods/repos/Pods_Specs rev-parse
  --abbrev-ref HEAD
  master
  $ /usr/bin/git -C /Users/qianlongxu/.cocoapods/repos/Pods_Specs reset --hard
  origin/master
  HEAD is now at 84ae3ae [Update] MRFoundation_B (1.0.56)
```

## 参考

- [CocoaPods Command-line Reference](https://guides.cocoapods.org/terminal/commands.html#group_repos)