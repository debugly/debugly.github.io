---
layout: post
title: "安装 CocoaPods"
date: 2017-07-19 10:32:12 +0800
comments: true
tags: [iOS,CocoaPods]
keywords: gem install cocoapods,安装 cocoapods
---

> 前面的博客里简单的介绍过 Ruby，我们也知道了如何安装 Ruby 写的程序库，今天要安装的是大名鼎鼎的 **CocoaPods** ，他也是使用 Ruby 写的！

# Install

如果没接触过 ruby 的话，最好是先来看下这篇博客里的名词解释 : [使用 Rake 重写打包脚本](/script/2017/06/04/use-rake.html#1)

使用 gem 命令安装即可 ： `sudo gem install cocoapods` ；安装过程：

```
Password:
Fetching: i18n-0.8.6.gem (100%)
Successfully installed i18n-0.8.6
Fetching: thread_safe-0.3.6.gem (100%)
Successfully installed thread_safe-0.3.6
Fetching: tzinfo-1.2.3.gem (100%)
Successfully installed tzinfo-1.2.3
Fetching: activesupport-4.2.9.gem (100%)
Successfully installed activesupport-4.2.9
Fetching: nap-1.1.0.gem (100%)
Successfully installed nap-1.1.0
Fetching: fuzzy_match-2.0.4.gem (100%)
Successfully installed fuzzy_match-2.0.4
Fetching: cocoapods-core-1.2.1.gem (100%)
Successfully installed cocoapods-core-1.2.1
Fetching: claide-1.0.2.gem (100%)
Successfully installed claide-1.0.2
Fetching: cocoapods-deintegrate-1.0.1.gem (100%)
Successfully installed cocoapods-deintegrate-1.0.1
Fetching: cocoapods-downloader-1.1.3.gem (100%)
Successfully installed cocoapods-downloader-1.1.3
Fetching: cocoapods-plugins-1.0.0.gem (100%)
Successfully installed cocoapods-plugins-1.0.0
Fetching: cocoapods-search-1.0.0.gem (100%)
Successfully installed cocoapods-search-1.0.0
Fetching: cocoapods-stats-1.0.0.gem (100%)
Successfully installed cocoapods-stats-1.0.0
Fetching: netrc-0.7.8.gem (100%)
Successfully installed netrc-0.7.8
Fetching: cocoapods-trunk-1.2.0.gem (100%)
Successfully installed cocoapods-trunk-1.2.0
Fetching: cocoapods-try-1.1.0.gem (100%)
Successfully installed cocoapods-try-1.1.0
Fetching: molinillo-0.5.7.gem (100%)
Successfully installed molinillo-0.5.7
Fetching: CFPropertyList-2.3.5.gem (100%)
Successfully installed CFPropertyList-2.3.5
Fetching: colored2-3.1.2.gem (100%)
Successfully installed colored2-3.1.2
Fetching: nanaimo-0.2.3.gem (100%)
Successfully installed nanaimo-0.2.3
Fetching: xcodeproj-1.5.1.gem (100%)
Successfully installed xcodeproj-1.5.1
Fetching: escape-0.0.4.gem (100%)
Successfully installed escape-0.0.4
Fetching: fourflusher-2.0.1.gem (100%)
Successfully installed fourflusher-2.0.1
Fetching: gh_inspector-1.0.3.gem (100%)
Successfully installed gh_inspector-1.0.3
Fetching: ruby-macho-1.1.0.gem (100%)
Successfully installed ruby-macho-1.1.0
Fetching: cocoapods-1.2.1.gem (100%)
Successfully installed cocoapods-1.2.1
Parsing documentation for i18n-0.8.6
Installing ri documentation for i18n-0.8.6
Parsing documentation for thread_safe-0.3.6
Installing ri documentation for thread_safe-0.3.6
Parsing documentation for tzinfo-1.2.3
Installing ri documentation for tzinfo-1.2.3
Parsing documentation for activesupport-4.2.9
Installing ri documentation for activesupport-4.2.9
Parsing documentation for nap-1.1.0
Installing ri documentation for nap-1.1.0
Parsing documentation for fuzzy_match-2.0.4
Installing ri documentation for fuzzy_match-2.0.4
Parsing documentation for cocoapods-core-1.2.1
Installing ri documentation for cocoapods-core-1.2.1
Parsing documentation for claide-1.0.2
Installing ri documentation for claide-1.0.2
Parsing documentation for cocoapods-deintegrate-1.0.1
Installing ri documentation for cocoapods-deintegrate-1.0.1
Parsing documentation for cocoapods-downloader-1.1.3
Installing ri documentation for cocoapods-downloader-1.1.3
Parsing documentation for cocoapods-plugins-1.0.0
Installing ri documentation for cocoapods-plugins-1.0.0
Parsing documentation for cocoapods-search-1.0.0
Installing ri documentation for cocoapods-search-1.0.0
Parsing documentation for cocoapods-stats-1.0.0
Installing ri documentation for cocoapods-stats-1.0.0
Parsing documentation for netrc-0.7.8
Installing ri documentation for netrc-0.7.8
Parsing documentation for cocoapods-trunk-1.2.0
Installing ri documentation for cocoapods-trunk-1.2.0
Parsing documentation for cocoapods-try-1.1.0
Installing ri documentation for cocoapods-try-1.1.0
Parsing documentation for molinillo-0.5.7
Installing ri documentation for molinillo-0.5.7
Parsing documentation for CFPropertyList-2.3.5
Installing ri documentation for CFPropertyList-2.3.5
Parsing documentation for colored2-3.1.2
Installing ri documentation for colored2-3.1.2
Parsing documentation for nanaimo-0.2.3
Installing ri documentation for nanaimo-0.2.3
Parsing documentation for xcodeproj-1.5.1
Installing ri documentation for xcodeproj-1.5.1
Parsing documentation for escape-0.0.4
Installing ri documentation for escape-0.0.4
Parsing documentation for fourflusher-2.0.1
Installing ri documentation for fourflusher-2.0.1
Parsing documentation for gh_inspector-1.0.3
Installing ri documentation for gh_inspector-1.0.3
Parsing documentation for ruby-macho-1.1.0
Installing ri documentation for ruby-macho-1.1.0
Parsing documentation for cocoapods-1.2.1
Installing ri documentation for cocoapods-1.2.1
Done installing documentation for i18n, thread_safe, tzinfo, activesupport, nap, fuzzy_match, cocoapods-core, claide, cocoapods-deintegrate, cocoapods-downloader, cocoapods-plugins, cocoapods-search, cocoapods-stats, netrc, cocoapods-trunk, cocoapods-try, molinillo, CFPropertyList, colored2, nanaimo, xcodeproj, escape, fourflusher, gh_inspector, ruby-macho, cocoapods after 16 seconds
26 gems installed

```

如遇到问题，很能是源的问题，可以开启 VPN ，或者替换为下面的源地址：

- Ruby 社区的 Gem 托管服务: RubyGems.org
- RubyGems 镜像 gems.ruby-china.org
- RubyGems 镜像 ruby.taobao.org

查看当前源 ：

```
gem sources -l
*** CURRENT SOURCES ***
https://rubygems.org/
```

将官方 rubygems.org 修改为国内的 gems.ruby-china.org 源地址 ：

```
gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
```

安装完毕后最好是 **pod setup** 下，作用是把 [CocoaPods 仓库](https://github.com/CocoaPods/Specs.git) clone 到本地。

# Try

可以尝试玩下：

- 版本 ： pod --version
- 搜索 ： pod search SCNetworkKit
- 尝试demo ： pod try SCNetworkKit

更多命令 ：

```
+ cache         Manipulate the CocoaPods cache
+ deintegrate   Deintegrate CocoaPods from your project
+ env           Display pod environment
+ init          Generate a Podfile for the current directory
+ install       Install project dependencies according to versions from a
                Podfile.lock
+ ipc           Inter-process communication
+ lib           Develop pods
+ list          List pods
+ outdated      Show outdated project dependencies
+ plugins       Show available CocoaPods plugins
+ repo          Manage spec-repositories
+ search        Search for pods
+ setup         Setup the CocoaPods environment
+ spec          Manage pod specs
+ trunk         Interact with the CocoaPods API (e.g. publishing new specs)
+ try           Try a Pod!
+ update        Update outdated project dependencies and create new
                Podfile.lock
```

可选参数 ：

```
--silent        Show nothing
--version       Show the version of the tool
--verbose       Show more debugging information
--no-ansi       Show output without ANSI codes
--help          Show help banner of specified command
```