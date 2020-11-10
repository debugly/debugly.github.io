---
layout: post
title: "使用 RVM 更新 Ruby 版本"
date: 2017-06-20 22:31:19 +0800
comments: true
tags: Script
keywords: RVM,update ruby,mac os
---

> 我的 MBP 重装回 macOS Sierra 之后，系统自带的 Ruby 环境为 ruby 2.0.0p648 (2015-12-16 revision 53162)，我要安装 Jekyll，其中一个 gem 对 Ruby 版本有要求，必须是 2.1.0 以后版本才行！（liquid requires Ruby version >= 2.1.0.）我选择了 RVM 管理 Ruby 版本。

## 安装 RVM

简单理解下：RVM 管理 Ruby 版本的工具，具体 Ruby 版本通过 homebrew 去下载获取。接下来安装 RVM：

`curl -sSL https://get.rvm.io | bash -s stable`

安装过程：

```shell
Downloading https://github.com/rvm/rvm/archive/1.29.1.tar.gz
Downloading https://github.com/rvm/rvm/releases/download/1.29.1/1.29.1.tar.gz.asc
Found PGP signature at: 'https://github.com/rvm/rvm/releases/download/1.29.1/1.29.1.tar.gz.asc',
but no GPG software exists to validate it, skipping.

Installing RVM to /Users/xuqianlong/.rvm/
    Adding rvm PATH line to /Users/xuqianlong/.profile /Users/xuqianlong/.mkshrc /Users/xuqianlong/.bashrc /Users/xuqianlong/.zshrc.
    Adding rvm loading line to /Users/xuqianlong/.profile /Users/xuqianlong/.bash_profile /Users/xuqianlong/.zlogin.
Installation of RVM in /Users/xuqianlong/.rvm/ is almost complete:

  * To start using RVM you need to run `source /Users/xuqianlong/.rvm/scripts/rvm`
    in all your open shell windows, in rare cases you need to reopen all shell windows.

# xuqianlong,
#
#   Thank you for using RVM!
#   We sincerely hope that RVM helps to make your life easier and more enjoyable!!!
#
# ~Wayne, Michal & team.

In case of problems: https://rvm.io/help and https://twitter.com/rvm_io
```

如果遇到如下错误，可以直接在浏览器访问 https://get.rvm.io ，然后把内容复制保存成一个 sh 脚本

```
curl -L get.rvm.io | bash -s stable
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   194  100   194    0     0    316      0 --:--:-- --:--:-- --:--:--   316
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
```

直接执行脚本安装：

```
chmod +x install.rvm 
➜  Desktop ./install.rvm           
Downloading https://github.com/rvm/rvm/archive/master.tar.gz
Upgrading the RVM installation in /Users/qianlongxu/.rvm/
    RVM PATH line found in /Users/qianlongxu/.mkshrc /Users/qianlongxu/.profile /Users/qianlongxu/.bashrc.
    RVM PATH line not found for Zsh, rerun this command with '--auto-dotfiles' flag to fix it.
    RVM sourcing line found in /Users/qianlongxu/.profile /Users/qianlongxu/.bash_profile /Users/qianlongxu/.zlogin.
Upgrade of RVM in /Users/qianlongxu/.rvm/ is complete.
  * RVM 1.30 simplifies behavior of 'rvm wrapper' subcommand


Thanks for installing RVM 🙏
Please consider donating to our open collective to help us maintain RVM.

👉  Donate: https://opencollective.com/rvm/donate
```

## 更新 Ruby

安装好 RVM 之后执行：

`rvm list known` 如果报错：

`-bash: rvm: command not found`

这时重新开个新的终端窗口执行即可，如果还是这个错，那么手动配置下path路径：

