---
layout: post
title: Mac 突然连不上网了
date: 2022-01-19 22:00:06
tags: macOS
---

昨天还用的好好的，第二天就连不上网了，还是头一次遇到。

<!--More-->

查看 Wifi 连接状态如下：

![icon.png](/images/202201/wifi/icon.png)

点开wifi列表后可以到显示了一个安全性低的提示，打开详情如下：

![icon.png](/images/202201/wifi/info.png)

常规性的尝试都解决不了：重启路由，修改 DHCP 固定的 IP 地址，删除 Wifi 连接重新连，修改 Wifi 加密方法为 WAP2 或者 WAP2/WAP3 混合都不行。

## 解决方案

后来网上找到一个方法，重置网络就可以了：打开 `/Library/Preferences/SystemConfiguration` 目录，把除了 com.apple.Boot.plist 之外的文件全部删除，然后重启 Mac。