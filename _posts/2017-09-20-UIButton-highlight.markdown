---
layout: post
date: 2017-09-20 18:27:03 +0800
comments: true
tags: ["iOS","issues"]
author: 吴尚
title: "UIButton选中状态下点击触发高亮的问题"
keywords: UIButton,Highlighted,Selected
---

在写发射彩蛋红包页面时，需要实现这样一个功能，即有两只蛋，一只彩蛋，一只金蛋，点击其中一个会变大，另外一个会变小，具体效果如下图所示：

![](/images/issues/redegg.jpg) 
![](/images/issues/redegg2.jpg)

具体的实现思路是设置两只蛋的Normal状态和Selected状态下的图片，一开始将彩蛋设为选中态，将金蛋设为正常态，然后在各自的点击事件中将两个按钮的状态都取反，这样就可以实现大小的切换了。具体代码如下：

```objc
- (void)clickGoldEgg:(UIButton *)sender{
    if(sender.selected){  return;  }
    sender.selected = !sender.selected;
    self.colorEggBtn.selected = !_colorEggBtn.selected;
  }
```

但是这样写会出现问题，就是蛋蛋在点击之后高亮状态下的显示问题。
我们知道，按钮有三种状态：UIControlStateNormal（正常）、UIControlStateHighlighted（高亮）、UIControlStateSelected（选中）。 在正常状态点击时不松手会触发高亮状态，调用系统方法（setHighlighted：），并显示为事先设置的高亮状态图片，如果之前没设置，默认显示效果为在原图片下加一层灰色。这个问题好解决，如果不想显示高亮状态，只需要将高亮状态下的图片设置为和正常状态下的一样就好了嘛：

```objc
 [goldEgg setImage:[UIImage imageNamed:@"goldegg"] forState:UIControlStateNormal];
 [goldEgg setImage:[UIImage imageNamed:@"goldegg"] forState:UIControlStateHighlighted];
```

然而在变成选中状态之后，点击彩蛋，还是会有highlighted的状态，而且这次显示的图片是小蛋而不是大蛋！
你们可以自行脑补一下效果，一只大金蛋突然变成个小蛋，一松手又变成个大的？！ 什么鬼！

天真的我以为是highlight状态设置的图片是小蛋的原因，马上改成大蛋试下：

```objc
[goldEgg setImage:[UIImage imageNamed:@"goldeggpicked"] forState:UIControlStateHighlighted];
```

没有任何变化！！！ 看来选中状态时的点击并不是hightlighted状态啊，那是什么状态呢？
又是通过上网找资料，我才发现，要选中时高亮是这个状态 **UIControlStateSelected | UIControlStateHighlighted** ，只要将这个状态下的图片设置成和选中状态下的一样就好啦！

```objc
[goldEgg setImage:[UIImage imageNamed:@"goldeggpicked"] forState:UIControlStateSelected];
[goldEgg setImage:[UIImage imageNamed:@"goldeggpicked"] forState:UIControlStateSelected|UIControlStateHighlighted];
```

问题完美解决，金蛋彩蛋可以愉快切换啦！

虽然是个小问题，还是记录下和大家分享一下。万一也遇到类似问题，不用担心掉坑啦！





