---
layout: post
title: CentOS 安装 MySQL
date: 2018-10-26 18:09:10
tags: ["CentOS","MySQL"]
---

> 以下命令如有权限问题请自行使用 sudo 或者切换到 root 账户，我的这台主机是公司分配的，通过 ssh 直接登录的 root 账户，所以就没有带 sudo.该笔记可能不适用于 CentOS 7.

## 查看系统版本

- uname

	`Linux`

- uname -a

	`Linux 110.116.189.67 3.10.0-327.el7.x86_64 #1 SMP Thu Oct 29 17:29:29 EDT 2015 x86_64 x86_64 x86_64 GNU/Linux`
- rpm -q centos-release

	`centos-release-6-10.el6.centos.12.3.x86_64`

## 安装 MySQL

- yum update
- yum install mysql-server
- /sbin/chkconfig --levels 235 mysqld on

## 启动 MySQL 服务

- service mysqld status
- service mysqld start
- service mysqld restart
- service mysqld stop

## 参考

- https://www.linode.com/docs/databases/mysql/how-to-install-mysql-on-centos-6/