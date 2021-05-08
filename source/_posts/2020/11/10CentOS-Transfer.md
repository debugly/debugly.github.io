---
layout: post
title: CentOS 主机迁移
date: 2020-11-10 18:09:10
tags: [CentOS]
---

接到运维同学的通知，要做主机迁移，涉及到了 nginx 和资源文件，因此需要查看 nginx 的编译配置和 nginx 的运行配置。运维告诉我xx主机上装有 nginx，域名也是打到这台机器的，我顿时有点懵逼，因为我之前找过，根本找不到 nginx 在哪装的，这次必须得找到它才行啊...

<!--more-->

## 如何找到运行中程序所在目录？

### which 

如果程序的路径在 PATH 里可以找到，这时很好办，可以通过 which 命令来找，如果不在 PATH 改怎么找呢？

```
[@110.116.189.228 /data/ifox/upgrade]# nginx
-bash: nginx: command not found
[@110.116.189.228 /]# which nginx
/usr/bin/which: no nginx in (/opt/jdk7/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin)
[@110.116.189.228 /data/ifox/upgrade]# id nginx
id: nginx: No such user
```

### ps

如果确定这个程序当前正在运行，那么可以通过 `ps aux` 来找到这个程序

```
[@110.116.189.228 /]# ps aux | grep nginx
root      13884  0.0  0.0  22740  1180 ?        Ss    2019   0:00 nginx: master process /opt/nginx/sbin/nginx
nobody    13950  0.0  0.0  23184  1912 ?        S     2019 184:25 nginx: worker process
nobody    13951  0.0  0.0  23184  1916 ?        S     2019 184:31 nginx: worker process
nobody    13952  0.0  0.0  23184  1912 ?        S     2019 184:23 nginx: worker process
nobody    13953  0.0  0.0  23184  1508 ?        S     2019 184:28 nginx: worker process
nobody    13954  0.0  0.0  23184  1912 ?        S     2019 184:40 nginx: worker process
nobody    13955  0.0  0.0  23184  1912 ?        S     2019 184:44 nginx: worker process
nobody    13956  0.0  0.0  23184  1524 ?        S     2019 184:18 nginx: worker process
nobody    13957  0.0  0.0  23184  1916 ?        S     2019 184:03 nginx: worker process
nobody    13958  0.0  0.0  23184  1912 ?        S     2019 184:37 nginx: worker process
nobody    13959  0.0  0.0  23184  1916 ?        S     2019 184:34 nginx: worker process
nobody    13960  0.0  0.0  23184  1912 ?        S     2019 184:02 nginx: worker process
nobody    13961  0.0  0.0  23184  1508 ?        S     2019 184:36 nginx: worker process
nobody    13962  0.0  0.0  23184  1520 ?        S     2019 184:06 nginx: worker process
nobody    13963  0.0  0.0  23184  1516 ?        S     2019 184:23 nginx: worker process
nobody    13964  0.0  0.0  23184  1524 ?        S     2019 184:33 nginx: worker process
nobody    13965  0.0  0.0  23184  1520 ?        S     2019 184:20 nginx: worker process
nobody    13966  0.0  0.0  23184  1520 ?        S     2019 184:33 nginx: worker process
nobody    13967  0.0  0.0  23184  1520 ?        S     2019 184:50 nginx: worker process
nobody    13968  0.0  0.0  23184  1916 ?        S     2019 184:18 nginx: worker process
nobody    13969  0.0  0.0  23184  1524 ?        S     2019 184:21 nginx: worker process
nobody    13970  0.0  0.0  23184  1524 ?        S     2019 184:15 nginx: worker process
nobody    13971  0.0  0.0  23184  1916 ?        S     2019 183:56 nginx: worker process
nobody    13972  0.0  0.0  23184  1524 ?        S     2019 183:57 nginx: worker process
nobody    13973  0.0  0.0  23184  1916 ?        S     2019 184:47 nginx: worker process
nobody    13974  0.0  0.0  23184  1520 ?        S     2019 184:08 nginx: worker process
nobody    13975  0.0  0.0  23184  1520 ?        S     2019 184:25 nginx: worker process
nobody    13976  0.0  0.0  23184  1916 ?        S     2019 184:49 nginx: worker process
nobody    13977  0.0  0.0  23184  1520 ?        S     2019 184:04 nginx: worker process
nobody    13978  0.0  0.0  23184  1916 ?        S     2019 184:15 nginx: worker process
nobody    13979  0.0  0.0  23184  1916 ?        S     2019 183:46 nginx: worker process
nobody    13980  0.0  0.0  23184  1564 ?        S     2019 183:44 nginx: worker process
nobody    13981  0.0  0.0  23184  1920 ?        S     2019 183:54 nginx: worker process
nobody    13982  0.0  0.0  23184  1516 ?        S     2019 183:14 nginx: worker process
nobody    13983  0.0  0.0  23184  1524 ?        S     2019 184:12 nginx: worker process
nobody    13984  0.0  0.0  23184  1920 ?        S     2019 183:52 nginx: worker process
nobody    13985  0.0  0.0  23184  1480 ?        S     2019 184:34 nginx: worker process
nobody    13986  0.0  0.0  23184  1512 ?        S     2019 183:59 nginx: worker process
nobody    13987  0.0  0.0  23184  1920 ?        S     2019 183:55 nginx: worker process
nobody    13988  0.0  0.0  23184  1528 ?        S     2019 183:57 nginx: worker process
nobody    13989  0.0  0.0  23184  1544 ?        S     2019 183:47 nginx: worker process
nobody    13990  0.0  0.0  23184  1920 ?        S     2019 183:47 nginx: worker process
nobody    13991  0.0  0.0  23184  1516 ?        S     2019 183:59 nginx: worker process
nobody    13992  0.0  0.0  23184  1544 ?        S     2019 183:46 nginx: worker process
nobody    13993  0.0  0.0  23184  1920 ?        S     2019 183:54 nginx: worker process
nobody    13994  0.0  0.0  23184  1524 ?        S     2019 183:44 nginx: worker process
nobody    13995  0.0  0.0  23184  1512 ?        S     2019 184:02 nginx: worker process
nobody    13996  0.0  0.0  23184  1920 ?        S     2019 184:09 nginx: worker process
nobody    13997  0.0  0.0  23184  1516 ?        S     2019 183:40 nginx: worker process
root     112730  0.0  0.0   8000   588 pts/0    S+   18:05   0:00 grep nginx
```
可以明确的看到，程序目录在这里 master process /opt/nginx/sbin/nginx ; 找到 nginx 之后，查看具体信息:

