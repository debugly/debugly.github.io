---
layout: post
title: "Unix 定时任务"
date: 2017-09-05 13:10:32 +0800
comments: true
tags: Script
keywords: Linux Unix 定时任务
---

截止目前，SDK的打包，已经代码审查都是通过脚本完成的，利用脚本可以轻松的帮我们搞定那些重复的枯燥工作，可以节省宝贵的时间又能避免修改配置环境引发的错误。虽然有了这些这些脚本了，不过还是得人工去执行，不够省心啊，作为一个追求极致又很懒的人，是不能忍的，于是就搞了个定时任务，每天下班后我们只需要提交下代码，到规定的时间后，打包机器（不关机）就自动去执行打包脚本，为我们打包，代码审查！

# 简介

在 Linux、Unix、MacOS(类Unix)系统下，crontab 命令可以用来设置周期性执行的任务。系统为每个用户分配一个 “table” 存储这些任务，这些任务通常称为 “cron job”。这些任务是在 cron 守护进程里执行的，因此执行时的环境跟用户登录的环境是不一样的，这也导致了很多新手都会遇到一个问题：直接执行脚本没一点问题，加入到 crontab 之后，就不能正常执行。

# crontab 使用

1、查看当前用户下的定时任务

```
crontab -l
///没有定时任务
crontab: no crontab for qianlongxu
///有定时任务
# 每分钟打印一次当前时间
1 * * * * /Users/qianlongxu/Desktop/logdate.sh
```

2、删除当前用户设定的全部任务

```
crontab -r
```

3、添加定时任务

- 先准备一个任务脚本 ‘logdate.sh’，最终由 cron 守护进程执行，内容如下：

	```
	# 打印当前日期到文件
	echo $(date) >> /Users/qianlongxu/Desktop/log.txt
	```

- 任务写好了，然后添加到 crontab 中，实现周期性的执行有两种方法：
	
   - 直接编辑

		```
		crontab -e
		```

		此时应该会打开 vim 编辑器，直接在里面写任务配置就好了；比如每分钟都执行可以这么写：
		
		```
		# 每分钟打印一次当前时间
		* * * * * /Users/qianlongxu/Desktop/logdate.sh
		```
		
	- 编写一个名为 `job.cron` 的shell脚本作为 crontab 的输入，内容如下：
	
		```
		# 每分钟打印一次当前时间
		* * * * * /Users/qianlongxu/Desktop/logdate.sh
		```
 		然后执行：
 		
		```
		crontab /Users/qianlongxu/Desktop/job.cron
		```


  这两种方法都可以添加任务。

# 任务格式

编写任务是有格式的，一共6列，前五列是设定周期的，最后一列是要执行的命令或者脚本:

```
分　时　日　月　周　命令/脚本
* * * * * cmd
```

- 第1列表示分钟1～59 每分钟用*或者 */1表示 
- 第2列表示小时1～23（0表示0点） 
- 第3列表示日期1～31 
- 第4列表示月份1～12 
- 第5列标识号星期0～6（0表示星期天） 
- 第6列要运行的命令 

# 任务不执行

添加了任务后可能没有按照预期的周期去执行，可能是以下原因:

1. 任务脚本没有执行权限，给他一个可执行的权限： `sudo chmod 755 /Users/qianlongxu/Desktop/logdate.sh`
2. 添加任务是时间设置的有问题，我曾经想当然的把每小时的第一分钟执行理解为了每分钟都执行，我找了半个小时也没找到问题！
3. 网上有人说到 cron 服务，这个在 Mac下比较特殊，不像 Linux，cron 服务我们貌似干预不了，是 launchctl 控制的，比如:
	
	```
	///在 launchctl 里找下 cron 服务
	sudo launchctl list | grep cron
	Password:
	225	0	com.vix.cron
   /// 尝试停止 cron 服务，结果失败了
	sudo /usr/sbin/cron stop
	Password:
	cron: cron already running, pid: 225
	```
	
	你就没法停止这个服务，执行 restart 也是一样的，服务也不会重新开始；

4. 任务脚本里的路径不对，由于任务开始执行的进程没有加载环境变量，所以在脚本里使用的命名需要带上路径，使用的目录也需要是绝对路径。
5. 中文乱码，这个也是环境问题，可以在脚本的最上面声明下语言：`export LANG="zh_CN.UTF-8"`