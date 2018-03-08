---
layout: post
title: "macOS 上安装 Jekyll"
date: 2017-06-21 21:31:49 +0800
comments: true
tags: [Script,macOS]
keywords: install jekyll on mac os X
---

> 我的 MBP 重装回 macOS Sierra 之后，博客系统也就需要重新搭建了，因此趁这个机会，顺便整理下在 macOS 上安装 Jekyll 的详细过程。

# 检查 Ruby 版本

因为 Jekyll 是使用 Rake 编写的，所以最 Ruby 版本是有要求的，最新 3.5 则需要 Ruby 2.1.0 以上版本才行！

`ruby -v`

```shell
///我刚升级的2.2.6
ruby 2.2.6p396 (2016-11-15 revision 56800) [x86_64-darwin16]
```

如果你的版本是 2.1.0 之前的，可参看我的这篇博客《[使用 RVM 更新 Ruby 版本](/script/2017/06/20/update-ruby-use-rvm.html)》，先升级下 Ruby，再来往下看。

# 检查 Command Line Tools

可以说要想在 Mac 使用终端，搞开发相关的东西，不装 Command Line Tools 是不可能的，使用命令 `xcode-select -p` 检查：

```shell
/Applications/Xcode.app/Contents/Developer
或者
/Library/Developer/CommandLineTools
```

如果看到这两个其中一个就表示已经安装了，无需再装；如果不安装 `Command Line Tools`，就直接装 Jekyll 的话，会报如下错误：

```shell
gem install jekyll bundler
Password:
Fetching: public_suffix-2.0.5.gem (100%)
Successfully installed public_suffix-2.0.5
Fetching: addressable-2.5.1.gem (100%)
Successfully installed addressable-2.5.1
Fetching: colorator-1.1.0.gem (100%)
Successfully installed colorator-1.1.0
Fetching: sass-3.4.24.gem (100%)
Successfully installed sass-3.4.24
Fetching: jekyll-sass-converter-1.5.0.gem (100%)
Successfully installed jekyll-sass-converter-1.5.0
Fetching: rb-fsevent-0.9.8.gem (100%)
Successfully installed rb-fsevent-0.9.8
Fetching: ffi-1.9.18.gem (100%)
Building native extensions.  This could take a while...
ERROR:  Error installing jekyll:
	ERROR: Failed to build gem native extension.

    /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/bin/ruby extconf.rb
mkmf.rb can't find header files for ruby at /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/include/ruby.h


Gem files will remain installed in /Library/Ruby/Gems/2.0.0/gems/ffi-1.9.18 for inspection.
Results logged to /Library/Ruby/Gems/2.0.0/gems/ffi-1.9.18/ext/ffi_c/gem_make.out
Fetching: bundler-1.15.1.gem (100%)
Successfully installed bundler-1.15.1
Parsing documentation for bundler-1.15.1
Installing ri documentation for bundler-1.15.1
1 gem installed
```

在 OS X 10.9 之后有两种方法可选，一种是安装 Xcode，一种是单独安装 Command Line Tools，这个玩意之前是捆绑在 Xcode 里的！由于我日后需要使用 Xcode 开发，因此我选择安装 Xcode，让我纳闷的是，我移动硬盘里有 Xcode 7.3.1 的安装文件，直接安装后，仍旧报错：

```shell
Building native extensions.  This could take a while...
ERROR:  Error installing jekyll:
	ERROR: Failed to build gem native extension.

    /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/bin/ruby extconf.rb
checking for ffi.h... *** extconf.rb failed ***
Could not create Makefile due to some reason, probably lack of necessary
libraries and/or headers.  Check the mkmf.log file for more details.  You may
need configuration options.

Provided configuration options:
	--with-opt-dir
	--without-opt-dir
	--with-opt-include
	--without-opt-include=${opt-dir}/include
	--with-opt-lib
	--without-opt-lib=${opt-dir}/lib
	--with-make-prog
	--without-make-prog
	--srcdir=.
	--curdir
	--ruby=/System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/bin/ruby
	--with-ffi_c-dir
	--without-ffi_c-dir
	--with-ffi_c-include
	--without-ffi_c-include=${ffi_c-dir}/include
	--with-ffi_c-lib
	--without-ffi_c-lib=${ffi_c-dir}/
	--with-libffi-config
	--without-libffi-config
	--with-pkg-config
	--without-pkg-config
/System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:434:in `try_do': The compiler failed to generate an executable file. (RuntimeError)
You have to install development tools first.
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:549:in `block in try_compile'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:502:in `with_werror'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:549:in `try_compile'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:1038:in `block in have_header'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:889:in `block in checking_for'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:340:in `block (2 levels) in postpone'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:310:in `open'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:340:in `block in postpone'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:310:in `open'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:336:in `postpone'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:888:in `checking_for'
	from /System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/2.0.0/mkmf.rb:1037:in `have_header'
	from extconf.rb:16:in `<main>'


