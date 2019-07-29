---
layout: post
title: "Shell 编程经验总结"
date: 2017-05-26 21:03:36 +0800
comments: true
tags: Script
keywords: shell,Linux shell
---

> 日常工作中，特别是我搭建远程打包环境的过程中用到了不少 Shell 命令，这里记录下，省得以后再去查询，浪费时间。

# 内置变量

以下结果来自 Mac OS 10.12，提示：这些内置变量是以美元符号开头的哈，内置变量也是变量，在 Shell 脚本里面取变量的值需要以美元符号开头。

- $SHELL : 查看当前终端使用是哪种 shell: `/bin/bash`
- $HOME : 登陆用户主目录: `/Users/xuqianlong`
- $PATH : 截取一小段来看下: `/opt/local/bin:/opt/local/sbin`，分号是分隔符；在终端输入命令就能执行的原理其实是，按照顺序遍历 PATH 路径，直到找到该命令，如果找不到就输出：`-bash: ee: command not found` (这里的 -bash 是当前 shell 类型) 学习过 Java 的同学肯定都知道 Path 的概念。
- $USER : 当前登陆用户名称: `xuqianlong`
- $OSTYPE : 操作系统类型: `darwin16`
- $MACHTYPE : CPU架构及系统类型: `x86_64-apple-darwin16`
- $LANG : 语言类型: `zh_CN.UTF-8`

# 命令

- env 查看所有的环境变量，这个命令太厉害了，上面提到的好多内置变量的值都包括了：

	```bash
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

	```bash
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
- chsh -s /bin/zsh ，修改用户 shell，重启终端生效

# ps

用 ps 命令可以查看进程相关信息，哪些进程正在运行和运行状态、进程是否结束、进程有没有僵死、哪些进程占用了过多地资源等等。

```bash
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

# 重定向

使用重定向，可以轻松的提供输入，改变输出；

- 输出重定向：

	- ">" 覆盖文本

	```bash
	echo "abc" > "aa.txt"
	echo "abc" > "aa.txt"
	echo "abc" > "aa.txt"
	//查看 aa.txt 文件，内容是：
	abc
	```

	-  ">>" 追加文本

	```bash
	echo "abc" >> "aa.txt"
	echo "abc" >> "aa.txt"
	echo "abc" >> "aa.txt"
	//查看 aa.txt 文件，内容是：
	abc
	abc
	abc
	```

- 输入重定向：

	```bash
	///读取 aa.txt 文件的第一行，然后打印
	read line < aa.txt;echo $line
	///结果是：
	abc
	```

# 管道

这是一个强大的 shell 命令，可将输出结果作为另一个程序的输入，符号 : "\|" ，比如查看当前目录，并且按字母顺序排列：

```bash
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

# cp

- 复制文件，如果目标存在则会覆盖; 将 debugly 目录下的 init.sh 文件拷贝到 d2 目录下，debugly、d2 都在当前执行目录下; d2 文件夹必须存在！否则 cp 之后会生成一个 d2 的可执行文件！其内容是 init.sh 文件的内容。

```bash
cp debugly/init.sh d2
```

复制文件夹，如果目标存在则会覆盖; 将 debugly 目录下的所有文件都拷贝到 d2 目录下；d2 文件夹必须存在！否则 cp 执行失败。

```bash
cp -r debugly/init.sh d2
```

**注：**cp 命令不会复制 .开头的文件或者文件夹，除了 "." 和 ".." 和 ".DS_Store" 这三个之外！一般情况下这是我们想要的结果。

# scp

- 本机复制到远程服务器

	- **文件**
	
	```bash
	scp /Users/qianlongxu/Downloads/id_rsa.pub crown@10.7.40.176:~/id_rsa.pub  
	```
	- **文件夹**
	
	```bash
	//在远程服务器game下创建qr-code，copy qr-code 下的所有文件
	scp -r /Users/Shared/Jenkins/Home/xql/qr-code root@10.10.194.16:/opt/www/html/game
	```