```shell
bogon:~ xuqianlong$ rvm list known
# MRI Rubies
[ruby-]1.8.6[-p420]
[ruby-]1.8.7[-head] # security released on head
[ruby-]1.9.1[-p431]
[ruby-]1.9.2[-p330]
[ruby-]1.9.3[-p551]
[ruby-]2.0.0[-p648]
[ruby-]2.1[.10]
[ruby-]2.2[.6]
[ruby-]2.3[.3]
[ruby-]2.4[.0]
ruby-head

# for forks use: rvm install ruby-head-<name> --url https://github.com/github/ruby.git --branch 2.2

# JRuby
jruby-1.6[.8]
jruby-1.7[.26]
jruby[-9.1.7.0]
jruby-head

# Rubinius
rbx-1[.4.3]
rbx-2.3[.0]
rbx-2.4[.1]
rbx-2[.5.8]
rbx[-3.71]
rbx-head

# Opal
opal

# Minimalistic ruby implementation - ISO 30170:2012
mruby-1.0.0
mruby-1.1.0
mruby-1[.2.0]
mruby[-head]

# Ruby Enterprise Edition
ree-1.8.6
ree[-1.8.7][-2012.02]

# Topaz
topaz

# MagLev
maglev[-head]
maglev-1.0.0

# Mac OS X Snow Leopard Or Newer
macruby-0.10
macruby-0.11
macruby[-0.12]
macruby-nightly
macruby-head

# IronRuby
ironruby[-1.1.3]
ironruby-head
```

我不想安装那么新的版本，日后也要安装 CocoPods，他的最低要求版本是 2.2，所以我选择安装 2.2.6 版本:

`bogon:~ xuqianlong$ rvm install ruby-2.2.6`

