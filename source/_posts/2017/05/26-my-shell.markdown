---
layout: post
title: "常用的 Shell 内置变量与命令"
date: 2017-05-26 21:03:36 +0800
comments: true
tags: Script
keywords: shell,Linux shell
---

> 日常工作中，特别是我搭建远程打包环境的过程中用到了不少 Shell 命令，这里记录下，省得以后再去查询，浪费时间。

## 内置变量

以下结果来自 Mac OS 10.12，提示：这些内置变量是以美元符号开头的哈,因为这些都是变量，在 Shell 脚本里面取变量的值需要以美元符号开头；

- $SHELL : 查看终端使用是哪种 shell，shell 也不止一种哦: `/bin/bash`
- $HOME : 登陆用户主目录: `/Users/xuqianlong`
- $PATH : 截取一小段来看下: `/opt/local/bin:/opt/local/sbin`,分号是分隔符;在终端输入命令就能执行的原理其实是，遍历设置的PATH路径，直到找到该命令如果找不到就输出：`-bash: ee: command not found` 学习过 Java 的同学肯定都知道 Path 的概念。
- $USER  : 当前登陆用户名称: `xuqianlong`
- $OSTYPE :  操作系统类型: `darwin16`
- $MACHTYPE :  CPU架构及系统类型: `x86_64-apple-darwin16`
- $LANG : 语言类型: `zh_CN.UTF-8`

## 命令

- env 查看所有的环境变量，这个命令太厉害了，上面提到的好多内置变量的值都包括了：

```shell
MANPATH=/Users/xuqianlong/.nvm/versions/node/v4.0.0/share/man:/Library/Java/JavaVirtualMachines/jdk1.8.0_40.jdk/Contents/Home/man:/usr/local/share/man:/usr/share/man:/opt/X11/share/man:/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.12.sdk/usr/share/man:/Applications/Xcode.app/Contents/Developer/usr/share/man:/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/share/man
NVM_IOJS_ORG_VERSION_LISTING=https://iojs.org/dist/index.tab
rvm_bin_path=/Users/xuqianlong/.rvm/bin
TERM_PROGRAM=Apple_Terminal
SHELL=/bin/bash
TERM=xterm-256color
TMPDIR=/var/folders/d2/bt0v98895vd53lcx9w_spzdw0000gn/T/
NVM_PATH=/Users/xuqianlong/.nvm/versions/node/v4.0.0/lib/node
Apple_PubSub_Socket_Render=/private/tmp/com.apple.launchd.f7R2BOD9jj/Render
TERM_PROGRAM_VERSION=377
TERM_SESSION_ID=75991873-8124-4503-8BA0-F10EB73C0D84
NVM_DIR=/Users/xuqianlong/.nvm
USER=xuqianlong
_system_type=Darwin
rvm_path=/Users/xuqianlong/.rvm
SSH_AUTH_SOCK=/private/tmp/com.apple.launchd.SZQYe5MXKe/Listeners
__CF_USER_TEXT_ENCODING=0x1F5:0x19:0x34
rvm_prefix=/Users/xuqianlong
PATH=/Library/Frameworks/Python.framework/Versions/3.5/bin:/opt/local/bin:/opt/local/sbin:/Users/xuqianlong/.nvm/versions/node/v4.0.0/bin:/Library/Java/JavaVirtualMachines/jdk1.8.0_40.jdk/Contents/Home/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/X11/bin:/Users/xuqianlong/libwebp-0.5.1-mac-10.9/bin:/Users/xuqianlong/bin:/Users/xuqianlong/.rvm/bin
NVM_NODEJS_ORG_MIRROR=https://nodejs.org/dist
PWD=/Users/xuqianlong
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_40.jdk/Contents/Home
LANG=zh_CN.UTF-8
_system_arch=x86_64
XPC_FLAGS=0x0
_system_version=10.12
XPC_SERVICE_NAME=0
rvm_version=1.27.0 (latest)
SHLVL=1
HOME=/Users/xuqianlong
LOGNAME=xuqianlong
NVM_BIN=/Users/xuqianlong/.nvm/versions/node/v4.0.0/bin
NVM_IOJS_ORG_MIRROR=https://iojs.org/dist
DISPLAY=/private/tmp/com.apple.launchd.0jBYczqYJG/org.macosforge.xquartz:0
SECURITYSESSIONID=186a6
_system_name=OSX
_=/usr/bin/env
```

- cat 查看文本内容，比如查看下机器上安装了几种 shell：cat /etc/shells

```shell
# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
```

