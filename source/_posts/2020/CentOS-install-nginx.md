---
layout: post
title: CentOS 源码安装 Nginx
date: 2020-11-03 18:09:10
tags: [CentOS,Nginx]
---

## 查看系统版本

- uname

	`Linux`

- uname -a

	`Linux yz18-10-19.localdomain 2.6.32-754.el6.x86_64 #1 SMP Thu May 24 18:18:25 EDT 2018 x86_64 x86_64 x86_64 GNU/Linux`
	
- cat /etc/*release

  `LSB_VERSION=base-4.0-amd64:base-4.0-noarch:core-4.0-amd64:core-4.0-noarch:graphics-4.0-amd64:graphics-4.0-noarch:printing-4.0-amd64:printing-4.0-noarch
  Red Hat Enterprise Linux Server release 6.10 (Santiago)
  Red Hat Enterprise Linux Server release 6.10 (Santiago)`

- cat /etc/issue
`Red Hat Enterprise Linux Server release 6.10 (Santiago)
Kernel \r on an \m`

## 使用源码安装 Nginx

 先安装好编译源码的工具：

- yum install gcc-c++
- yum install -y pcre pcre-devel
- yum install -y zlib zlib-devel
- yum install -y openssl openssl-devel

<!--more-->

```
#下载源码
mkdir -p /data/soft
cd /data/soft
wget http://nginx.org/download/nginx-1.18.0.tar.gz
tar -zxvf nginx-1.18.0.tar.gz
cd nginx-1.18.0
#自定义配置
./configure --prefix=/etc/nginx --sbin-path=/usr/sbin/nginx --modules-path=/usr/lib64/nginx/modules --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-log-path=/var/log/nginx/access.log --pid-path=/var/run/nginx.pid --lock-path=/var/run/nginx.lock --http-client-body-temp-path=/var/cache/nginx/client_temp --http-proxy-temp-path=/var/cache/nginx/proxy_temp --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp --http-scgi-temp-path=/var/cache/nginx/scgi_temp --user=nginx --group=nginx --with-compat --with-file-aio --with-threads --with-http_addition_module --with-http_auth_request_module --with-http_dav_module --with-http_flv_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_mp4_module --with-http_random_index_module --with-http_realip_module --with-http_secure_link_module --with-http_slice_module --with-http_ssl_module --with-http_stub_status_module --with-http_sub_module --with-http_v2_module --with-mail --with-mail_ssl_module --with-stream --with-stream_realip_module --with-stream_ssl_module --with-stream_ssl_preread_module --without-http_memcached_module --without-http_fastcgi_module --without-http_map_module --without-http_geo_module --without-http_autoindex_module --with-cc-opt='-O2 -g -pipe -Wall -Wp,-D_FORTIFY_SOURCE=2 -fexceptions -fstack-protector --param=ssp-buffer-size=4 -m64 -mtune=generic -fPIC' --with-ld-opt='-Wl,-z,relro -Wl,-z,now -pie'
mkdir -p /var/cache/nginx/
make
make install
```

## 启动 Nginx 服务

上面的配置将 nginx 的 bin 放到了 /usr/sbin 目录下了，因此无需配置 PATH，就可以在任意目录调用！

```
echo $PATH
/usr/lib64/qt-3.3/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin
```

- 启动: sudo nginx 尽量使用 sudo ，不使用时一般也行，避免出现一些莫名的问题

```
[@yz18-120-118.localdomain /data/soft/nginx-1.18.0]# sudo nginx
nginx: [emerg] getpwnam("nginx") failed
[@yz18-120-118.localdomain /data/soft/nginx-1.18.0]# useradd -s /sbin/nologin -M nginx
[@yz18-120-118.localdomain /data/soft/nginx-1.18.0]# sudo nginx
[@yz18-120-118.localdomain /data/soft/nginx-1.18.0]# netstat -tlunp | grep nginx
tcp        0      0 0.0.0.0:80                  0.0.0.0:*                   LISTEN      6004/nginx
[@yz18-120-118.localdomain /data/soft/nginx-1.18.0]# id nginx
uid=503(nginx) gid=503(nginx) groups=503(nginx)
```

- 停止：nginx -s stop
- 重新加载配置文件：nginx -s reload
- 查看版本：nginx -v
- 查看编译配置：nginx -V

启动失败时，可以看下错误日志 /var/log/nginx/error.log 帮助排查。

默认使用 80 端口，如果端口被暂用，启动失败可以查看那个程序占用的，然后 kill 掉那个进程

```
~ lsof -i tcp:80   
COMMAND     PID       USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
nginx     46838 qianlongxu    6u  IPv4 0x76c2385eb7b3200f      0t0  TCP *:http (LISTEN)
nginx     46859 qianlongxu    6u  IPv4 0x76c2385eb7b3200f      0t0  TCP *:http (LISTEN)
```

## 配置文件

按照上面的自定义安装方式，安装后配置文件是： /etc/nginx/nginx.conf ，查看内容

```
cat /etc/nginx/nginx.conf

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

这个文件不用改它，除非你知道怎么改！最后一行可以看出加载了 /etc/nginx/conf.d/ 目录下的所有 conf 文件，因此我们修改这个目录下的配置文件。

default.conf 是默认生成的，监听了 80 端口，可以修改为别的端口；

多端口都需要 nginx 转发时，可以新增不同的配置文件；

配置文件示例：

```
server {
    listen       80;
    server_name  _;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /opt/www/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /opt/www/html;
    }
		
		#通过 location 代理到本机 8081 端口的 feedback
    location /feedback {
        proxy_pass http://127.0.0.1:8081/feedback;
        client_max_body_size 500m;
    }
    
    #开启资源访问，自动生成索引
		location /source/ {
        root /data/aa/;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
        charset utf-8;
    }
    
    location /ffpods/ {
        root /data/xql/;
    }
    
    #alias : when access mac folder's file a.txt,use /mac/a.txt
    location /mac/ {
        alias /data/xql/upgrade/mac/;
    }

    location /H5/ {
        alias /data/xql/upgrade/H5/;
    }
    
    location /frptest/ {
        proxy_pass http://10.16.89.134:8000/;
    }

    location /frp/ {
        proxy_pass http://106.120.154.23/;
    }
}
```

### 使用 root 定位

下面是 root 的几个测试示例，假定 root 目录下确实有 index.html 文件：

```
## 浏览器请求 localhost/a/index.html
## 请求的资源路径是 /data/xql/Test/a/a/index.html
## 实际上没有这个文件，因此返回 404
location /a/ {
  root /data/xql/Test/a/;
  index  index.html index.htm;	
}

## 浏览器请求 localhost/b/index.html
## 请求的资源路径是 /data/xql/Test/b/index.html
## 正常返回内容
location /b/ {
  root /data/xql/Test/;
  index  index.html index.htm;
} 

## 浏览器请求 localhost/c/index.html
## 请求的资源路径是 /data/xql/Test/c/index.html
## 正常返回内容
location /c/ {
  root /data/xql/Test;
  index  index.html index.htm;
}

## 浏览器请求 localhost/d/index.html
## 请求的资源路径是 /opt/www/html/d/index.html
## 实际上没有这个文件，因此返回 404
location d {
  root /data/xql/Test/d;
  index  index.html index.htm;
} 
```

总结下就是 location 后面跟的路径要以 / 开头，实际请求地址将是 root + location 定位，是否以 / 结尾不重要！

### 使用 alias 定位

下面是 alias 的几个使用示例，假定 alias 目录下确实有 index.html 文件：

```
## 浏览器请求 localhost/aa/
## 请求的资源路径是 /data/xql/Test/aa/index.html
## 正常返回内容
location /aa/ {
  alias /data/xql/Test/aa/;
  index  index.html index.htm;
}

## 浏览器请求 localhost/bb/index.html
## 请求的资源路径是 /data/xql/Test/
## 403
location /bb/ {
  alias /data/xql/Test/;
  index  index.html index.htm;
} 

## 浏览器请求 localhost/cc/
## 请求的资源路径是 /data/xql/Test/cc/index.html
## 正常返回内容
location /cc {
  alias /data/xql/Test/cc/;
  index  index.html index.htm;
}

## 浏览器请求 localhost/dd/index.html
## 请求的资源路径是 /opt/www/html/dd/index.html
## 实际上没有这个文件，因此返回 404
location dd {
  alias /data/xql/Test/dd/;
}
```

总结下就是 alias 后面跟的路径要以 / 开头，否则不是你想要的效果，实际请求地址将是 alias 替换 location 进行定位，是否以 / 结尾不重要！



## 参考

- https://www.cnblogs.com/boonya/p/7907999.html
