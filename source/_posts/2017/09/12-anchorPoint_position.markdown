---
layout: post
date: 2017-09-12 18:33:42 +0800
comments: true
tags: ["iOS","issues"]
author: 田顺建
title: "CALayer 的 anchorPoint 与 position"
keywords: iOS,anchorPoint,position
---

> 在项目中要实现一个动画，想让view从底部展开，经过搜索，知道了CALayer的anchorPoint可以控制动画的固定点，遂直接写了如下代码：

```
self.redView.layer.anchorPoint = CGPointMake(0.5, 1.0);
self.redView.transform = CGAffineTransformMakeScale(1, 0);
[UIView animateWithDuration:2 animations:^{
   self.redView.transform = CGAffineTransformIdentity;
} completion:^(BOOL finished) {
}];
    
```
思路很简单，将view的底边终点作为anchorPoint，动画初始状态设置y轴缩放为0，动画结束状态恢复view的y轴缩放比例为1。

![](/images/issues/bottomStretch.gif)

效果甚是明显，我想要的是左边绿色view的动画效果，然而红色view虽然也是从底边展开的，但是，红色view的位置却跑偏了，直接向上移动了半个view的高度。这是为什么呢？接下来就是漫长的搜索过程……

## anchorPoint
首先，认识一下CALayer的重要属性——anchorPoint，即锚点、定位点。

怎么理解它呢，设想一张纸被一颗钉子钉在墙上，那么纸就可以绕着钉子旋转，这个钉子在纸上的位置，就可以理解为纸的锚点。
钉子在纸的左上角，则左上角（0，0）就是纸的锚点；钉子在中心点（0.5，0.5），则中心点就是纸的锚点，以此类推。

由此，让我们认识一下anchorPoint。它的坐标系是相对于layer自身的，x和y的取值范围是0~1，左上角为0，右下角为1，默认情况下，anchorPoint是（0.5，0.5）。

左图是初始状态，右图中是设置anchorPoint为不同的值的状态，绿色为(0,0)，蓝色为(0.5,0.5)，灰色为(0.5,1)，红色为(1,0.5)，看一下效果：

![](/images/issues/init.png) ![](/images/issues/after.png)

由此可见，单独设置anchorPoint，会改变view的frame。

## position

那么，作为CALayer的另一重要属性的position指的又是什么呢？position的坐标系是相对于父图层的，默认点是layer的中心点。在理解了anchorPoint的含义之后，为了做测试，分别将anchorPoint的设置成不同的点，而保持position不变，结果发现anchorPoint总是与position重合，效果如下：

![](/images/issues/chonghe.png)

由此，得出结论：**position所指的位置，是anchorPoint在父图层所在的位置，即二者会一直保持重合**。

并且经过搜索，得到如下计算公式：

```
frame.origin.x = position.x - anchorPoint.x * bounds.size.width；
frame.origin.y = position.y - anchorPoint.y * bounds.size.height；
```

通过公式，可以得到一个结论：**改变anchorPoint或者position，都会对view的frame产生影响**。通过这个公式也可以验证引言中提到的改变红色view的anchorPoint之后，动画向上偏移的原因了。红色view的坐标是确定的，所以在设置anchorPoint的同时，相应的改变下position使之也指向底部中点的位置，就能让view一直处在指定的位置，从而完美实现从底部向上展开的动画：

```
CGPoint center = self.redView.center;
CGFloat height = self.redView.frame.size.height;
self.redView.layer.anchorPoint = CGPointMake(0.5, 1.0);
self.redView.layer.position = CGPointMake(center.x, center.y+height/2);
self.redView.transform = CGAffineTransformMakeScale(1, 0);
[UIView animateWithDuration:2 animations:^{
   self.redView.transform = CGAffineTransformIdentity;
} completion:^(BOOL finished) {
}];
```

