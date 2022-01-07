---
layout: post
title: Mac 自定义服务
date: 2022-01-05 19:00:06
tags: macOS
---

所有的进程都是 launchd 进程的后代，PID 为 1。

<!--more-->

launchd 进程是如此的重要，系统专门搞了一个名为 launchctl 的命令行管理工具，用于管理 launchd 进程。

launchd 会加载这些目录下得配置文件：

```
~/Library/LaunchAgents         Per-user agents provided by the user.
/Library/LaunchAgents          Per-user agents provided by the adminis-
                            trator.
/Library/LaunchDaemons         System-wide daemons provided by the admin-
                            istrator.
/System/Library/LaunchAgents   Per-user agents provided by Mac OS X.
/System/Library/LaunchDaemons  System-wide daemons provided by Mac OS X.
```

## 子命令

launchctl 的子命令：

```
	bootstrap       Bootstraps a domain or a service into a domain.
	bootout         Tears down a domain or removes a service from a domain.
	enable          Enables an existing service.
	disable         Disables an existing service.
	kickstart       Forces an existing service to start.
	attach          Attach the system's debugger to a service.
	debug           Configures the next invocation of a service for debugging.
	kill            Sends a signal to the service instance.
	blame           Prints the reason a service is running.
	print           Prints a description of a domain or service.
	print-cache     Prints information about the service cache.
	print-disabled  Prints which services are disabled.
	plist           Prints a property list embedded in a binary (targets the Info.plist by default).
	procinfo        Prints port information about a process.
	hostinfo        Prints port information about the host.
	resolveport     Resolves a port name from a process to an endpoint in launchd.
	limit           Reads or modifies launchd's resource limits.
	runstats        Prints performance statistics for a service.
	examine         Runs the specified analysis tool against launchd in a non-reentrant manner.
	config          Modifies persistent configuration parameters for launchd domains.
	dumpstate       Dumps launchd state to stdout.
	dumpjpcategory  Dumps the jetsam properties category for all services.
	reboot          Initiates a system reboot of the specified type.
	bootshell       Brings the system up from single-user mode with a console shell.
	load            Recommended alternatives: bootstrap | enable. Bootstraps a service or directory of services.
	unload          Recommended alternatives: bootout | disable. Unloads a service or directory of services.
	remove          Unloads the specified service name.
	list            Lists information about services.
	start           Starts the specified service.
	stop            Stops the specified service if it is running.
	setenv          Sets the specified environment variables for all services within the domain.
	unsetenv        Unsets the specified environment variables for all services within the domain.
	getenv          Gets the value of an environment variable from within launchd.
	bsexec          Execute a program in another process' bootstrap context.
	asuser          Execute a program in the bootstrap context of a given user.
	submit          Submit a basic job from the command line.
	managerpid      Prints the PID of the launchd controlling the session.
	manageruid      Prints the UID of the current launchd session.
	managername     Prints the name of the current launchd session.
	error           Prints a description of an error.
	variant         Prints the launchd variant.
	version         Prints the launchd version.
	help            Prints the usage for a given subcommand.
```

## 常规使用

1、启动服务
launchctl bootstrap gui/501 /Users/matt/Library/LaunchAgents/cn.debugly.hello.plist

2、停止服务

launchctl bootout gui/501 /Users/matt/Library/LaunchAgents/cn.debugly.hello.plist

网上很多文章写的是 load -w 和 unload ，没有 boot 这俩好用。

3、查看运行状态

```
launchctl list | grep debugly.hexo.preview
99518	0	debugly.hexo.preview
```
中间的 0 表示没有错误，非 0 是表示一个错误码。

4、查看服务配置

```
launchctl list debugly.hexo.preview       
{
	"StandardOutPath" = "/Users/matt/service/log/hexo_preview.log";
	"LimitLoadToSessionType" = "Aqua";
	"StandardErrorPath" = "/Users/matt/service/log/hexo_preview_err.log";
	"Label" = "debugly.hexo.preview";
	"OnDemand" = false;
	"LastExitStatus" = 0;
	"PID" = 99518;
	"Program" = "/usr/local/bin/hexo";
	"ProgramArguments" = (
		"/usr/local/bin/hexo";
		"--cwd";
		"/Users/matt/service/Preview-Markdown";
		"server";
		"-p";
		"4001";
	);
};
```