```shell
Searching for binary rubies, this might take some time.
No binary rubies available for: osx/10.12/x86_64/ruby-2.2.6.
Continuing with compilation. Please read 'rvm help mount' to get more information on binary rubies.
Checking requirements for osx.
About to install Homebrew, press `Enter` for default installation in `/usr/local`,
type new path if you wish custom Homebrew installation (the path needs to be writable for user)
:
==> This script will install:
/usr/local/bin/brew
/usr/local/share/doc/homebrew
/usr/local/share/man/man1/brew.1
/usr/local/share/zsh/site-functions/_brew
/usr/local/etc/bash_completion.d/brew
/usr/local/Homebrew
==> The following existing directories will be made group writable:
/usr/local/bin
==> The following existing directories will have their owner set to xuqianlong:
/usr/local/bin
==> The following existing directories will have their group set to admin:
/usr/local/bin
==> The following new directories will be created:
/usr/local/Cellar
/usr/local/Homebrew
/usr/local/Frameworks
/usr/local/etc
/usr/local/include
/usr/local/lib
/usr/local/opt
/usr/local/sbin
/usr/local/share
/usr/local/share/zsh
/usr/local/share/zsh/site-functions
/usr/local/var

Press RETURN to continue or any other key to abort
==> /usr/bin/sudo /bin/chmod u+rwx /usr/local/bin
Password:
==> /usr/bin/sudo /bin/chmod g+rwx /usr/local/bin
==> /usr/bin/sudo /usr/sbin/chown xuqianlong /usr/local/bin
==> /usr/bin/sudo /usr/bin/chgrp admin /usr/local/bin
==> /usr/bin/sudo /bin/mkdir -p /usr/local/Cellar /usr/local/Homebrew /usr/local/Frameworks /usr/local/etc /usr/local/include /usr/local/lib /usr/local/opt /usr/local/sbin /usr/local/share /usr/local/share/zsh /usr/local/share/zsh/site-functions /usr/local/var
==> /usr/bin/sudo /bin/chmod g+rwx /usr/local/Cellar /usr/local/Homebrew /usr/local/Frameworks /usr/local/etc /usr/local/include /usr/local/lib /usr/local/opt /usr/local/sbin /usr/local/share /usr/local/share/zsh /usr/local/share/zsh/site-functions /usr/local/var
==> /usr/bin/sudo /bin/chmod 755 /usr/local/share/zsh /usr/local/share/zsh/site-functions
==> /usr/bin/sudo /usr/sbin/chown xuqianlong /usr/local/Cellar /usr/local/Homebrew /usr/local/Frameworks /usr/local/etc /usr/local/include /usr/local/lib /usr/local/opt /usr/local/sbin /usr/local/share /usr/local/share/zsh /usr/local/share/zsh/site-functions /usr/local/var
==> /usr/bin/sudo /usr/bin/chgrp admin /usr/local/Cellar /usr/local/Homebrew /usr/local/Frameworks /usr/local/etc /usr/local/include /usr/local/lib /usr/local/opt /usr/local/sbin /usr/local/share /usr/local/share/zsh /usr/local/share/zsh/site-functions /usr/local/var
==> /usr/bin/sudo /bin/mkdir -p /Users/xuqianlong/Library/Caches/Homebrew
==> /usr/bin/sudo /bin/chmod g+rwx /Users/xuqianlong/Library/Caches/Homebrew
==> /usr/bin/sudo /usr/sbin/chown xuqianlong /Users/xuqianlong/Library/Caches/Homebrew
==> /usr/bin/sudo /bin/mkdir -p /Library/Caches/Homebrew
==> /usr/bin/sudo /bin/chmod g+rwx /Library/Caches/Homebrew
==> /usr/bin/sudo /usr/sbin/chown xuqianlong /Library/Caches/Homebrew
==> Downloading and installing Homebrew...
remote: Counting objects: 6463, done.
remote: Compressing objects: 100% (3911/3911), done.
remote: Total 6463 (delta 3738), reused 4283 (delta 2347), pack-reused 0
Receiving objects: 100% (6463/6463), 3.58 MiB | 231.00 KiB/s, done.
Resolving deltas: 100% (3738/3738), done.
From https://github.com/Homebrew/brew
 * [new branch]      master     -> origin/master
 * [new tag]         0.1        -> 0.1
 * [new tag]         0.2        -> 0.2
 * [new tag]         0.3        -> 0.3
 * [new tag]         0.4        -> 0.4
 * [new tag]         0.5        -> 0.5
 * [new tag]         0.6        -> 0.6
 * [new tag]         0.7        -> 0.7
 * [new tag]         0.7.1      -> 0.7.1
 * [new tag]         0.8        -> 0.8
 * [new tag]         0.8.1      -> 0.8.1
 * [new tag]         0.9        -> 0.9
 * [new tag]         0.9.1      -> 0.9.1
 * [new tag]         0.9.2      -> 0.9.2
 * [new tag]         0.9.3      -> 0.9.3
 * [new tag]         0.9.4      -> 0.9.4
 * [new tag]         0.9.5      -> 0.9.5
 * [new tag]         0.9.8      -> 0.9.8
 * [new tag]         0.9.9      -> 0.9.9
 * [new tag]         1.0.0      -> 1.0.0
 * [new tag]         1.0.1      -> 1.0.1
 * [new tag]         1.0.2      -> 1.0.2
 * [new tag]         1.0.3      -> 1.0.3
 * [new tag]         1.0.4      -> 1.0.4
 * [new tag]         1.0.5      -> 1.0.5
 * [new tag]         1.0.6      -> 1.0.6
 * [new tag]         1.0.7      -> 1.0.7
 * [new tag]         1.0.8      -> 1.0.8
 * [new tag]         1.0.9      -> 1.0.9
 * [new tag]         1.1.0      -> 1.1.0
 * [new tag]         1.1.1      -> 1.1.1
 * [new tag]         1.1.10     -> 1.1.10
 * [new tag]         1.1.11     -> 1.1.11
 * [new tag]         1.1.12     -> 1.1.12
 * [new tag]         1.1.13     -> 1.1.13
 * [new tag]         1.1.2      -> 1.1.2
 * [new tag]         1.1.3      -> 1.1.3
 * [new tag]         1.1.4      -> 1.1.4
 * [new tag]         1.1.5      -> 1.1.5
 * [new tag]         1.1.6      -> 1.1.6
 * [new tag]         1.1.7      -> 1.1.7
 * [new tag]         1.1.8      -> 1.1.8
 * [new tag]         1.1.9      -> 1.1.9
 * [new tag]         1.2.0      -> 1.2.0
 * [new tag]         1.2.1      -> 1.2.1
 * [new tag]         1.2.2      -> 1.2.2
 * [new tag]         1.2.3      -> 1.2.3
HEAD is now at 80ce43d Merge pull request #2776 from GauthamGoli/audit_checksum_rubocop_fix
==> Tapping homebrew/core
Cloning into '/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core'...
remote: Counting objects: 4444, done.
remote: Compressing objects: 100% (4245/4245), done.
remote: Total 4444 (delta 35), reused 463 (delta 13), pack-reused 0
Receiving objects: 100% (4444/4444), 3.53 MiB | 93.00 KiB/s, done.
Resolving deltas: 100% (35/35), done.
Tapped 4243 formulae (4,487 files, 11MB)
==> Cleaning up /Library/Caches/Homebrew...
==> Migrating /Library/Caches/Homebrew to /Users/xuqianlong/Library/Caches/Homeb
==> Deleting /Library/Caches/Homebrew...
Already up-to-date.
==> Installation successful!

==> Homebrew has enabled anonymous aggregate user behaviour analytics.
Read the analytics documentation (and how to opt-out) here:
  http://docs.brew.sh/Analytics.html

==> Next steps:
- Run `brew help` to get started
- Further documentation:
    http://docs.brew.sh
Installing requirements for osx.
Updating system.........
Installing required packages: autoconf, automake, libtool, pkg-config, coreutils, libyaml, readline, libksba, openssl..........
Certificates in '/usr/local/etc/openssl/cert.pem' are already up to date.
Requirements installation successful.
Installing Ruby from source to: /Users/xuqianlong/.rvm/rubies/ruby-2.2.6, this may take a while depending on your cpu(s)...
ruby-2.2.6 - #downloading ruby-2.2.6, this may take a while depending on your connection...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 12.7M  100 12.7M    0     0  4958k      0  0:00:02  0:00:02 --:--:-- 4958k
ruby-2.2.6 - #extracting ruby-2.2.6 to /Users/xuqianlong/.rvm/src/ruby-2.2.6...-
ruby-2.2.6 - #configuring......................................................-
ruby-2.2.6 - #post-configuration.
ruby-2.2.6 - #compiling........................................................-
ruby-2.2.6 - #installing..........
ruby-2.2.6 - #making binaries executable..
ruby-2.2.6 - #downloading rubygems-2.6.12
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  749k  100  749k    0     0   858k      0 --:--:-- --:--:-- --:--:--  858k
No checksum for downloaded archive, recording checksum in user configuration.
ruby-2.2.6 - #extracting rubygems-2.6.12....
ruby-2.2.6 - #removing old rubygems.........
ruby-2.2.6 - #installing rubygems-2.6.12.........................
ruby-2.2.6 - #gemset created /Users/xuqianlong/.rvm/gems/ruby-2.2.6@global
ruby-2.2.6 - #importing gemset /Users/xuqianlong/.rvm/gemsets/global.gems......|
ruby-2.2.6 - #generating global wrappers........
ruby-2.2.6 - #gemset created /Users/xuqianlong/.rvm/gems/ruby-2.2.6
ruby-2.2.6 - #importing gemsetfile /Users/xuqianlong/.rvm/gemsets/default.gems evaluated to empty gem list
ruby-2.2.6 - #generating default wrappers........
ruby-2.2.6 - #adjusting #shebangs for (gem irb erb ri rdoc testrb rake).
Install of ruby-2.2.6 - #complete
Ruby was built without documentation, to build it run: rvm docs generate-ri
```

