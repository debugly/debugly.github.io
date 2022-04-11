---
layout: post
date: 2017-09-15 16:07:58 +0800
comments: true
tags: ["iOS","issues"]
author: 姬艳
title: "实现一个图片 360 度不停旋转"
keywords: block的方式,CABasicAnimation方式
---

> 我想要实现一个图片不停的360度旋转的动画效果，类似于加载时候不停的转圈圈，通过网上查找资料，试用了两种方法：

## UIView 动画递归的方式

```objc
- (void)startAnimation  
{  
    CGAffineTransform transform = CGAffineTransformMakeRotation(imageviewAngle * (M_PI / 180.0f));  
      
    [UIView animateWithDuration:0.01 delay:0 options:UIViewAnimationOptionCurveLinear animations:^{  
        imageView.transform = transform;  
    } completion:^(BOOL finished) {  
        imageviewAngle += 10; 
        [self startAnimation];  
    }];  
} 
```

点击之后，我调用了这个方式让图片不停旋转，但是不断地点击就会导致图片越转越快，原因是这个函数是递归的，每点击一次就会增加递归，使之角度增加10，之前点击触发的递归调用并没有出口，因此多次点击后imageviewAngle就在好几个递归里一直累加，点击次数越多，累加的频率也就越快，所以图片就会转的越来越快，于是使用了下面的方法。

## CABasicAnimation 方式

```objc
CABasicAnimation* rotationAnimation;  
rotationAnimation = [CABasicAnimation animationWithKeyPath:@"transform.rotation.z"];  
rotationAnimation.toValue = [NSNumber numberWithFloat: M_PI * 2.0 ];  
rotationAnimation.duration = duration;  
rotationAnimation.cumulative = YES;  
rotationAnimation.repeatCount = repeat;  
  
[_loadingView.layer addAnimation:rotationAnimation forKey:@"rotationAnimation"]; 
```

这种方式不会出现不断点击图片越转越快的问题，移除掉动画就能停止：

```
[_loadingView.layer removeAnimationForKey:@"rotationAnimation"];
```