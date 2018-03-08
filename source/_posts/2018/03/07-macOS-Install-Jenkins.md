---
layout: post
title: macOS Install Jenkins
date: 2018-03-07 00:05:31
tags: macOS
---


![](/images/201803/7.jpeg)

## 官网

[https://jenkins.io/download/](https://jenkins.io/download/)

## 下载 Jenkins

官网的 download 不好使，点击后没能开始下，估计是被墙了，所以找了个镜像:

[http://mirrors.jenkins-ci.org/osx/](http://mirrors.jenkins-ci.org/osx/?C=N;O=D)

也由 war 包的镜像:

[http://updates.jenkins-ci.org/download/war/](http://updates.jenkins-ci.org/download/war/)

## 启动 Jenkins 服务

```
java -jar /Applications/Jenkins/jenkins.war
```

需要 Java 环境，环境有问题的话，可以参考我的这篇[文章](/2018/03/06/Macos-JavaRuntime.html)

## 使用

默认端口是 8080，所以直接浏览器里输入 [localhost:8080](localhost:8080) 进行一次 admin 账户初始化就OK了！

![](/images/201803/8.jpeg)

有时间了再说下利用 Jenkins 自动化打包。