```
[@110.116.189.228 /opt/nginx/sbin]#  /opt/nginx/sbin/nginx -V
nginx version: nginx/1.10.2
built by gcc 4.4.7 20120313 (Red Hat 4.4.7-18) (GCC) 
built with OpenSSL 1.0.2g  1 Mar 2016
TLS SNI support enabled
configure arguments: --prefix=/opt/nginx --with-http_stub_status_module --with-http_ssl_module --with-http_realip_module --with-http_v2_module --with-openssl=/root/openssl-1.0.2g --without-http_memcached_module --without-http_fastcgi_module --without-http_map_module --without-http_geo_module --without-http_autoindex_module
```

然后可以按照 configure arguments 配置在新机器上通过[编译 nginx 源码](/2020/CentOS-install-nginx.html)来安装，然后把 /opt/nginx/conf 复制到新主机上，一定记得打开 nginx.conf 看下，因为通常我们都会在最后一行 include 其他的配置文件！！比如我这台主机上是这么写的：

```
[@110.116.189.228 /opt/nginx/conf]# cat nginx.conf

#user  nobody;
worker_processes auto;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    include extra/*.conf;
}
```

一定要把 extra 文件夹复制到新主机的 nginx.conf 同级目录。

## 数据迁移

数据的迁移通过 scp 即可，比较简单，保险起见，复制完毕后，检查下目录个数和文件个数，如果都能对上那应该没啥问题！

scp 的介绍在 [这里](/2017/05/26-my-shell.html) ,也包含了统计文件（夹）的脚本。