- ls /bin/*sh ，结果跟上面是一样的
- hostname -s 主机名称: `debugly`
- tar -czf sdk.tar.gz *.framework : 先将目录里所有后缀名为 framework 的文件打包成 sdk.tar，然后用 gzip 压缩，生成 sdk.tar.gz 压缩的压缩包

## ps

用 ps 命令可以查看进程相关信息，哪些进程正在运行和运行状态、进程是否结束、进程有没有僵死、哪些进程占用了过多地资源等等。

```
qianlongxu:~ qianlongxu$ ps
  PID TTY           TIME CMD
 2771 ttys000    0:00.07 -bash
 2836 ttys001    0:00.06 -bash
 1398 ttys004    0:00.10 -bash

qianlongxu:~ qianlongxu$ echo $$
2771

qianlongxu:~ qianlongxu$ ps -f
  UID   PID  PPID   C STIME   TTY           TIME CMD
  501  2771  2770   0  8:45上午 ttys000    0:00.07 -bash
  501  2836  2835   0  8:45上午 ttys001    0:00.06 -bash
  501  1398  1397   0  3:55下午 ttys004    0:00.10 -bash

qianlongxu:~ qianlongxu$ ps -e
  PID TTY           TIME CMD
    1 ??         0:51.90 /sbin/launchd
   51 ??         0:04.78 /usr/libexec/UserEventAgent (System)
 ///此处省略好多行
 2770 ttys000    0:00.04 login -pf qianlongxu
 2771 ttys000    0:00.07 -bash
 2900 ttys000    0:00.00 ps -e
 2835 ttys001    0:00.01 login -pf qianlongxu
 2836 ttys001    0:00.06 -bash
 1397 ttys004    0:00.02 login -pf qianlongxu
 1398 ttys004    0:00.10 -bash

///查看进程关系
qianlongxu:~ qianlongxu$ ps -f
  UID   PID  PPID   C STIME   TTY           TIME CMD
  501  2987  2986   0  9:00上午 ttys000    0:00.06 -bash
qianlongxu:~ qianlongxu$ zsh
qianlongxu%  
qianlongxu% ps -f
  UID   PID  PPID   C STIME   TTY           TIME CMD
  501  2987  2986   0  9:00上午 ttys000    0:00.07 -bash
  501  3102  2987   0  9:04上午 ttys000    0:00.03 zsh
```

## 重定向

使用重定向，可以轻松的提供输入，改变输出；

- 输出重定向：

	- ">" 覆盖文本

	```shell
	echo "abc" > "aa.txt"
	echo "abc" > "aa.txt"
	echo "abc" > "aa.txt"
	//查看 aa.txt 文件，内容是：
	abc
	```

	-  ">>" 追加文本

	```shell
	echo "abc" >> "aa.txt"
	echo "abc" >> "aa.txt"
	echo "abc" >> "aa.txt"
	//查看 aa.txt 文件，内容是：
	abc
	abc
	abc
	```

- 输入重定向：

	```shell
	///读取 aa.txt 文件的第一行，然后打印
	read line < aa.txt;echo $line
	///结果是：
	abc
	```

## 管道

这是一个强大的 shell 命令，可将输出结果作为另一个程序的输入，符号 : "\|" ，比如查看当前目录，并且按字母顺序排列：

```shell
ls | sort

Applications
Desktop
Documents
Downloads
GitBook
Library
Movies
Music
Pictures
Public
apache-tomcat-7.0.64
bin
cstudy
cworkspace
```

可以看出先排大写字母，后排小写字母，原因是大写字母的 ASCLL 比小写的小了 32，即：A + 32 = a ,A = 65.

## scp

本机传输文件到远程服务器:

```shell
scp /Users/qianlongxu/Downloads/id_rsa.pub crown@10.7.40.176:~/id_rsa.pub  
```

## ssh

- 登陆远程服务器:

```shell
ssh crown@10.7.40.176
///输入密码
```
- 免密码登录

> 可以把客户机的公钥放到远程服务器上，实现自动验证，无需泄露服务器密码

```
///将公钥追加到这个文件末尾
cat id_rsa.pub >> ~/.ssh/authorized_keys
```

## kill jekyll server

我修改 Rakefile 的时候，修改不当导致没能处理INT，后果就是我们按下 `ctrl + c` 的时候没有将该子线程杀死，然后再次启动服务时就会报错:

```shell
jekyll 3.3.0 | Error:  Address already in use - bind(2) for 127.0.0.1:4000
```

为了解决这个问题就需要找到当前占用 4000 端口的进程，然后将其杀死；步骤是：

```shell
# 先查下占用 4000 端口的进程 id
xuqianlong$ lsof -i tcp:4000
COMMAND   PID       USER   FD   TYPE            DEVICE SIZE/OFF NODE NAME
ruby    49753 xuqianlong   10u  IPv4 0xebc4350e453a6ff      0t0  TCP localhost:terabase (LISTEN)
# 然后杀死该进程
xuqianlong$ kill 49753
```

## curl

功能强大的网络工具，支持的协议众多，包括：`DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET, TFTP`。最简单的是 GET 请求：

```shell
curl http://debugly.cn/dist/json/test.json
```

使用 HEADER 请求，仅返回 http 头部信息：

```shell
curl -I http://debugly.cn/dist/json/test.json

HTTP/1.1 200 OK
Server: GitHub.com
Content-Type: application/json; charset=utf-8
Last-Modified: Thu, 03 Aug 2017 15:36:20 GMT
Access-Control-Allow-Origin: *
Expires: Sat, 05 Aug 2017 08:58:43 GMT
Cache-Control: max-age=600
X-GitHub-Request-Id: C99E:118EE:5EABC0:656C5C:5985866B
Content-Length: 6257
Accept-Ranges: bytes
Date: Sat, 05 Aug 2017 08:51:00 GMT
Via: 1.1 varnish
Age: 136
Connection: keep-alive
X-Served-By: cache-nrt6126-NRT
X-Cache: HIT
X-Cache-Hits: 1
X-Timer: S1501923060.014934,VS0,VE1
Vary: Accept-Encoding
X-Fastly-Request-ID: 0dc32470ef01fa9b0672d3d38edc904b9836debc
```
这个文档有详细的介绍：[https://curl.haxx.se/download.html](https://curl.haxx.se/download.html)

# chown

更新软件包的时候可能没有权限，需要修改权限，可使用 chown 给用户添加 ownership 权限；

`sudo chown -R $(whoami) /usr/local`

```shell
qianlongxu:myblog qianlongxu$ brew update
Error: /usr/local is not writable. You should change the ownership
and permissions of /usr/local back to your user account:
	sudo chown -R $(whoami) /usr/local
```