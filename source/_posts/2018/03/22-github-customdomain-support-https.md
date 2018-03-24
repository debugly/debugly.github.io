---
layout: post
title: Github Pages 自定义域名支持 HTTPS
date: 2018-03-22 21:56:06
tags: Other
---

> 自从有了自己的域名后，我的博客就失去了那把小绿锁，就在刚刚我还在搜索：Github 自定义域名怎么支持https，当我看到这个 [帖子](https://neue.v2ex.com/t/434553) 之后，事情就有了翻转，没想到 Github 支持了，皆大欢喜了！也不用去折腾 Cloudflare 了....


看了下，使用的是 [Let's Encrypt](https://letsencrypt.org/) 提供的免费证书，有效期是3个月，到期后可以续，等于永久免费！

![](/images/201803/8.jpeg)

看了下证书是 2018年3月10日 创建的，莫非是 Github 默默为所有用户都申请好了？

开启方式：

![](/images/201803/9.jpeg)

之前在没有自定义域名的时候才能开启这个 https 选项！