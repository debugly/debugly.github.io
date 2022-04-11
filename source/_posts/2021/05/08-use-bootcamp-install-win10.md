---
layout: post
title: Mac 电脑安装 Win10 双系统
date: 2021-05-08 11:00:06
tags: ["macOS"]
---

### 前提条件

- 只有一个 macOS 系统的 Mac 电脑（大部分情况下是只有一个的，但实际上 Mac 电脑也可以装多个 macOS 系统，如果装了多个 macOS 系统则，BootCamp 安装时会提示磁盘分区失败，我怀疑是 BootCamp 的 bug，没有处理磁盘被分成多个区的情况）
- Win10 安装盘镜像（可从网络上下载）
- Mac 硬盘最好能大于 512 GB，太小的话后续使用很不方便，两个系统可能都面临磁盘不足的尴尬局面
- 使用 BootCamp 软件安装，我使用的 macOS 系统里都有这个软件

实际上 BootCamp 不仅可以安装 Win10，之前也有安装过 Win7 等系统，都是一样的操作步骤，只是现在 Win10 比较流行，因此选择安装 Win10 系统。

<!--more-->

### 详细步骤

- 打开仿达(Finder) ，找到应用程序里的实用工具文件夹，然后打开 **启动转换助理(BootCamp)** 
![](/images/202105/bootcamp-win10/1.jpg)
- 我把镜像放到桌面了，会自动寻找到镜像文件，默认给 Windows 分配 40GB 空间，我这里调整为 100 GB。
点击安装时不能插优盘或者移动硬盘，否则无法继续。
![](/images/202105/bootcamp-win10/2.jpg)
- 点击安装，则会开始下载 BootCamp 软件以及适合这台机器的 Windows 相关驱动软件
![](/images/202105/bootcamp-win10/3.jpg)
- 还会对磁盘进行分区，如果 Mac 已经对磁盘分过区，则可能失败；可以先删除掉保留一个分区后再装
![](/images/202105/bootcamp-win10/4.jpg)
- 下载必要的软件，大约需要 10 分钟左右；准备完毕后，会自动重启，进入 Windows 安装步骤

![](/images/202105/bootcamp-win10/5.jpg)

- 语言使用默认的简体中文

![](/images/202105/bootcamp-win10/6.jpg)

- 操作系统，我选择的是企业版，因为公司的 Dell 本装的也都是企业版的，个人安装时选择其他版本也可以

![](/images/202105/bootcamp-win10/7.jpg)

- 选择好了，下一步即可

![](/images/202105/bootcamp-win10/8.jpg)

- 正在准备，等待几分钟即可，中间可能会重启

![](/images/202105/bootcamp-win10/9.jpg)

- 重启完毕，需要进行一些基础设置

![](/images/202105/bootcamp-win10/10.jpg)

- 网络设置这里，需要选择无网络连接，因为没有网卡驱动，点击继续执行有限设置，先跳过

![](/images/202105/bootcamp-win10/11.jpg)

- 设置登录用户名

![](/images/202105/bootcamp-win10/12.jpg)

- 隐私设置，我全都关闭了，不需要这些服务

![](/images/202105/bootcamp-win10/13.jpg)

- 看到  “嗨，别来无恙啊！” 就表示安装成功了

![](/images/202105/bootcamp-win10/14.jpg)

- 稍等几分钟就会进入桌面

![](/images/202105/bootcamp-win10/15.jpg)

![](/images/202105/bootcamp-win10/16.jpg)

- 此时查看网络连接，会发现不正常，根本没有任何连接，即使你周围有 wifi 信号📶

![](/images/202105/bootcamp-win10/17.jpg)

- 查看账户信息，则提示需要激活

![](/images/202105/bootcamp-win10/18.jpg)

- 不要着急，打开计算机 D 盘，是的这个 D 盘是 BootCamp 帮你创建的，后续重启后会自行删掉

![](/images/202105/bootcamp-win10/19.jpg)

- 不要执行这个 step 程序（如果你想看看也无妨）其实就是上面的安装过程，这是个 Windows 安装引导程序

![](/images/202105/bootcamp-win10/20.jpg)

- 敲黑板：点击进入 BootCamp 目录

![](/images/202105/bootcamp-win10/21.jpg)

- 以管理员身份**运行 Setup 程序**

![](/images/202105/bootcamp-win10/22.jpg)

- 我猜测其过程是安装 Drivers 目录下的驱动程序

![](/images/202105/bootcamp-win10/23.jpg)

- 点击完成，自动重启 Windows

![](/images/202105/bootcamp-win10/24.jpg)

- 重启进入后，再次查看计算机，你会发现 D 盘没了，里面的内容其实没用了

![](/images/202105/bootcamp-win10/25.jpg)

- 再次查看网络连接，你会发现可以搜寻到 WiFi 信号了（其实装上驱动后没重启时就已经有了）

![](/images/202105/bootcamp-win10/26.jpg)

- 我连上公司的内网，然后查看账号，就不提示激活了，查看关于也都是正常的，非常赞，不用费劲找公司的 MS 人员搞激活了

![](/images/202105/bootcamp-win10/27.jpg)

### 切换系统

如需在 macOS 和 Windows 之间切换，只需要按下开机键后按住 option 键即可！

第一次从 Windows 切到 macOS 你会发现有两个 EFI Boot 的启动盘，你不要管他，选择 macOS 即可。

![](/images/202105/bootcamp-win10/28.jpg)

- 下次启动，你会发现，咦，正常了，EFI Boot 启动盘就剩一个了

![](/images/202105/bootcamp-win10/29.jpg)

直接开机，不按 option 键则进入上次进入的那个系统。

### 完

可以看到 Mac 电脑安装 Windows 很简单，只需要准备好一个 Windows 的镜像就可以了，其他的事情 BootCamp 会帮你搞定！

注意：安装系统有风险，重要资料做好备份先！

Windows 的系统镜像可以从这里获取 ：[MSDN, 我告诉你 - 做一个安静的工具站 (itellyou.cn)](https://msdn.itellyou.cn/)

