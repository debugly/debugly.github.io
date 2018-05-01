---
layout: post
title: "使用 U 盘安装 macOS Sierra"
date: 2017-06-19 16:57:32 +0800
comments: true
tags: macOS
keywords: U盘安装 macOS,Sierra,Mac PE FireWolf
---

由于 Mac 无法进入系统，已经分析出了原因 --- 磁盘爆满的缘故，因此就想通过进入 PE 的方式，删除掉无用的文件，这样理论上就应该能够顺利进入系统了！

# 刻盘进 PE

在大学时期曾用 PE 装过 Windows，只不过几年不弄过了，于是就去网上下了 `大白菜 PE`，然后刻成启动盘，然后开始进入 PE 啦！在 Window 上进 PE 要按下 delete，然后选择从 U 盘启动，而 macOS 则是开机时按下 Option 键，然后就会出现选择启动盘 :

开机前插上 U 盘

![](/images/201706/4.JPG)

按住 Option 开机

![](/images/201706/5.JPG)

PE 是 Win8 系统

![](/images/201706/6.JPG)

可惜进入后无法识别苹果分区

![](/images/201706/7.JPG)

安装识别苹果分区软件

![](/images/201706/8.JPG)

然并卵，高版本的系统都是逻辑分区，所以无法识别！！

# Mac PE

网上继续搜寻了一番，发现还有个办法可行，那就是搞个 Mac PE 来识别苹果分区，因为 Mac PE 是使用 macOS 做出来的，所以天然性的就具备识别苹果分区的能力了！啥也不说了，开始装 Mac PE 了:

首先下载镜像文件，google 才能找到官网，百度根本找不到，唉，不说了，去下载吧:

[FireWolf OS X PE V7.0 Download Center](https://www.firewolf.science/firewolf-os-x-pe-v7/download-firewolf-os-x-pe-v7/)

Mac 上使用磁盘工具恢复到 U 盘就行了！同样的开机按住 Option 选择 FireWolf 盘符就行了，当时没拍照，直接看下进去后的情况吧 :

![](/images/201706/9.JPG)

启动后我也傻眼了，妈的磁盘是加密的，虽然识别了，但都是加密的文件，备份了也没啥用。新亏我摸索到了方法，找到磁盘实用工具，选择 `从 Time Machine 恢复`

![](/images/201706/10.JPG)

一步步往下走就行了，走着走着会提示输入密码，因为解密磁盘需要权限，解密后会去搜索备份，结果当然搜不出来了，不过这时文件已经全部解密了！看后面的文件夹名字 : `xuqianlong`

![](/images/201706/11.JPG)

这下以为总算可以了呢，唉，fuck 了，文件是只读的，不能删除！！！好吧，能解密就谢天谢地了，我用移动硬盘copy下资料吧！资料备份后我就放心了，实现是没别的办法了，我选择了重做系统！

# 刻盘装 Mac 系统

若是刻录一个 Windows 的启动盘很简单，很容易就能下到 ios 镜像文件，可是由于苹果官方现在只提供了 macOS Sierra 的升级程序，而没提供完整的镜像，想要全新安装的话，只能自己去制作一个 macOS Sierra 的 U 盘启动盘/安装盘了。没有别的办法先下载安装器吧，然后再想办法恢复到 U 盘，这是 [macOS Sierra](https://itunes.apple.com/us/app/macos-sierra/id1127487414?mt=12) 下载地址，打开 AppStore 下载即可

![](/images/201706/12-0.jpeg)

共 4.96GB，网速慢的话，需要等一阵子了，下载完毕后，你会发现 Launchpad 多出一个 `安装 macOS Sierra`。

![](/images/201706/12-1.png)

然后插上 U 盘，最好是 3.0 的，这样会快些，打开磁盘工具，将其抹掉，格式化为 Mac OS 扩展 （日志式） ，命名为 `Sierra`，然后打开终端执行以下命令 :

```
sudo /Applications/Install\ macOS\ Sierra.app/Contents/Resources/createinstallmedia --volume /Volumes/Sierra --application /Applications/Install\ macOS\ Sierra.app --nointeraction
```

前面是安装器执行文件路径，通过 volume 参数指定安装路径，这里指定 U 盘 : `/Volumes/Sierra`，通过 application 参数指定安装程序，在输入以上命令后，执行过程如下 :

```
Erasing Disk: 0%... 10%... 20%... 30%...100%...
Copying installer files to disk... //这一步会执行好长时间
Copy complete.
Making disk bootable...
Copying boot files...
Copy complete.
Done.
```

看到 Done 之后，就可以了，你会发现 U 盘名称变为了 `Install macOS Sierra`，种种迹象表明 U 盘刻录成功了，可以去装机了，按住 Option 开机吧 :

哇咔咔，选择从 `Install macOS Sierra` 启动！

![](/images/201706/12.JPG)

等待这个进度条走完

![](/images/201706/13.JPG)

好不激动么，选择简体中文

![](/images/201706/14.JPG)

选择安装 macOS

![](/images/201706/15.JPG)

继续吧

![](/images/201706/16.JPG)

选择 MBP 的硬盘
![](/images/201706/17.JPG)

不行，没空间了，所以返回去，找到磁盘工具，格式化硬盘

![](/images/201706/18.JPG)

抹掉就行了

![](/images/201706/19.JPG)

这些可干净了，啥也没了

![](/images/201706/20.JPG)

继续安装

![](/images/201706/21.JPG)

说是7分钟，实际要长些，主要是我 U 盘不是 3.0 的，拷贝文件速度慢

![](/images/201706/22.JPG)

还有 1 分钟

![](/images/201706/23.JPG)

重启是正常的，看来就快好了

![](/images/201706/24.JPG)

选择中国

![](/images/201706/25.JPG)

选择 WiFi

![](/images/201706/26.JPG)

不用传输了

![](/images/201706/27.JPG)

设置下 iCloud

![](/images/201706/28.JPG)

选择时区

![](/images/201706/29.JPG)

哇咔咔，进来了！！！好熟悉的桌面-内华达山脉

![](/images/201706/30.JPG)

刚格式化的时候可用空间是 249G，现在是 239G，看来系统占用了 10G。

![](/images/201706/31.JPG)

# 完

使用 U 盘安装系统或者安装 Mac PE 的前提都是要有个 Mac 才行，这样才能做出启动盘来，这对于很多用户而言是不太容易满足的，所以最好别让我们的 Mac 挂掉，省得如此麻烦，特别建议和我一样使用 256 G 磁盘的用户，多给系统预留一些空间，至少 20G 左右，最好是买个移动做下日常硬盘备份，才不会出现我今天的悲剧! 当磁盘空间小时，Mac 经常弹出来一个提示让我清理，我没有去深度清理，我记得我好像剩下 13G 左右，现在想来还挺后悔的，要不然就不用在这折腾了！
