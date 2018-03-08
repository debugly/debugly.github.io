---
layout: post
title: "创建自己的 CocoaPods 库"
date: 2017-07-20 17:23:12 +0800
comments: true
tags: [iOS,CocoaPods]
keywords: CocoaPods,podspec,library
---

使用 CocoaPods 管理 iOS 库已经不是什么新鲜事了，我最近刚开源了一个网络库，为了方便集成使用，因此决定支持下 CocoaPods，期间也遇到了几个问题，分享给大家。

# 准备工作

创建 Pods 库，其实意思是让你的开源库支持 CocoaPods 管理，因此前提是你应当有一个开源库，先发布到 github 上，记得创建空仓库的时候让 github 给你生成一个 license，方面等会填写 Spec License。

在创建 Pods 库之前，我已经把 demo 和 SCNetworkKit 库发布到 github 上了，这是目录结构：

![](/images/201707/20-SCNetwork-folder.png)

注意：其实只需要把库的源码放进来就好了，等创建完毕 pods 库之后，再创建 demo ；由于支持 pods 之前我已经有了 demo 了所以就暂时没删除。

记得在最后一次提交记录那里添加一个 tag，并 push 到 github 上，记住这个 tag 值，一会要用到！

# 创建 podspec

首先进入到仓库跟目录：

`cd /Users/crown/gitworkspace/SCNetworkKit`

我们将在这个目录里创建一个 SCNetworkKit.podspec 文件，文件里面是一些配置和描述信息，使用如下命令创建：

`pod spec create SCNetworkKit`

看到提示 `Specification created at SCNetworkKit.podspec` 就表明创建好了！接下来我们修改这个文件，必要的配置改下就好了：

- s.name : 默认已经帮你写好了，不用改了，这个名字就是别人 pod 你的库的名字；
- s.version : 这个 version 和你 github 仓库的tag是对应的，比如我的tag 是 1.0.0；
- s.summary : 对这个库的一个简单描述，不写的话等会验证的时候会有警告，别人搜索这个库的时候也会显示出来，所以最好写下；
- s.description : 这个是个详细的描述，文字个数要比 summary 写得要多，否则也有警告；注意写到两个 DESC 之间就好了；
- s.homepage : 如果这个库有主页的话，可以填上，搜索这个库的时候也会显示出来的；
- s.license : 改为你实际使用的 license 即可，如果没有的话，那就创建一个补上；
- s.author : 作者，会帮你填写为 git 的全局账户；
- s.platform : 根据实际情况写 iOS 或者 OS X；
- s.source : 填上仓库地址，需要https哦，或者写 ssh 的也行；
- s.source_files : 库文件所在目录，可以递归；
- s.framework : 依赖的系统库；
- s.library : 依赖的系统库；
- s.requires_arc : 是否必须是 arc；
- s.dependency : 你这个库依赖了哪些其他 pods 库；

第一次可能写不好，所以可以直接下载一个，看着改。

写好了，就验证下文件是否有误，可能需要多次修改，多次验证：

`pod spec lint --allow-warnings`

我遇到的错误：

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

还遇到了这个错误：

```
 -> SCNetworkKit (1.0.0)
    - ERROR | [iOS] xcodebuild: Returned an unsuccessful exit code. You can use `--verbose` for more information.
    - NOTE  | xcodebuild:  /var/folders/2z/l7ftfgd54lv0_nvq7pnr_zbw0000gn/T/CocoaPods/Lint/DerivedData/App/Build/Products/Release-iphonesimulator/SCNetworkKit/SCNetworkKit.framework/Headers/SCNetworkKit.h:14:9: fatal error: 'SCJSONUtil.h' file not found
    - NOTE  | xcodebuild:  /var/folders/2z/l7ftfgd54lv0_nvq7pnr_zbw0000gn/T/CocoaPods/Lint/App/main.m:3:9: fatal error: could not build module 'SCNetworkKit'
    - NOTE  | xcodebuild:  clang: error: linker command failed with exit code 1 (use -v to see invocation)
    - NOTE  | [iOS] xcodebuild:  fatal error: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/lipo: can't open input file: /var/folders/2z/l7ftfgd54lv0_nvq7pnr_zbw0000gn/T/CocoaPods/Lint/DerivedData/App/Build/Intermediates/App.build/Release-iphonesimulator/App.build/Objects-normal/i386/App (No such file or directory)
```

原因是 demo 里有个 SCJSONUtil.h 文件，我不小心把他导入到 SCNetworkKit.h 里了，但是 pods 检查是不会去下载 demo，所以根本找不到这个 SCJSONUtil.h 这个头文件！！！于是我删了这个头文件，接着 push 到了 github，并且修改了 tag 号！ 再次检查后发现还是这个错误，试了几次都是，我觉得不对劲，是不是走了缓存了？沿着这个思路去检查，发现果真不是每次检查都会重新下载代码的，而是读了缓存了！！！因此我删掉了缓存的代码，再次验证就通过了！ 删除之后，发现在 Copy 之前会重新下载！

