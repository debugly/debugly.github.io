---
layout: post
title: "Mac 上如何使用 SSH key"
date: 2015-11-06 21:35:37 +0800
comments: true
tags: ["macOS"]
---

# Introduction

> SSH key 用来标识某台计算机被信任！一旦被信任，以后在这台计算机上进行的操作就不需要输入你账户的密码，可以理解为令牌，拿着令牌就可以做事，当然权限是可控制的！SSH key 是部分平台的，也就说今天举例的 MAC 系统可以用，经常使用的 Windows 也可以用，Linux等系统均可，因为说白了就是使用了一种加密方法，计算机生成了一对密钥；一个公钥，一个私钥，公钥当然就是公开使用的，一般会用于第三方平台，私钥是保留在计算机里的，因此在操作的时候只需公私钥配对即可，只要配对就认为是信任的计算机所为，就可以继续操作！今天以 SSH key 方式访问 github 举例...

# 使用场景

- 免密码登录远程服务器
- 免密码推送、拉取 git 远程仓库
    - 比如我的博客使用的是 git page，说白了就是一个特殊的 github 仓库而已；本地生成站点之后，就需要 push 到 github，为了不用每次都输入用户名和密码，可以配置 ssh key，然后把远程仓库地址设置为 ssh 格式即可。

    - 工作时虽然使用的是内部的 git 托管服务器 git lab，但使用方式跟 github 也没啥不一样的，同样支持配置 ssh key。

# 查看本地 ssh 密钥

ssh 公钥默认存放在 `~/.ssh` 目录下，因此可以 ls 查看下：

```shell
ls ~/.ssh

如果曾经使用过 GitHub 客户端的话，应该是这样的：
-rw-------   1 xuqianlong  staff  1766  3 11  2015 github_rsa
-rw-r--r--@  1 xuqianlong  staff   405 10 18 17:31 github_rsa.pub
-rw-r--r--   1 xuqianlong  staff  1595  7  2 01:33 known_hosts

也有可能是这样的：
-rw-------  1 xuqianlong  staff  3243  8 20 00:15 id_rsa
-rw-r--r--  1 xuqianlong  staff   742  8 20 00:15 id_rsa.pub
-rw-r--r--  1 xuqianlong  staff   803  8 20 09:38 known_hosts

只不过是文件名的前缀不同罢了；
```

如果 ssh 已经添加到 github 了，那么可以通过 `ssh -T git@github.com` 验证下：

```
还没添加：
Permission denied (publickey).
或者：
Hi debugly! You've successfully authenticated, but GitHub does not provide shell access.
```

如果本地没有可用的 ssh key，或者你不想用之前的，或者想让之前的实效，那么你可以全部删掉，然后重新生成即可。

# 生成新的 SSH Key

使用 `ssh-keygen -t rsa -b 4096 -C  "xx@yyyzzz.com" ` 生成，这里的 "xx@yyyzzz.com" 替换成你的邮箱或者随便写都行，没限制的，最好起个能分的清楚的名字，有可能你有多个电脑，配置了多个 key。

输入上面的命令后，接下来连续 3 次回车就好了，具体细节是：

- Enter file in which to save the key (/Users/xuqianlong/.ssh/id_rsa): 文件存放位置，默认(~/.ssh)
- Enter passphrase (empty for no passphrase):我这里无需设置密码，直接回车
- Enter same passphrase again: 再次输入密码回车

这是我执行的结果：

```shell
bogon:~ xuqianlong$ ssh-keygen -t rsa -b 4096 -C "qianlongxu@home.mbp"
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/xuqianlong/.ssh/id_rsa): 
Created directory '/Users/xuqianlong/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /Users/xuqianlong/.ssh/id_rsa.
Your public key has been saved in /Users/xuqianlong/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:GzJ1j3gh0ws/IwF/KMQwoIvHhmnoPPW/v+w+pmDmSFo qianlongxu@home.mbp
The key's randomart image is:
+---[RSA 4096]----+
|  ..ooo          |
| .   o.o o       |
|.     . O =      |
|o=     o X =     |
|*.+.  o S B .    |
|+o. .  o = o     |
| + E =  .        |
|  = = o .o       |
| . . . +B*o      |
+----[SHA256]-----+
```

- 添加到 ssh-agent

`ssh-add ~/.ssh/id_rsa` : Identity added: /Users/xuqianlong/.ssh/id_rsa (/Users/xuqianlong/.ssh/id_rsa) 即使不操作这一步，一般也没问题的。


如果英文不错，那么可以直接去看 github 官网提供的文档： [Generating-ssh-key](https://help.github.com/articles/generating-ssh-keys/) .


# Github 账号添加 SSH key

- 将公钥复制到剪切板

`pbcopy < ~/.ssh/id_rsa.pub`
或者
`cat ~/.ssh/id_rsa.pub | pbcopy`

登录 Github 账号，点击 Setting:

<img src="/images/201511/userbar-account-settings.jpg" width="192" height="281">

点击左侧的 SSH keys:

<img src="/images/201511/settings-sidebar-ssh-keys.jpg" width="307" height="172">

点击 Add SSH keys:

<img src="/images/201511/ssh-add-ssh-key.jpg" width="337" height="66">

直接将公钥复制到输入框里面，一般 title 会自动生成:

<img src="/images/201511/ssh-key-paste.jpg" width="337" height="197">

点击 Add key 即可:

<img src="/images/201511/ssh-add-key.jpg" width="70" height="49">

- 添加到 github 后检查下 ssh key 状态 

`ssh -T git@github.com`

应该看到如下内容:

```
The authenticity of host 'github.com (192.30.252.130)' can't be established.
RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
Are you sure you want to continue connecting (yes/no)?
```
因为这是第一次使用，没有 IP 记录，因此输入 yes 即可；

```
Warning: Permanently added 'github.com,192.30.252.130' (RSA) to the list of known hosts.
Hi debugly! You've successfully authenticated, but GitHub does not provide shell access.
```

看到你 Github 的用户名后就表示成功了！

# 体验免密码

- git clone git@github.com:debugly/NeedUpdate.git

```shell
Cloning into 'NeedUpdate'...
remote: Counting objects: 149, done.
remote: Compressing objects: 100% (98/98), done.
remote: Total 149 (delta 42), reused 149 (delta 42), pack-reused 0
Receiving objects: 100% (149/149), 10.30 MiB | 16.00 KiB/s, done.
Resolving deltas: 100% (42/42), done.
Checking connectivity... done.
```