Gem files will remain installed in /Library/Ruby/Gems/2.0.0/gems/ffi-1.9.18 for inspection.
Results logged to /Library/Ruby/Gems/2.0.0/gems/ffi-1.9.18/ext/ffi_c/gem_make.out
Successfully installed bundler-1.15.1
Parsing documentation for bundler-1.15.1
1 gem installed

```

不过这次报错，可以明确找到原因：**(RuntimeError) You have to install development tools first.** 所以接下来老老实实地去安装 Command Line Tools 吧！

# 安装 Command Line Tools

在终端执行 `xcode-select --install` 后会弹出界面：

![](/images/201706/Snip20170620_2.png)

我选择了获取 Xcode，然后就自动打开了 AppStore ，然后点击下载安装就行了，只不过需要等上二十分钟了就 OK 了，Xcode安装成功后，记得启动下，因为启动后还会加载一些东西，确保万无一失，最好启动下，然后到 `Xcdoe -> Perferences -> Locations` 查看下 ...


我查了下网上也有人遇到过类似的错误：

- [https://stackoverflow.com/questions/27768420/gem-installation-error-you-have-to-install-development-tools-first](https://stackoverflow.com/questions/27768420/gem-installation-error-you-have-to-install-development-tools-first)

- [https://github.com/ffi/ffi/issues/286](https://github.com/ffi/ffi/issues/286)

- [https://kevinpotgieter.wordpress.com/2012/12/06/ruby-gem-install-mkmf-rb-cant-find-header-files-for-ruby-problem/](https://kevinpotgieter.wordpress.com/2012/12/06/ruby-gem-install-mkmf-rb-cant-find-header-files-for-ruby-problem/)

## 安装 Jekyll

如果你的 Ruby 版本小于 2.1.0 的话，就会报如下错误了：

```shell
bogon:~ xuqianlong$ sudo gem install jekyll bundler
Password:
Building native extensions.  This could take a while...
Successfully installed ffi-1.9.18
Fetching: rb-inotify-0.9.10.gem (100%)
Successfully installed rb-inotify-0.9.10
Fetching: listen-3.0.8.gem (100%)
Successfully installed listen-3.0.8
Fetching: jekyll-watch-1.5.0.gem (100%)
Successfully installed jekyll-watch-1.5.0
Fetching: kramdown-1.13.2.gem (100%)
Successfully installed kramdown-1.13.2
Fetching: liquid-4.0.0.gem (100%)
ERROR:  Error installing jekyll:
	liquid requires Ruby version >= 2.1.0.