```
Downloading dependencies

-> Installing SCNetworkKit (1.0.0)
 > Git download
 > Git download
     $ /usr/bin/git clone https://github.com/debugly/SCNetworkKit.git
     /var/folders/2z/l7ftfgd54lv0_nvq7pnr_zbw0000gn/T/d20170720-43460-137oplc
     --template= --single-branch --depth 1 --branch 1.0.0
     Cloning into '/var/folders/2z/l7ftfgd54lv0_nvq7pnr_zbw0000gn/T/d20170720-43460-137oplc'...
     Note: checking out '733b52034ca83c8ced0fb709e40bec8e3ccde344'.
     
     You are in 'detached HEAD' state. You can look around, make experimental
     changes and commit them, and you can discard any commits you make in this
     state without impacting any branches by performing another checkout.
     
     If you want to create a new branch to retain commits you create, you may
     do so (now or later) by using -b with the checkout command again. Example:
     
       git checkout -b <new-branch-name>
> Copying SCNetworkKit from
  `/Users/crown/Library/Caches/CocoaPods/Pods/External/SCNetworkKit/d91c7ff7dcd08eaf54117a932c0d41d7-2e598`
  to
  `../../../../private/var/folders/2z/l7ftfgd54lv0_nvq7pnr_zbw0000gn/T/CocoaPods/Lint/Pods/SCNetworkKit`
  - Running pre install hooks
```

这个过程可能会遇到各种错误，只要耐心看打印的日志，一般都能解决的，可能需要反复验证，需要有些耐心！

通过后会打印:

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

```
pod trunk me
  - Name:     Matt Reach
  - Email:    qianlongxu@gmail.com
  - Since:    July 20th, 02:05
  - Pods:
    - SCNetworkKit
  - Sessions:
    - July 20th, 02:05 - November 25th, 04:34. IP: 125.35.217.43
```

# 发布 podspec

将刚才已经验证通过的 podspec push 到 cocoapods 的仓库里，这样别人就能通过 pods 搜索到你的库了，从而使用你的库了；

```
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

看到这个就表明已经 push 成功了！！

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

```
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

# 创建 demo

为了方便别人使用，快速上手，最好创建一个 demo，和库放在同一个仓库就可以了.

- 首先创建一个干净的工程，然后为之编写 Podfile :

```
platform :ios, '7.0'

target 'SCNDemo' do
    pod "SCNetworkKit", '~>1.0.3'
    pod 'SCJSONUtil', '~>2.4.1'
end
```

- 接下来使用 `pod update` 安装pods库，（由于是新库，可能使用 `pod install` 会失败）；

- 最后在 demo 里写几个调用库的范例就 OK 了！

当别人使用 pod try 的时候，就会把你这个 demo 下载到一个临时目录里，如果不提供 demo，别人就无法使用 pod try 尝试你的库！

# 更新 pods 库版本

你的开源库会越来越稳定，功能也更加的强大，这时就应该考虑升级下 pods 库的版本了，做法很简单：

- 首先给仓库打个新的标签，标签名就是 pods 库的版本号，比如我的网络库升级到了 1.0.1 了，就打个 1.0.1 的 tag，然后 push 到 github ;
- 把 podspec 文件里的版本号也更新为 1.0.1，然后推送到 cocoapods 仓库 :

	```
	pod trunk push SCNetworkKit.podspec 
	Updating spec repo `master`
	
	CocoaPods 1.3.0.beta.3 is available.
	To update use: `sudo gem install cocoapods --pre`
	[!] This is a test version we'd love you to try.
	
	For more information, see https://blog.cocoapods.org and the CHANGELOG for this version at https://github.com/CocoaPods/CocoaPods/releases/tag/1.3.0.beta.3
	
	Validating podspec
	 -> SCNetworkKit (1.0.1)
	
	Updating spec repo `master`
	
	CocoaPods 1.3.0.beta.3 is available.
	To update use: `sudo gem install cocoapods --pre`
	[!] This is a test version we'd love you to try.
	
	For more information, see https://blog.cocoapods.org and the CHANGELOG for this version at https://github.com/CocoaPods/CocoaPods/releases/tag/1.3.0.beta.3
	
	
	--------------------------------------------------------------------------------
	 🎉  Congrats
	
	 🚀  SCNetworkKit (1.0.1) successfully published
	 📅  July 21st, 00:16
	 🌎  https://cocoapods.org/pods/SCNetworkKit
	 👍  Tell your friends!
	--------------------------------------------------------------------------------
	```
- 最后把 podspec 文件的更改提交到 github 仓库，不提也没有关系，只是为了方便下次修改而已，因为已经 push 到 cocoapods 仓库里了！