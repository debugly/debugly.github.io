---
layout: post
title: "使用 pod lib 创建 CocoaPods 库"
date: 2017-07-24 17:23:12 +0800
comments: true
tags: [iOS,CocoaPods]
keywords: CocoaPods,podspec,library
---

使用 [CocoaPods](https://cocoapods.org/) 管理 iOS 依赖库已经不是什么新鲜事了，我最近刚开源了一个网络库，为了方便集成使用，因此决定支持下 CocoaPods，期间也遇到了几个问题，分享给大家。

打个广告，我维护了几个 Pods 库，欢迎使用:

- [JSONUtil](https://github.com/debugly/SCJSONUtil)  JSON 转 model 工具
- [SCNetworkKit](https://github.com/debugly/SCNetworkKit) iOS/macOS 网络库
- [SCHTTPServer](https://github.com/debugly/SCHTTPServer) macOS 内嵌 HTTPS 服务器
- [SCHTTPClient](https://github.com/debugly/SCHTTPClient) macOS libcurl 客户端

# pod lib 

创建 CocoaPods 库主要使用 pod lib 命令， 先看下该命令支持哪些命令参数吧

```
➜  ~ pod lib --help                                      
Usage:

    $ pod lib COMMAND

      Develop pods

Commands:

    + create    Creates a new Pod
    + lint      Validates a Pod

Options:

    --silent    Show nothing
    --verbose   Show more debugging information
    --no-ansi   Show output without ANSI codes
    --help      Show help banner of specified command
```

支持两个命令参数，一个是创建，一个是验证。

# 创建 pod 库

创建 Pods 库非常简单，只需要使用 lib 命令即可完成，详细过程如下:

```zsh
➜  demoWorkspace pod lib create TestPod     
Cloning `https://github.com/CocoaPods/pod-template.git` into `TestPod`.
Configuring TestPod template.

------------------------------

To get you started we need to ask a few questions, this should only take a minute.

If this is your first time we recommend running through with the guide: 
 - https://guides.cocoapods.org/making/using-pod-lib-create.html
 ( hold cmd and double click links to open in a browser. )


What platform do you want to use?? [ iOS / macOS ]
 > iOS      

What language do you want to use?? [ Swift / ObjC ]
 > Objc

Would you like to include a demo application with your library? [ Yes / No ]
 > Yes

Which testing frameworks will you use? [ Specta / Kiwi / None ]
 > None

Would you like to do view based testing? [ Yes / No ]
 > No

What is your class prefix?
 > MR

Running pod install on your new library.

Analyzing dependencies
Fetching podspec for `TestPod` from `../`
Downloading dependencies
Installing TestPod (0.1.0)
Generating Pods project
Integrating client project

[!] Please close any current Xcode sessions and use `TestPod.xcworkspace` for this project from now on.
Sending stats
Pod installation complete! There is 1 dependency from the Podfile and 1 total pod installed.

 Ace! you're ready to go!
 We will start you off by opening your project in Xcode
  open 'TestPod/Example/TestPod.xcworkspace'

To learn more about the template see `https://github.com/CocoaPods/pod-template.git`.
To learn more about creating a new pod, see `https://guides.cocoapods.org/making/making-a-cocoapod`.
➜  demoWorkspace 
```

按照提示填写库支持的平台和使用的语言，以及是否需要测试框架，类前缀等；选择 iOS 和 macOS 是有些区别的，如果选择 macOS 平台，那么下一步就不会提示使用哪种语言生成 demo，而是强制使用 Swift 语言！

按照上面的步骤操作无误时，会自动打开 TestPod 工程，workspace 里还包含了 Pods 工程，用来管理demo对于库的依赖，其目录结构如下所示：

```
├── Example
│   ├── Podfile
│   ├── Podfile.lock
│   ├── Pods
│   ├── TestPod
│   ├── TestPod.xcodeproj
│   ├── TestPod.xcworkspace
│   └── Tests
├── LICENSE
├── README.md
├── TestPod
│   ├── Assets
│   └── Classes
├── TestPod.podspec
└── _Pods.xcodeproj -> Example/Pods/Pods.xcodeproj
```

目录含义如下：

- Example : 用来编写 demo，编写测试用例等，当别人使用 pod try 的时候，就会把你这个 demo 下载到一个临时目录里，如果不提供 demo，别人就无法使用 pod try 尝试你的库！
- LICENSE : 自动生成的是 MIT，后续可以修改
- README.md : 可以按照 markdown 格式编写一个概况，放到 github 上就会自动渲染
- TestPod : pod 库默认文件夹，可以在 .podspec 文件里修改
- TestPod.podspec : pod 库的细则文件，该文件非常重要，详细见下面说明

# 完善 .podspec 文件

TestPod.podspec 里面有好多模板内容，接下来我们来根据实际情况去完善下，这个文件支持的配置项非常多，你必要每个都修改，必要的改下就好了，至于哪些是必要的，无需记忆，后面有命令去验证，验证不过的修改下就好了：

- s.name : 默认是创建库时输入的名字，也是使用这个库时 Podfile 里填写的名字
- s.version : 库的版本，每次发布新版本时修改下，刚创建的是 0.1.0
- s.summary : 对库的一个简单描述，不写的话等会验证的时候会有警告；搜索这个库的时候会显示出来，所以最好写下
- s.description : 对库的一个详细描述，文字个数要比 summary 写得要多，否则也有警告；注意要写在两个 DESC 之间，可随意换行
- s.homepage : 如果这个库有主页的话，可以填上，搜索这个库的时候也会显示出来的；
- s.license : 默认生成了 MIT，可以根据需要进行修改
- s.author : 作者信息，默认根据 git 账户信息填写
- s.platform : 根据实际情况写 iOS 或者 OS X；
- s.source : 源码管理方式，常用的是git方式: { :git => 'https://github.com/tonymillion/Reachability.git', :tag => 'v3.1.0' }
	- :git => :tag, :branch, :commit, :submodules
	- :svn => :folder, :tag, :revision
	- :hg => :revision
	- :http => :flatten, :type, :sha256, :sha1, :headers
- s.source_files : 库文件所在目录，可以递归
- s.framework : 依赖的系统库
- s.library : 依赖的系统库
- s.requires_arc : 是否必须是 arc；
- s.dependency : 你这个库依赖了哪些其他 pods 库；

第一次可能写不好，所以最好是找个已经发布的 pod 库，看下是怎么写的，然后看着改。可以使用 `pod spec cat xx` 命令，具体参考 : [pod spec 命令](/2017/07/21-pod-spec.html)

注: 提到的 .podspec 文件，均指 TestPod.podspec 文件，TestPod 为库的名称。

# 验证 .podspec

完善好了 podspec 文件，并且代码也准备好后，就可以验证下了，如果是第一次搞，可能需要多次修改验证才能通过；验证这块有 3 点需要说下：

1、先本地验证而不是从指定的 source 验证；因为从指定的 source 下载验证比较麻烦，需要先提交，然后再拉取，如果出错了，就要再提交，基于 git + tag 管理源码的话，还得重新打 tag

2、验证出错了，不知道错在哪里，无从下手时，加上 **-\-verbose -\-no-clean** 可以查看整个过程，帮助我们快速找到问题

3、远程验证会受到缓存的影响，如果修改了代码，确定没问题了，但还是验证不通过，有可能是缓存搞的鬼，可以通过日志去排查，避免缓存干扰；

这里提到的 source 就是在 .podspec 文件所指定的，下面具体看下验证过程吧。

## 本地验证

我之所以叫本地验证，是因为验证的是放在本地的 pod 库，没有从指定的 source 下载代码，所以本地验证前也不用把代码传到 source 指定处。

```bash
pod cache clean --all
pod lib lint
```

我当时遇到的错误：

```
-> SCNetworkKit (1.0.0)
    - ERROR | [iOS] xcodebuild: Returned an unsuccessful exit code. You can use `--verbose` for more information.
    - NOTE  | xcodebuild:  Headers/Public/SCNetworkKit/SCNetworkKit.h:11:9: fatal error: 'NSDictionary+SCAddtions.h' file not found
    - NOTE  | xcodebuild:  clang: error: linker command failed with exit code 1 (use -v to see invocation)
    - NOTE  | [iOS] xcodebuild:  fatal error: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/lipo: can't open input file: /var/folders/2z/l7ftfgd54lv0_nvq7pnr_zbw0000gn/T/CocoaPods/Lint/DerivedData/App/Build/Intermediates/App.build/Release-iphonesimulator/App.build/Objects-normal/i386/App (No such file or directory)
    - NOTE  | [iOS] xcodebuild:  error: cannot parse the debug map for "/var/folders/2z/l7ftfgd54lv0_nvq7pnr_zbw0000gn/T/CocoaPods/Lint/DerivedData/App/Build/Products/Release-iphonesimulator/App.app/App": No such file or directory
```

这个原因是我最初路径我写错了，写成了 `s.source_files  = "SCNetworkKit/*.{h,m}"`，没有递归查找子文件夹里的类，所以说这个类别文件找不到！我是通过加上 `--verbose` 之后，查看执行过程发现的，验证的时候会下载文件，然后 copy 到别的目录去编译，我发现没有下载子文件里的文件！

```
-> Installing SCNetworkKit (1.0.0)
  > Copying SCNetworkKit from
  `/Users/crown/Library/Caches/CocoaPods/Pods/External/SCNetworkKit/d91c7ff7dcd08eaf54117a932c0d41d7-b0517`
  to
  `../../../../private/var/folders/2z/l7ftfgd54lv0_nvq7pnr_zbw0000gn/T/CocoaPods/Lint/Pods/SCNetworkKit`
  - Running pre install hooks
```

## 远程验证

远程验证是相对本地验证而言的，验证时会从指定的 source 下载代码，因此需要把代码先提交到远程。

在本地验证没有问题后，pod 库是能在本地用的，放到自己的版本控制里，当做私有库去使用也是可以的，但是作为一个开源库就需要发布出去了，发布前最好做个远程验证，虽然发布时还会验证，但还是建议单独走下验证。

```bash
pod cache clean --all
pod spec lint --allow-warnings
```

如果本地验证无误的话，到这一步反而出错了？一般都是 source 的问题，只要耐心看打印的日志，一般都能快速解决的。常见问题比如将代码 push 到远程了，但是却忘记 打 tag，或者打的 tag 跟 .podspec 文件里指定的不一致，都会导致远程验证时不能下载代码而报错！

我的 pod 库都是放到 github 的，版本都是采用 tag 管理，因此 .podspec 文件可以这么写:

```
s.version  = "1.0.0"
s.source   = { :git => "https://github.com/debugly/SCHTTPClient.git", :tag => s.version.to_s }
```

这样后续只需要修改 version 的值就可以了，然后远程验证时就会拉取 version 对应的 tag 标签。

验证通过打印如下信息:

```
** BUILD SUCCEEDED **

 -> SCNetworkKit (1.0.0)

Analyzed 1 podspec.

SCNetworkKit.podspec passed validation.
```

# 创建账户

发布之前需要创建一个 CocoaPods 的账户，如果你有多个电脑，那么你可以注册多次，以邮箱地址为唯一标识，一个邮箱地址可以在多台电脑上注册！

`pod trunk register youar@email.com 'nickName’`

通过这个命令注册后，你的邮箱很快就会收到 CocoaPods 发来的验证链接，点击即可激活，名称无法修改哦！激活之后，我们返回到终端继续往下操作即可，使用 `pod trunk me` 查看个人信息：

```bash
~ pod trunk me
  - Name:     Matt Reach
  - Email:    qianlongxu@gmail.com
  - Since:    July 20th, 2017 02:05
  - Pods:
    - SCNetworkKit
    - TestSCFPods
    - SCJSONUtil
    - SCHTTPServer
    - SCHTTPClient
  - Sessions:
    - July 20th, 2017 02:05     - November 26th, 2017 00:36. IP:
    125.35.217.43  
    - July 20th, 2017 07:21     - November 25th, 2017 08:19. IP:
    117.10.28.87   
    - September 9th, 2017 19:32 -     March 7th, 2018 23:46. IP:
    125.35.217.43  
    - April 18th, 2018 07:02    - December 15th, 2018 09:04. IP:
    221.198.236.178
    - November 26th, 2018 23:00 -      December 25th, 05:11. IP:
    61.240.25.170  
```

# 发布/更新 podspec

将刚才已经验证通过的 podspec 文件推送到 cocoapods 的仓库里，这样别人就能通过 pods 搜索到你的库了。

```bash
pod trunk push SCNetworkKit.podspec 
Updating spec repo `master`

CocoaPods 1.3.0.beta.2 is available.
To update use: `sudo gem install cocoapods --pre`
[!] This is a test version we'd love you to try.

For more information, see https://blog.cocoapods.org and the CHANGELOG for this version at https://github.com/CocoaPods/CocoaPods/releases/tag/1.3.0.beta.2

Validating podspec
 -> SCNetworkKit (1.0.0)

Updating spec repo `master`

CocoaPods 1.3.0.beta.2 is available.
To update use: `sudo gem install cocoapods --pre`
[!] This is a test version we'd love you to try.

For more information, see https://blog.cocoapods.org and the CHANGELOG for this version at https://github.com/CocoaPods/CocoaPods/releases/tag/1.3.0.beta.2


--------------------------------------------------------------------------------
 🎉  Congrats

 🚀  SCNetworkKit (1.0.0) successfully published
 📅  July 20th, 02:58
 🌎  https://cocoapods.org/pods/SCNetworkKit
 👍  Tell your friends!
--------------------------------------------------------------------------------
```

Congrats 表明已经发布成功了！！

更新的步骤除了创建用户外没啥不一样的，步骤如下:

1、修改好代码，demo正常跑起来
2、本地验证
3、推送代码
4、打tag
5、远程验证
6、推送 podspec 文件

# 🔍搜索

是不是很高兴呢，Pods 库创建好了，我们试着搜下吧：

`pod search SCNetworkKit`

结果是：

```
[!] Unable to find a pod with name, author, summary, or description matching `SCNetworkKit`
```

好郁闷呢，明明已经成功发布了，为何就是搜索不到呢？这是因为再次之前我搜过别的库，CocoaPods 做了缓存了，因此我们找到他的搜索索引缓存，将它删除即可：

`rm -rf ~/Library/Caches/CocoaPods`

再次搜索，会重新建立索引，这个过程大概需要片刻，耐心等待即可:

```bash
pod search SCNetworkKit
Creating search index for spec repo 'macdownapp'.. Done!
Creating search index for spec repo 'master'.. Done!

-> SCNetworkKit (1.0.0)
   SCNetworkKit is a simple but powerful iOS network framework.
   pod 'SCNetworkKit', '~> 1.0.0'
   - Homepage: http://debugly.cn/SCNetworkKit/
   - Source:   https://github.com/debugly/SCNetworkKit.git
   - Versions: 1.0.0 [master repo]
(END)
```

# 参考

- [Using Pod Lib Create](https://guides.cocoapods.org/making/using-pod-lib-create.html)
- [Podspec Syntax Reference ](https://guides.cocoapods.org/syntax/podspec.html#group_multi_platform_support)