- 从远程服务器下载到本地

	```bash
	scp jenkins@10.7.40.195:/Users/Shared/Jenkins/Home/workspace/hall-ios/builds/20180317/game56hall-inhouse.ipa ~/Desktop/
	game56hall-inhouse.ipa 
	
	scp jenkins@10.7.40.195:/Users/Shared/Jenkins/Home/workspace/hall-android/build/jsb-default/frameworks/runtime-src/proj.android-studio/app/build/outputs/apk/release/app-release.apk ~/Desktop/
	app-release.apk   
	```
	下载文件夹加上 -r 即可；可以看出 scp 的第一个参数其实就是源文件，第二个参数是目的地，这样比较好记些。

**注:**

- 使用 scp 复制文件时，如果目标文件已经存在，则会覆盖！
- 目标地址是一个文件夹时，复制文件的话，文件名保持不变。
- 目标地址是一个文件时，复制文件的话，则会重命名文件。

# ssh

- 登陆远程服务器:

	```bash
	ssh crown@10.7.40.176
	///输入密码
	sohuxxx
	```
- 免密码登录

	可以把客户机的公钥填充到远程打包机器上的authorized_keys文件中，实现自动验证，无需泄露服务器密码

	```bash
	///将公钥追加到这个服务器~/.ssh/authorized_keys文件末尾 
	ssh-copy-id -i jenkins@10.7.40.195
	///输入密码
	sohuxxx
	```
- 执行命令

	删除掉远程服务器桌面上的 xx 目录：

	```bash
	Remote_dir='~/Desktop/xx'
	ssh root@12.11.193.18 "rm -rf ${Remote_dir}"
	```

# kill jekyll server

我修改 Rakefile 的时候，修改不当导致没能处理INT，后果就是我们按下 `ctrl + c` 的时候没有将该子线程杀死，然后再次启动服务时就会报错:

```bash
jekyll 3.3.0 | Error:  Address already in use - bind(2) for 127.0.0.1:4000
```

为了解决这个问题就需要找到当前占用 4000 端口的进程，然后将其杀死；步骤是：

```bash
# 先查下占用 4000 端口的进程 id
xuqianlong$ lsof -i tcp:4000
COMMAND   PID       USER   FD   TYPE            DEVICE SIZE/OFF NODE NAME
ruby    49753 xuqianlong   10u  IPv4 0xebc4350e453a6ff      0t0  TCP localhost:terabase (LISTEN)
# 然后杀死该进程
xuqianlong$ kill 49753
```

# curl

功能强大的网络工具，支持的协议众多，包括：`DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET, TFTP`。最简单的是 GET 请求：

```bash
curl http://debugly.cn/dist/json/test.json
```

使用 HEADER 请求，仅返回 http 头部信息：

```bash
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

- 下载文件

在当前目录下递归创建 themes/hexo-theme-yaris 目录，然后下载zip包，解压到指定文件夹后重命名

```bash
mkdir -p "./themes/hexo-theme-yaris" && curl -L https://codeload.github.com/debugly/hexo-theme-yaris/zip/master | tar xj -C "./themes/hexo-theme-yaris" --strip-components 1
```

# chown

更新软件包的时候可能没有权限，需要修改权限，可使用 chown 给用户添加 ownership 权限；

`sudo chown -R $(whoami) /usr/local`

```bash
qianlongxu:myblog qianlongxu$ brew update
Error: /usr/local is not writable. You should change the ownership
and permissions of /usr/local back to your user account:
	sudo chown -R $(whoami) /usr/local