查看版本：

```
bogon:~ xuqianlong$ ruby -v
ruby 2.2.6p396 (2016-11-15 revision 56800)
```

Ruby 版本已经成功升级，接下来就可以安装 Jekyll, CocoPods 这些库了。

## 可能出现的错误
1、在执行 `rvm install ruby-2.2.6` 的过程中可能会出错，比如这个:

```
Searching for binary rubies, this might take some time.
No binary rubies available for: osx/10.12/x86_64/ruby-2.2.6.
Continuing with compilation. Please read 'rvm help mount' to get more information on binary rubies.
Checking requirements for osx.
Installing requirements for osx.
Updating system...........
Error running 'requirements_osx_brew_update_system ruby-2.2.6',
showing last 15 lines of /Users/qianlongxu/.rvm/log/1503014778_ruby-2.2.6/update_system.log
    https://github.com/Homebrew/homebrew/wiki/Common-Issues
and make sure `brew update` works before continuing.'
++ rvm_pretty_print stderr
++ case "${rvm_pretty_print_flag:=auto}" in
++ case "${TERM:-dumb}" in
++ case "$1" in
++ [[ -t 2 ]]
++ return 1
++ printf %b 'Failed to update Homebrew, follow instructions here:
    https://github.com/Homebrew/homebrew/wiki/Common-Issues
and make sure `brew update` works before continuing.\n'
Failed to update Homebrew, follow instructions here:
    https://github.com/Homebrew/homebrew/wiki/Common-Issues
and make sure `brew update` works before continuing.
++ return 1
Requirements installation failed with status: 1.
```

