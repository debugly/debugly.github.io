---
layout: post
date: 2017-09-14 17:02:23 +0800
comments: true
tags: [issues,iOS]
author: 田顺建
title: "Core Animation 与 UIView.frame"
keywords: Core Animation,frame
---

# 引言

> 在做一次关于Core Animation的分享时，老大提出了一个很是尖锐的问题——如果让layer保持动画后的状态，那么layer对应的view的响应区域是否是动画后view展示在屏幕上的区域？带着这个问题，开启Core Animation与view.frame的讨论。

# Core Animation 与 view.frame

首先，先来看一下Core Animation对view.frame的影响。对于CALayer，有以下属性会对view的frame产生影响，包括：anchorPoint、position、transform。

首先，通过以下代码，创建了一个红色button，并且在打印出动画前button和button.layer的frame，为了便于观察动画前后的位置，还创建了一个只有黑色边框的view

```
UIButton *moveButton = [UIButton buttonWithType:UIButtonTypeCustom];
moveButton.backgroundColor = [UIColor redColor];
moveButton.frame = CGRectMake(50, 100, 40, 40);
[moveButton addTarget:self action:@selector(moveButtonClicked) forControlEvents:UIControlEventTouchUpInside];
[self.view addSubview:moveButton];
self.moveButton = moveButton;

NSLog(@"动画之前 frame: %@",NSStringFromCGRect(self.moveButton.frame));
NSLog(@"动画之前 layer frame: %@",NSStringFromCGRect(self.moveButton.layer.frame));

UIView *bgView = [[UIView alloc] initWithFrame:CGRectMake(48, 98, 44, 44)];
bgView.backgroundColor = [UIColor clearColor];
bgView.layer.borderColor = [UIColor blackColor].CGColor;
bgView.layer.borderWidth = 1;
[self.view addSubview:bgView];
```

![](http://ww1.sinaimg.cn/large/bccd6cf1ly1fjj9ginrdaj20fg04e748.jpg)

在动画结束之后，再次打印button和button.layer的frame：

```
-(void)animationDidStop:(CAAnimation *)anim finished:(BOOL)flag{
    NSLog(@"动画之后 frame: %@",NSStringFromCGRect(self.moveButton.frame));
}
NSLog(@"动画之后 layer frame: %@",NSStringFromCGRect(self.moveButton.layer.frame));
```

## anchorPoint

看一下使用Core Animation对anchorPoint做动画：

```
CABasicAnimation *positionAnimation = [CABasicAnimation animationWithKeyPath:@"anchorPoint.x"];
positionAnimation.fromValue = @0.5;
positionAnimation.toValue = @1;
positionAnimation.duration = 1;
positionAnimation.repeatCount = 1;
positionAnimation.delegate = self;
positionAnimation.fillMode = kCAFillModeForwards;
positionAnimation.removedOnCompletion = NO;
[self.moveButton.layer addAnimation:positionAnimation forKey:@"anchorPoint"];
```

动画后如下：

![](http://ww1.sinaimg.cn/large/bccd6cf1ly1fjj9pp0ahqj20fk04w749.jpg)

此时，看一下console中的关于frame的输出信息：

![](http://ww1.sinaimg.cn/large/bccd6cf1ly1fjjyw83lzqj20r0040gmw.jpg)

使用Core Animation对anchorPoint做动画前后，虽然在屏幕上看起来，button的位置发生了变化，但是从console的输出可以看出，button和button.layer的frame是没有变化的。

并且，此时点击红色button左半边，是不会触发button的响应事件的，而点击黑框中的区域，即红色button动画前的区域，是可以触发button的响应事件。

## position

接下来看一下对layer的position做CA动画，frame的变化。

```
CABasicAnimation *positionAnimation = [CABasicAnimation animationWithKeyPath:@"position.x"];
positionAnimation.fromValue = @70;
positionAnimation.toValue = @250;
positionAnimation.duration = 1;
positionAnimation.repeatCount = 1;
positionAnimation.delegate = self;
positionAnimation.fillMode = kCAFillModeForwards;
positionAnimation.removedOnCompletion = NO;
[self.moveButton.layer addAnimation:positionAnimation forKey:@"Position"];
```

动画后如下：

![](http://ww1.sinaimg.cn/large/bccd6cf1ly1fjja38drt6j20fc04umx5.jpg)

console中的关于frame的输出信息：

![](http://ww1.sinaimg.cn/large/bccd6cf1ly1fjjyw83lzqj20r0040gmw.jpg)

红色button的frame依然没有变化，并且，只有点击黑框中的区域，才能触发button的响应事件。

## transform

transform可以对layer实现旋转rotation、缩放scale、平移transition等动画。

对于**rotation**：

```
CABasicAnimation *rotationAnimation = [CABasicAnimation animationWithKeyPath:@"transform.rotation.z"];
rotationAnimation.fromValue = @0;
rotationAnimation.toValue = @(M_PI/4);
rotationAnimation.duration = 1;
rotationAnimation.repeatCount = 1;
rotationAnimation.delegate = self;
rotationAnimation.fillMode = kCAFillModeForwards;
rotationAnimation.removedOnCompletion = NO;
[self.moveButton.layer addAnimation:rotationAnimation forKey:@"Rotation"];
```

![](http://ww1.sinaimg.cn/large/bccd6cf1ly1fjjafk11x3j203s03iglj.jpg)

对于**scale**：

```
CABasicAnimation *scaleAnimation = [CABasicAnimation animationWithKeyPath:@"transform.scale"];
scaleAnimation.fromValue = @0.5;
scaleAnimation.toValue = @3;
scaleAnimation.duration = 1;
scaleAnimation.repeatCount = 1;
scaleAnimation.removedOnCompletion = NO;
scaleAnimation.fillMode = kCAFillModeForwards;
scaleAnimation.delegate = self;
[self.moveButton.layer addAnimation:scaleAnimation forKey:@"Scale"];
```

![](http://ww1.sinaimg.cn/large/bccd6cf1ly1fjjageveotj206c05g749.jpg)

对于**transition**：

```
CABasicAnimation *rotationXAnimation1 = [CABasicAnimation animationWithKeyPath:@"transform.translation.x"];
rotationXAnimation1.fromValue = @(0);
rotationXAnimation1.toValue = @200;
rotationXAnimation1.duration = 1;
rotationXAnimation1.removedOnCompletion = NO;
rotationXAnimation1.fillMode = kCAFillModeForwards;
rotationXAnimation1.repeatCount = 1;
rotationXAnimation1.delegate = self;
[self.moveButton.layer addAnimation:rotationXAnimation1 forKey:@"Translation"]
```

![](http://ww1.sinaimg.cn/large/bccd6cf1ly1fjjahahlfdj20fa04k749.jpg)

并且上述三种动画之后，console中的输出均为下图所示：

![](http://ww1.sinaimg.cn/large/bccd6cf1ly1fjjyw83lzqj20r0040gmw.jpg)

红色button的frame依然没有变化，并且，只有点击黑框中的区域，才能触发button的响应事件。

# 结论

由此得出结论，Core Animation是作用在CALayer上的，不论CALayer在动画结束前后，是否保持动画后的状态，都不会改变view和view.layer的frame以及view的事件响应区域，即**view和view.layer的frame均不会改变，并且view的事件响应区域也没有改变**。
