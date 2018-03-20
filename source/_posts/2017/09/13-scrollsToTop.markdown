---
layout: post
date: 2017-09-13 17:58:21 +0800
comments: true
tags: [issues,iOS]
author: 朱泽光
title: "UIScrollView 的 scrollsToTop 失效问题"
keywords: UIScrollView,scrollsToTop 
---

> 一般情况下，当前页面有滚动视图(UIScrollView或者UIScrollView的子类)时，触摸状态栏，视图会自动滚动的最顶端。如果页面有多个滚动视图，且是iOS10.0以下的系统，你会发现触摸状态栏没有反应了，回到顶部功能失效了。目前iOS10.0或以上系统没发现存在这个问题。

## 解决方案

经研究发现，UIScrollView有个scrollsToTop属性，这个属性就是控制滚动到顶部手势的开关。它的默认值是YES ，所以不用我们设置，默认是支持滚动到顶部的。继续回到上面遇到的问题，既然默认是YES，为什么回到顶部的功能失效了呢，这是因为有多个UIScrollView的情况下，他们默认都有scrollsToTop的功能，所以触摸状态栏时，系统无法判断是使哪个UIScrollView回到顶部。解决方案很简单，如果当前页面有多个滚动视图的话，要确保只有一个滚动视图的scrollsToTop为YES，这样系统就知道要使哪个UIScrollView回到顶部了。