## plist 样例

每 10 秒打印一次 Hello 到 /Users/matt/service/log/hello.log 日志文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>StandardOutPath</key>
	<string>/Users/matt/service/log/hello.log</string>
	<key>Label</key>
	<string>cn.debugly.hello</string>
	<key>ProgramArguments</key>
	<array>
		<string>echo</string>
		<string>Hello</string>
	</array>
	<key>StartInterval</key>
	<integer>10</integer>
</dict>
</plist>
```

下面这个是在使用 Homebrew service 运行 nginx 时生成的 service plist 文件，RunAtLoad 表示用户登录系统后会自动启动：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>homebrew.mxcl.nginx</string>
	<key>ProgramArguments</key>
	<array>
		<string>/opt/homebrew/opt/nginx/bin/nginx</string>
		<string>-g</string>
		<string>daemon off;</string>
	</array>
	<key>RunAtLoad</key>
	<true/>
	<key>WorkingDirectory</key>
	<string>/opt/homebrew</string>
</dict>
</plist>
```

我写的开机后自动启动 markdown 预览服务：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>debugly.hexo.preview</string>
	<key>EnvironmentVariables</key>
	<dict>
		<key>PATH</key>
		<string>/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/Apple/usr/bin:/Users/matt/bin</string>
	</dict>
	<key>ProgramArguments</key>
	<array>
		<string>/usr/local/bin/hexo</string>
		<string>--cwd</string>
		<string>/Users/matt/service/Preview-Markdown</string>
		<string>server</string>
		<string>-p</string>
		<string>4001</string>
	</array>
	<key>RunAtLoad</key>
	<true/>
	<key>KeepAlive</key>
	<true/>
	<key>StandardOutPath</key>
	<string>/Users/matt/service/log/hexo_preview.log</string>
	<key>StandardErrorPath</key>
	<string>/Users/matt/service/log/hexo_preview_err.log</string>
</dict>
</plist>
```

需要注意的是 service 启动运行后环境和当前登录用户不一样！这是一个大坑，我查看了下环境变量如下：

```bash
XPC_SERVICE_NAME=debugly.hexo.preview
SSH_AUTH_SOCK=/private/tmp/com.apple.launchd.FVbZDd4wYW/Listeners
PATH=/usr/bin:/bin:/usr/sbin:/sbin
XPC_FLAGS=0x0
LOGNAME=matt
USER=matt
HOME=/Users/matt
SHELL=/bin/zsh
TMPDIR=/var/folders/0l/7874267j5cdb5btqr9_md6d40000gn/T/
```

如果不配置 PATH 运行 hexo 的时候则会报错找不到 node ，这是因为 node 是安装在 /usr/local/bin 目录下的，从默认 PATH 里找不到！

```
env: node: No such file or directory
```

不要访问沙河路径，否则报错：

```
FATAL [Error: EPERM: operation not permitted, open '/Users/matt/Documents/service/Preview-Markdown/package.json'] {
  errno: -1,
  code: 'EPERM',
  syscall: 'open',
  path: '/Users/matt/Documents/service/Preview-Markdown/package.json'
}
```

## 注意事项

1、不要使用 ~ 代替当前用户目录
2、程序路径即使在 PATH 搜索路径内，也要写完整路径，比如 hexo 不使用完整路径启动会返回 78 这个鬼知道的错误码
3、不要访问沙河路径，就是个人目录下的 Documents,Downloads,Movies 等

很有用的一个软件 [LaunchControl](https://www.soma-zone.com/LaunchControl/) ，是一个 service 管理工具，可以很直观的查看服务状态，出错信息等，付费版功能更加强劲。

## 参考

[Daemons and Services](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/Introduction.html#//apple_ref/doc/uid/10000172i-SW1-SW1)
[Local User LaunchAgent via SSH: Operation not permitted](https://itectec.com/askdifferent/local-user-launchagent-via-ssh-operation-not-permitted/)
[enable log](https://serverfault.com/questions/183589/how-do-i-activate-launchd-logging-on-os-x)
[LAUNCHCTL 2.0 SYNTAX](https://babodee.wordpress.com/2016/04/09/launchctl-2-0-syntax/)
[]()
