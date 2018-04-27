---
layout: post
date: 2017-10-20 09:40:21 +0800
comments: true
tags: [issues,iOS]
author: 姬艳
title: "使用 CAGradientLayer 实现渐变遮罩"
keywords: locations,CAGradientLayer
---

> 在做歌词显示的时候需要实现文字渐变消失的效果，向同事请教后知道了一个实现方法：使用 **CAGradientLayer** 来做，但是对CAGradientLayer 的属性设置不是很明确，所以进行了总结，现将代码贴出来并做解释说明，方便大家使用：

## 实现效果

![](/images/201710/10202.png)

## 实现代码
  

```objc
- (void)addLayerToView:(UIView *)view width:(CGFloat)width {
    CAGradientLayer *gradientLayer = [CAGradientLayer layer];
    gradientLayer.frame = CGRectMake(0, 0, width, view.bounds.size.height);;
    gradientLayer.colors = @[(__bridge id)[UIColor clearColor].CGColor,(__bridge id)[UIColor blackColor].CGColor,(__bridge id)[UIColor blackColor].CGColor,(__bridge id)[UIColor clearColor].CGColor];
    gradientLayer.locations = @[@(0),@(0.1),@(0.9),@(1)];
    gradientLayer.startPoint = CGPointMake(0, 0);
    gradientLayer.endPoint = CGPointMake(0, 1);
    CGRect frame = view.bounds;
    
    UIView *gradientView = [[UIView alloc] initWithFrame:frame];
    [gradientView.layer addSublayer:gradientLayer];
    view.maskView = gradientView;
}
```

## CAGradientLayer属性设置

上面代码主要涉及CAGradientLayer的四个属性colors locations startPoint endPoint，colors是颜色分配，locations是颜色分割线，startPoint为起始点，endPoint为终止点。

![](/images/201710/10201.png)

从上图可以看出，locations里面的值代表颜色的分界线，如果想要实现view的上下端都有渐变消失的效果，需要四个颜色和四个颜色分割线，也就是从0到0.1是clearColor -> blackColor，从0.1-0.9不变色所以是blackColor-> blackColor，从0.9-1是blackColor -> clearColor。。。这样就实现了只有显示文字的view的最上端和最下端出现渐变效果，如上图所示。
