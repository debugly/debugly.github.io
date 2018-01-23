---
layout: post
title: "解决 NSTimer 内存泄漏问题"
date: 2015-07-14 10:38:52 +0800
comments: true
tags: iOS
---

> NSTimer 是 iOS 很常用的一个类，可以很方便的做延迟任务，也可以做周期性的轮询。不过我在写轮播图的时候却发现 Timer造成了内存泄漏！

## 背景

我在 ViewController 里使用了 Timer，结果发现 pop 掉该控制器后，他的 dealloc 却没有调用！这是个内存泄露的问题，比较严重，要尽快解决！

## 分析原因

1. 在使用 Timer 的时候，我们需要给他指定一个 Target，而 Timer 的内部会持有该 Target，原因可想而知，当 Timer 到时间之后就要触发目标方法，如果不持有 Target 的话，就可能会导致 Target 已经释放，无法达到调用目标方法的效果；在没有ARC的年代，如果用assign势必会造成野指针崩溃的，因此要持有 Target；

2. 要知道 Timer 的运行依赖于 Runloop 的驱动，即 fire 之前需要加入到 Runloop 中，但这样一来 Timer 就被 Runloop 持有了，除非调用 invalidate，才会从 Runloop 中移除；

3. 实际使用的时候，Target 就是我的 ViewController，我是在 ViewController 的 dealloc 里将 Timer invalidate 掉的；

如上所述，Target 会被 Timer 持有，Timer 会被 Runloop 持有，结果就导致了 ViewController 一直被持有着，所以在 ViewController 的 dealloc 里 invalidate 掉 Timer 是没作用的，压根不会走这个逻辑，所以当导航控制器 pop 之后，页面消失了，但是内存却没释放，这就导致了内存泄漏！

## 解决问题

如果能在 pop ViewController 之前将 Timer invalidate 掉，就可以解除 Timer 对 ViewController 的持有，让 ViewController 正常释放；

简单的做法是在控制器的 viewwilldisappear 中 invalidate，不过一般情况下就要对应的在 viewwillappear 中重新创建 Timer，这么做一般情况都是可以的，但如果 Target 不是 ViewController 就需要多写点代码了；更糟糕的是，我遇到过调用了 viewwillappear 却没调用 viewwilldisappear 就要dealloc 的情况，这时情况就很糟糕了，看来需要一个优雅的解决办法才是完全之策。

要解决这个问题，就要从打破持有上解决，Runloop 持有 Timer 估计是没办法做文章了，那能不能想办法把 Target 转移下呢? 是的，可以将自身作为 Target，然后通过 block 回调出去？外部调用使用 weak-storng dance ，不让 block
持有 target；似乎可行哦，立马行动：

```objc
+ (NSTimer *)scheduledWithTimeInterval:(NSTimeInterval)ti repeats:(BOOL)yesOrNo block:(void (^)())block
{
   return [NSTimer scheduledTimerWithTimeInterval:ti target:self selector:@selector(ql_blockInvoke:) userInfo:[block copy] repeats:yesOrNo];
}
```

把传入的block当作userinfo穿过去，userinfo是个id类型的，故而可以传递一个block过去，block是在栈上分配的，所以必须copy到堆上，这样日后回调的时候才能找到它；

```objc
+ (void)ql_blockInvoke:(NSTimer *)sender
{
    void (^block)() = sender.userInfo;
    if (block) {
        block();
    }
}
```

通过类别，我们给timer加上了这些方法；

### 使用

```objc
__weak __typeof(self)weakSelf = self;
NSTimer *timer = [NSTimer scheduledWithTimeInterval:animationDuration repeats:YES block:^{
   __strong __typeof(weakSelf)strongSelf = weakSelf;
   [strongSelf animationTimerDidFired];
}];
```

使用scheduledTimerWithTimeInterval方法创建的timer会自动加入到当前runloop中，并在interval之后fire；如果不想立马开始可以这样做：

```objc
[timer setFireDate:[NSDate distantFuture]];
```

记得在target的dealloc里把这个timer invalidate即可；

### 增加了几个方便的方法

```objc
- (void)pauseTimer;
- (void)resumeTimer;
- (void)resumeTimerAfterTimeInterval:(NSTimeInterval)interval;
```

## 完

- 开源地址：[https://github.com/debugly/QLCodes](https://github.com/debugly/QLCodes)
