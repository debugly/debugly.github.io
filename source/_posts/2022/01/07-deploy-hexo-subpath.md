---
layout: post
title: 将 Hexo 网站部署到子目录
date: 2022-01-07 19:00:06
tags: hexo,nginx
---

以下内容不介绍 Hexo 的使用方法，而是提供了一个如何将生成好的博客网站部署到域名子目录下，比如我的周报是通过 hexo 生成的，我需要部署到：http://m.local/weekly/ 路径下。

<!--More-->

从 Hexo 官网可以查询到，只需要修改你的博客源码根目录下的 _config.yml 文件即可，配置如下：

```
url: http://m.local
root: /weekly/
permalink: :year/:month/:day/:title/
```

如上所示 weekly 就是你想要的子目录，如果 yml 里没有 root ，可以自行加上，注意 : 前面一定不能有空格，后面一定要有一个空格！

这个配置不影响本地预览功能，本地预览时的地址会自动跳转到 http://localhost:4000/weekly/ 。

将站点重新生成然后放到域名对应的根目录下 weekly 子目录即可。

## nginx 代理

我的环境略复杂，我有一层 nginx 代理，域名的 80 端口实际上是 nginx 监听的，我的 weekly 站点实际上使用了 Hexo 的预览功能，监听了 4001 端口，因此我需要做的是让 Nginx 代理下。

我使用 home brew 安装的，配置文件在 /opt/homebrew/etc/nginx/nginx.conf，修改这个配置文件：

```
location /weekly/ {
    proxy_pass http://127.0.0.1:4001;
}
``` 

这么配置的意思是，原本访问 http://localhost:4001/weekly/ 的，在外网就成了 http://matt.local/weekly/ 。

注意，如果将 4001 后面配置上一个 / ，外网再次访问就会 302 到 http://localhost:4001/ ，但是上面配置了子目录了，会自动跳到 http://localhost:4001/weekly/ ，不知道怎么回事就形成了循环，最后得到一个 `m.local 重定向次数过多` 的错误。

## 参考

[Hexo 配置](https://hexo.io/zh-cn/docs/configuration.html)