Successfully installed bundler-1.15.1
Parsing documentation for bundler-1.15.1
1 gem installed
```

如果是按照上述步骤来的，那么你应该能够正常的安装：

```
Last login: Tue Jun 20 22:21:06 on ttys000
bogon:~ xuqianlong$ gem install jekyll bundler
Fetching: public_suffix-2.0.5.gem (100%)
Successfully installed public_suffix-2.0.5
Fetching: addressable-2.5.1.gem (100%)
Successfully installed addressable-2.5.1
Fetching: colorator-1.1.0.gem (100%)
Successfully installed colorator-1.1.0
Fetching: sass-3.4.24.gem (100%)
Successfully installed sass-3.4.24
Fetching: jekyll-sass-converter-1.5.0.gem (100%)
Successfully installed jekyll-sass-converter-1.5.0
Fetching: rb-fsevent-0.9.8.gem (100%)
Successfully installed rb-fsevent-0.9.8
Fetching: ffi-1.9.18.gem (100%)
Building native extensions.  This could take a while...
Successfully installed ffi-1.9.18
Fetching: rb-inotify-0.9.10.gem (100%)
Successfully installed rb-inotify-0.9.10
Fetching: listen-3.0.8.gem (100%)
Successfully installed listen-3.0.8
Fetching: jekyll-watch-1.5.0.gem (100%)
Successfully installed jekyll-watch-1.5.0
Fetching: kramdown-1.13.2.gem (100%)
Successfully installed kramdown-1.13.2
Fetching: liquid-4.0.0.gem (100%)
Successfully installed liquid-4.0.0
Fetching: mercenary-0.3.6.gem (100%)
Successfully installed mercenary-0.3.6
Fetching: forwardable-extended-2.6.0.gem (100%)
Successfully installed forwardable-extended-2.6.0
Fetching: pathutil-0.14.0.gem (100%)
Successfully installed pathutil-0.14.0
Fetching: rouge-1.11.1.gem (100%)
Successfully installed rouge-1.11.1
Fetching: safe_yaml-1.0.4.gem (100%)
Successfully installed safe_yaml-1.0.4
Fetching: jekyll-3.5.0.gem (100%)
Successfully installed jekyll-3.5.0
Parsing documentation for public_suffix-2.0.5
Installing ri documentation for public_suffix-2.0.5
Parsing documentation for addressable-2.5.1
Installing ri documentation for addressable-2.5.1
Parsing documentation for colorator-1.1.0
Installing ri documentation for colorator-1.1.0
Parsing documentation for sass-3.4.24
Installing ri documentation for sass-3.4.24
Parsing documentation for jekyll-sass-converter-1.5.0
Installing ri documentation for jekyll-sass-converter-1.5.0
Parsing documentation for rb-fsevent-0.9.8
Installing ri documentation for rb-fsevent-0.9.8
Parsing documentation for ffi-1.9.18
Installing ri documentation for ffi-1.9.18
Parsing documentation for rb-inotify-0.9.10
Installing ri documentation for rb-inotify-0.9.10
Parsing documentation for listen-3.0.8
Installing ri documentation for listen-3.0.8
Parsing documentation for jekyll-watch-1.5.0
Installing ri documentation for jekyll-watch-1.5.0
Parsing documentation for kramdown-1.13.2
Installing ri documentation for kramdown-1.13.2
Parsing documentation for liquid-4.0.0
Installing ri documentation for liquid-4.0.0
Parsing documentation for mercenary-0.3.6
Installing ri documentation for mercenary-0.3.6
Parsing documentation for forwardable-extended-2.6.0
Installing ri documentation for forwardable-extended-2.6.0
Parsing documentation for pathutil-0.14.0
Installing ri documentation for pathutil-0.14.0
Parsing documentation for rouge-1.11.1
Installing ri documentation for rouge-1.11.1
Parsing documentation for safe_yaml-1.0.4
Installing ri documentation for safe_yaml-1.0.4
Parsing documentation for jekyll-3.5.0
Installing ri documentation for jekyll-3.5.0
Done installing documentation for public_suffix, addressable, colorator, sass, jekyll-sass-converter, rb-fsevent, ffi, rb-inotify, listen, jekyll-watch, kramdown, liquid, mercenary, forwardable-extended, pathutil, rouge, safe_yaml, jekyll after 30 seconds
Fetching: bundler-1.15.1.gem (100%)
Successfully installed bundler-1.15.1
Parsing documentation for bundler-1.15.1
Installing ri documentation for bundler-1.15.1
Done installing documentation for bundler after 5 seconds
19 gems installed
```

## 检查 Jekyll 是否安装成功

`jekyll -v`

终端会输出版本号：jekyll 3.5.0，接下来就可以创建自己的博客站点了！

```shell
jekyll new my-awesome-site
~ $ cd my-awesome-site
~/my-awesome-site $ bundle exec jekyll serve
```

这些操作我开了 VPN，如果不开的话，可能会出现不能安装某些gem的问题，这个需要换下 RubyGems 源，具体可查看淘宝的源 [https://ruby.taobao.org/](https://ruby.taobao.org/)

## Good Luck ...