```

# git

- git log
	
	```bash
	qianlongxu$ git log -3
	commit 8e8c188d3fc8c3b8937e213d3ae7bd45cdc55c69 (HEAD -> source, origin/source)
	Author: qianlongxu <qianlongxu@sohu-inc.com>
	Date:   Sat Mar 24 09:49:51 2018 +0800
	
	    add post
	
	commit eb3e9419a4a6cc736808ac40b7cf2908b7998c56
	Merge: e851655 6755480
	Author: qianlongxu <qianlongxu@sohu-inc.com>
	Date:   Sat Mar 24 09:49:08 2018 +0800
	
	    Merge branch 'source' of https://github.com/debugly/debugly.github.io into source
	
	commit 67554800909e91430231da8c34887933a4160649
	Author: qianlongxu <qianglongxu@home.mbp>
	Date:   Thu Mar 22 22:17:08 2018 +0800
	
	    add tag
	```

- git log --date=format

	```bash
	qianlongxu$ git log --date=format:'%Y-%m-%d %H:%M:%S' -3
	commit 8e8c188d3fc8c3b8937e213d3ae7bd45cdc55c69 (HEAD -> source, origin/source)
	Author: qianlongxu <qianlongxu@sohu-inc.com>
	Date:   2018-03-24 09:49:51
	
	    add post
	
	commit eb3e9419a4a6cc736808ac40b7cf2908b7998c56
	Merge: e851655 6755480
	Author: qianlongxu <qianlongxu@sohu-inc.com>
	Date:   2018-03-24 09:49:08
	
	    Merge branch 'source' of https://github.com/debugly/debugly.github.io into source
	
	commit 67554800909e91430231da8c34887933a4160649
	Author: qianlongxu <qianglongxu@home.mbp>
	Date:   2018-03-22 22:17:08
	
	    add tag
	```

- git log --date=format

	```bash
	qianlongxu$ git log --date=format:'%a|%A|%b|%B|%c|%d|%H|%I|%j|%m|%M|%p|%S|%U|%w|%W|%x|%X|%y|%Y|%z' --pretty=format:'%cd' -3
	Sat|Saturday|Mar|March|Sat Mar 24 09:49:51 2018|24|09|09|083|03|49|AM|51|11|6|12|03/24/18|09:49:51|18|2018|+0800
	Sat|Saturday|Mar|March|Sat Mar 24 09:49:08 2018|24|09|09|083|03|49|AM|08|11|6|12|03/24/18|09:49:08|18|2018|+0800
	Thu|Thursday|Mar|March|Thu Mar 22 22:17:08 2018|22|22|10|081|03|17|PM|08|11|4|12|03/22/18|22:17:08|18|2018|+0800
	```
- git log --after

	```bash
  qianlongxu$ git log --date=format:'%Y-%m-%d %H:%M:%S' --after='2018-03-23 20:44:06'
	commit 8e8c188d3fc8c3b8937e213d3ae7bd45cdc55c69 (HEAD -> source, origin/source)
	Author: qianlongxu <qianlongxu@sohu-inc.com>
	Date:   2018-03-24 09:49:51
	
	    add post
	
	commit eb3e9419a4a6cc736808ac40b7cf2908b7998c56
	Merge: e851655 6755480
	Author: qianlongxu <qianlongxu@sohu-inc.com>
	Date:   2018-03-24 09:49:08
	
	    Merge branch 'source' of https://github.com/debugly/debugly.github.io into source
	```

- 获取最后一次提交时间秒数，然后加1

	```bash
	last_commit_sec=$(git log --date=format:'%S' --pretty=format:'%cd' -1)
	last_commit_sec=`expr $last_commit_sec + 1`
	```
- 查看此次拉取远程之后，都有哪些提交记录

	```bash
	last_commit_datestamp=$(git log --date=raw --pretty=format:'%cd' -1)
	last_commit_date=${last_commit_datestamp% *}
	last_commit_date=`expr $last_commit_date + 1`
	git pull
	git log --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'<tr><td>%an</td><td>%s</td><td>%cd</td></tr>'  --after "'$last_commit_date'" -n 200
	```

[Git-基础-查看提交历史](https://git-scm.com/book/zh/v1/Git-基础-查看提交历史)

- git修改user.name和user.email

	```bash
	///查看
	git config --list
	///修改
	git config --global user.name "name"
	git config --global user.email "email"
	```

- git clone

	```bash
	git clone -b $branch $repos $WORKSPACE
	git branch --set-upstream-to=origin/$branch $branch
	git submodule update --init --recursive
	```
- git -C $path
    
    当执行命令的目录和 git 仓库目录不是同一个的话，可以使用 **-C** 指定仓库目录
    
    ```bash
    localPath="../.hexo-theme-yaris"
    alias gitC='git -C $localPath'
    
    gitC add *
    gitC commit -m "your msg"
    gitC push origin master
    ```
# date

```bash
$(date +'Theme updated:%Y-%m-%d %H:%M:%S')
Theme updated:2018-04-16 17:52:24
```

# du

- 获取文件大小 : 
	`IPA_Size=$(du -sm $IPA_Path | awk '{print $1}')`

# 文件（夹）是否存在

- 文件是否存在

	```bash
	if [ -f $last_commit_date_txt ];then
		  last_commit_datestamp=$(cat $last_commit_date_txt)
			echo 'xql last_commit_datestamp:'$last_commit_datestamp
		  last_commit_date=${last_commit_datestamp% *}
			last_commit_date=`expr $last_commit_date + 1`
	fi
	```

- 文件夹是否存在

	```bash
	if [ -d $last_commit_folder ];then
	
	fi
	```

- 文件内容是否为空

	```bash
	if [ `cat $commit_info_txt |wc -m` -eq 0 ];then
		echo 'file is empty.'
	else
		echo 'file is not empty!'
	fi
	```

# iOS build 号自增

```bash
# info.plist路径
project_infoplist_path="/proj.ios_mac/ios/game-inhouse.plist"
#取版本号
appVersion=$(/usr/libexec/PlistBuddy -c "print CFBundleShortVersionString" "${project_infoplist_path}")
#取build号
#buildNO=$(/usr/libexec/PlistBuddy -c "print CFBundleVersion" "${project_infoplist_path}")
#加1
buildNO=$(($buildNO+1))
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "$project_infoplist_path"
```
# Shell 参数含有空格

```bash
ps="xxx zzz"
./build.sh "'$ps'"
```
# Shell 算术运算

```bash
///使用 expr 外部程式
a=12;
b=19;
result=`expr $a + $b`
```
# Shell 字符串截取

- % 截取，以空格举例：

	```bash
	str="1234444 +8000 +ddd"
	echo ${str% *}
	///1234444 +8000
	```
	从右往左截取，遇到第一个空格为止（空格也会截取）；
- \## 截取，以 / 为例：

	```bash
	str="/Users/qianlongxu/Documents/build_local.sh"
	echo ${str##*/}
	///build_local.sh
	```
	从左往右删除，直到删掉最后一个 / 为止；
- 参考:[https://www.cnblogs.com/zwgblog/p/6031256.html](https://www.cnblogs.com/zwgblog/p/6031256.html)

# Shell 函数返回值

```bash
function test(){
    echo "a";
    echo "b";
    echo "c";
    return 10;
}

r=$(test);
echo $?;
echo $r;
echo $?;
```
运行结果是:

```bash
10
a b c
0
```
把返回值改成非整数值，会报错:

```bash
test.sh: line 5: return: 10.1: numeric argument required
test.sh: line 5: return: a: numeric argument required
```

把返回值改成非[0~255]的整数值，会因为溢出，而舍弃高位，比如:

```bash
返回 256 ，实际接收到的是 0;
返回 257 ，实际接收到的是 1;
这个也很好理解，因为返回只暂用了一个字节，相当于 c 语言里的 unsigned char !
```

正因为这个返回值是个无符号整形，所以很多时候并不是我们想要的，因此这个返回值，都是用来告诉调用者内部是否正常执行的，如果执行出错了就返回一个非 0 值！

- 编程时是需要返回值的，怎么办？

一种方法是像上面的例子一样，使用 echo 打印，其缺点是可能你只需要最后一个 echo 的打印值，中间的调试日志并不是你想要的，我曾经也遇到了这个问题！本来程序执行的没问题，就在中间加了一个函数调用，结果那个函数里有 echo 日志，导致了一个问题。

如果遇到这种情况，建议不要使用 echo 作为返回值，echo 正常用来写日志，而是使用全局变量！调用者使用全局变量拿到这个值；或者就是封装一个打印日志的方法，将日志重定向到文件。

```bash
function test(){
    echo "a";
    echo "b";
    echo "c";
    DOWNLOAD_URL='return abc';
    return '2';
}

test;
echo $?;
echo $DOWNLOAD_URL;

结果:
qianlongxu:Desktop qianlongxu$ sh test.sh
a
b
c
2
return abc
```

这里有个有趣的问题，如果你还想获取echo打印的返回值，你会发现全局变量的值取不到!

```bash
r=$(test);
echo $?;
echo $r;
echo $DOWNLOAD_URL;

结果:
qianlongxu:Desktop qianlongxu$ sh test.sh
2
a b c


```

有兴趣可以看下这个链接: [https://stackoverflow.com/questions/23564995/how-to-modify-a-global-variable-within-a-function-in-bash](https://stackoverflow.com/questions/23564995/how-to-modify-a-global-variable-within-a-function-in-bash)


# zip 命令

## 不带目录压缩

举例： 将 ./a 目录下的文件压缩成 zip 包，解压后不包含 a 目录，如果 a 里面有文件夹则保持原有层级；（不要使用 mac 自动的解压工具，否则解压后都会放到 a 目录里！搜索后是否包含目录，可以到 windows 下查看。）

```bash
function mr_zip(){
    full_path=$1

    folder_name=${full_path##*/}
    zip_name="${folder_name}.zip"

    cp=$PWD    
    cd "$full_path"
    zip -rq ../"$zip_name" ./*
    mr_ckr $? $LINENO
    cd ..
    zip_Path="${PWD}/${zip_name}"
    cd $cp
    echo "${zip_Path}"
}

zip_file=$(mr_zip "${path}")
```

# sed 命令

```bash
///将 fn 文件里的 'VV' 替换成 ${version}
sed -i '' "s/VV/${version}/" "${fn}"

///将 zip_url 变量里的 / 替换成 \/ ; 管道处理后赋值给 escape_url ; 这里转义了，所以不容易理解;
escape_url=$(echo "${zip_url}" | sed "s/\//\\\\\//g")
escape_url=$(echo "${zip_url}" | sed 's/\//\\\//g')

把 sed 's/\//\\\//g' 展开看下：

sed 's/ \/ / \\\/ /g'; \/ 是 / 的转义， \\ 是 \ 的转义； /g 是全局替换；

//用 : 分割更加容易理解：
escape_url=$(echo "${zip_url}" | sed "s:/:\\\/:g")
escape_url=$(echo "${zip_url}" | sed 's:/:\\\/:g')

https://stackoverflow.com/questions/13971113/how-to-replace-on-path-string-with-using-sed
```

# AutoJump

```
# https://github.com/wting/autojump
brew install autojump
vim ~/.zhsrc 
# 追加 autojump
plugins=(autojump) 
# 最后一行添加
# autojump configure by xql;
[[ -s $(brew --prefix)/etc/profile.d/autojump.sh ]] && . $(brew --prefix)/etc/profile.d/autojump.sh
```

查看进入过的目录，进入过的就可以通过部分文件名跳转了: ~/Library/autojump/autojump.txt

# zsh-syntax-highlighting

命令高亮，默认绿色高亮：

```
# https://github.com/zsh-users/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
vim ~/.zhsrc
# 追加 
plugins=(zsh-syntax-highlighting)
source ~/.zshrc
```

# zsh-autosuggestions

命令提示，按键盘 → 补全

```
# https://github.com/zsh-users/zsh-autosuggestions
git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
vim ~/.zhsrc
# 追加
plugins=(zsh-autosuggestions)
source ~/.zshrc
```

# Node

- 查看版本

```bash
bogon:debugly xuqianlong$ node -v 
v8.9.3
bogon:debugly xuqianlong$ npm -v
5.5.1
```

NPM (node package manager) 是 Nodejs 的包管理器，用于 Node 插件管理（包括安装、卸载、管理依赖等）


- npm init  : 在当前目录下引导创建一个package.json文件，包括名称、版本、作者这些信息等
- npm start :启动模块
- npm ls : 查看安装的模块
- npm uninstall <name> [-g] [--save-dev]  :  卸载插件 
- npm update <name> [-g] [--save-dev]  : 更新插件
- npm update [--save-dev] : 更新全部插件
- npm help : 查看帮助
- npm list : 查看当前目录已安装插件


遇到过的问题:

    ```bash
    hexo d -g
    ERROR Deployer not found: git
    ///解决方法：
    npm install --save hexo-deployer-git
    ```
express 框架
    
    ```bash
    #http://www.expressjs.com.cn/starter/generator.html
    npm install express-generator -g
    express myapp
    ```

# Hexo

- 预览 : `hexo server`，简写 `hexo s`
- 生成 : `hexo generate`，简写 `hexo g`
- 发布 : `hexo deploy`，简写 `hexo d`
- 清理 : `hexo clean`

# Python

- 临时文件服务器
    
    ```bash
    cd test
    python -m SimpleHTTPServer
    Serving HTTP on 0.0.0.0 port 8000 ...
    ```
    
    也可以指定端口号：
    
    ```bash
    python -m SimpleHTTPServer 9090
    ```