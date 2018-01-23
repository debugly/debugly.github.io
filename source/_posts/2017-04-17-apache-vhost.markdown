---
layout: post
title: "Mac 上配置 Apache 服务器"
date: 2017-04-17 22:58:19 +0800
comments: true
tags: Other
keywords: Apache,Mac,Vhost
---

> 我在业余时间搭建了一个博客式 SDK 分发服务器，用于公司内部分发 SDK 到其他部门，挺方便的，提交完代码，一键远程打包，打完自动上传到服务器，生成下载地址，不影响本地工作...
> 因此用到了一些 Apache 的知识，日后也会着重介绍下我的分发服务器...

# 如何控制Apache

Apache 要启动一个系统服务，可能没有权限，一般 sudo 即可；

### 检查

Mac 系统自带的有 Apache，不用自己去下载的，除非你觉得不适合你；查看下版本信息：

```
apachectl -v
///正常会输出类似以下的信息
Server version: Apache/2.4.23 (Unix)
Server built:   Aug  8 2016 16:31:34
```
看到这个就 OK 啦，你可以启动啦 ！

### 启动

- sudo apachectl start

启动后浏览器访问：[localhost](localhost)  就会看到 **It workes.**

### 重启

- sudo apachectl restart

### 关闭

- sudo apachectl stop

# Apache 目录下重要的配置文件

- /etc/apache2/  : 是 Apache 的相关目录
- etc/apache2/httpd.conf : 是 Apache 最重要的配置文件了；操作前千万要记得备份，万一搞坏了可以还原！！！我就吃了大亏了，害得我后面搞虚拟主机花费了好长时间。。。

```
sudo cp /etc/apache2/httpd.conf /etc/apache2/httpd.conf~backup
```
- etc/apache2/extra/httpd-vhosts.conf : Apache 是模块化的，配置虚拟主机的话最好是在这个配置文件里做，不要直接写在 httpd.conf 里，当然你就是想写再 httpd.conf 里也会生效的，这个配置文件最好也备份下。

# 配置 Virtual Hosts

虚拟主机有多种，可基于 host，IP，port；我需要用的是在本机配置，因此我采用同一 IP 不同 port 的方式；

没有备份的话，上面提到的两个配置文件快去备下份！

1. 启动Apache，看到 **It works.** 保证你的Apache是好用的。
2. 找到 httpd.confg 文件，使用 vi 或者 Atom 之类的文本编辑器编辑；

	- 想好你的端口号了吗？没的话就随便想个吧；搜索 80 ，大概在 52 行，你接着写要监听的端口号：

	```
	Listen 80
	Listen 8000
	Listen 9000
	```

	除了默认的80端口之外，我还配置了 8000 和 9000，端口不要太小，太小的端口可能会被别的服务占用！

	- 搜索 vhost，大概在 160 行左右，找到
	```
	#LoadModule vhost_alias_module libexec/apache2/mod_vhost_alias.so
	```
	去掉前面的 **#**,这个 **#** 表示注释，我们要使用虚拟主机功能，因此让 Apache 加载对应的 so 模块！
	- 继续搜索，大概在 500 行左右，找到
	```
	#Include /private/etc/apache2/extra/httpd-vhosts.conf
	```
	也是去掉前面的 **#**，为的是让 Apache 加载 httpd-vhosts.conf 配置文件！
3. 接下来关闭并保存 httpd.confg 文件，打开 httpd-vhosts.conf 配置文件；就可以配置虚拟主机了，比如：

	```
	<VirtualHost *:80>
       DocumentRoot "/Users/xuqianlong/websites/apache"
       <Directory "/Users/xuqianlong/websites/apache">
          Options FollowSymLinks Multiviews Indexes
          MultiviewsMatch Any
          AllowOverride None
          Require all granted
      </Directory>
	</VirtualHost>

	<VirtualHost *:8000>
       DocumentRoot "/Users/xuqianlong/websites/apache/aa"
       <Directory "/Users/xuqianlong/websites/apache/aa">
          Options FollowSymLinks Multiviews Indexes
          MultiviewsMatch Any
          AllowOverride None
          Require all granted
      </Directory>
	</VirtualHost>

	<VirtualHost *:9000>
       DocumentRoot "/Users/xuqianlong/websites/apache/bb"
       <Directory "/Users/xuqianlong/websites/apache/bb">
          Options FollowSymLinks Multiviews Indexes
          MultiviewsMatch Any
          AllowOverride None
          Require all granted
      </Directory>
	</VirtualHost>
	```

我配置了 3 个端口号，分别指向不同的目录，并且配置了目录的访问权限；接下来可以测试了，浏览器输入：

```
localhost   ///对应 /Users/xuqianlong/websites/apache 目录下的内容
localhost:8000  ///对应 /Users/xuqianlong/websites/apache/aa 目录下的内容
localhost:9000  ///对应 /Users/xuqianlong/websites/apache/bb 目录下的内容
```

这里也有个坑，就是你可能会遇到 403 的情况，我就遇到了，搞了半天才解决，原因是 DocumentRoot 目录不能在 /Users/xuqianlong/Documents 目录下，也就是不能在个人用户的文稿目录下！！！

# 困惑

如果你仔细看 httpd.conf 配置文件的话，你会发现大概235行处也有DocumentRoot 和 Directory 的配置：

```
DocumentRoot "/Library/WebServer/Documents"
<Directory "/Library/WebServer/Documents">
```

这和 httpd-vhosts.conf 里的差不多，他们有什么关系呢？老实说这个我现在还没搞明白，不过这个一般别改，要么就是不配置虚拟主机，直接把这个改为你自己的服务器目录，也是能访问的，我试过，可如果你既修改这个又在 httpd-vhosts.conf 里配置就很容易出问题，我就出了问题了，后来找的备份，重新搞的，所以我在前面开始操作前就再三提醒大家要备份！！！

# TODO

打包服务器还不支持 iOS OTA，主要是没有 SSL 证书，购买的话不划算，太贵了！准备自签一个，然后配置下 https，为搭建 OTA 做好准备！