发生这个错误的原因是: `Failed to update Homebrew` !
于是我就尝试执行: `brew update`

```shell
Error: /usr/local is not writable. You should change the ownership
and permissions of /usr/local back to your user account:
  sudo chown -R $(whoami) /usr/local
```

这个问题是老版本的 Homwbrew 需要 /usr/local 目录的 ownership，因此执行下 `sudo chown -R $(whoami) /usr/local` 就可以继续了；

brew 更新完毕后有这样一个提示:

```
==> Migrating HOMEBREW_REPOSITORY (please wait)...
==> Migrated HOMEBREW_REPOSITORY to /usr/local/Homebrew!
Homebrew no longer needs to have ownership of /usr/local. If you wish you can
return /usr/local to its default ownership with:
  sudo chown root:wheel /usr/local
```
于是更新完毕后，我又把权限修改回去了：`sudo chown root:wheel /usr/local`.

2、安装成功后，查看 ruby 版本还是系统自动的 2.0.0，使用rvm看的话，确实已经安装了，这是怎么回事？

```
qianlongxu:~ qianlongxu$ ruby -v
ruby 2.0.0p648 (2015-12-16 revision 53162) [universal.x86_64-darwin16]
qianlongxu:~ qianlongxu$ rvm list

rvm rubies

=* ruby-2.2.6 [ x86_64 ]

# => - current
# =* - current && default
#  * - default
```

rvm 可以切换 ruby 版本的，使用 `rvm use`，只要是 rvm list 列出来的，都可以切换，切换时直接跟上版本号就行了：

```
qianlongxu:~ qianlongxu$ rvm use 2.2.6

RVM is not a function, selecting rubies with 'rvm use ...' will not work.

You need to change your terminal emulator preferences to allow login shell.
Sometimes it is required to use `/bin/bash --login` as the command.
Please visit https://rvm.io/integration/gnome-terminal/ for an example.

qianlongxu:~ qianlongxu$ rvm use '2.2.6'

RVM is not a function, selecting rubies with 'rvm use ...' will not work.

You need to change your terminal emulator preferences to allow login shell.
Sometimes it is required to use `/bin/bash --login` as the command.
Please visit https://rvm.io/integration/gnome-terminal/ for an example.
```

再次遇到问题，rvm use 不是个命令！不要急继续往下看，问题是由于 shell 的执行环境不对，修改下登录shell即可：

```
qianlongxu:~ qianlongxu$ /bin/bash --login
qianlongxu:~ qianlongxu$ rvm use 2.2.6
Using /Users/qianlongxu/.rvm/gems/ruby-2.2.6
qianlongxu:~ qianlongxu$ ruby -v
ruby 2.2.6p396 (2016-11-15 revision 56800) [x86_64-darwin16]
```

3、如果你遇到了第二个问题的话，你可能会发现，关闭终端后再次打开，ruby的版本又变成系统的2.0.0了！

原因可能是，你在设置-用户与群组-高级选项里-登录shell里设置了其他shell导致的，改为 `/bin/bash` 即可。


以上问题是我切换 Mac 用户名之后导致的，一般情况下应该不会遇到的。

## 参考链接

- [How to update Ruby Version 2.0.0 to the latest version in Mac OSX Yosemite](https://stackoverflow.com/questions/38194032/how-to-update-ruby-version-2-0-0-to-the-latest-version-in-mac-osx-yosemite)
- [https://ruby-china.org/wiki/rvm-guide](https://ruby-china.org/wiki/rvm-guide)
- [http://rvm.io/rubies/default](http://rvm.io/rubies/default)
- [https://stackoverflow.com/questions/23963018/rvm-is-not-a-function-selecting-rubies-with-rvm-use-will-not-work](https://stackoverflow.com/questions/23963018/rvm-is-not-a-function-selecting-rubies-with-rvm-use-will-not-work)