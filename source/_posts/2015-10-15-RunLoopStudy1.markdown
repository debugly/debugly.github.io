---
layout: post
title: "RunLoop Study (一)"
date: 2015-10-15 22:17:57 +0800
comments: true
tags: iOS
---

## 前言

很久之前就想写一下 RunLoop --- iOS里一个很重要的概念；最近一直很忙，一拖再拖，提到拖延 --- 有点像下面要说的定时器了，可以无节操的一直拖，无上限了！O(∩_∩)O~~ 终于轮到定时器了，尽管很累，还是要坚持 run 起来！这是 RunLoop 相关文章的第一篇，认真写，开个好头吧！

我第一次听到的应该是消息事件循环，因为使用了autorelease,所以就想知道这个被延迟释放的对象到底什么时候
会释放，被告知这个消息事件循环结束后，这个真不理解...

还有，使用了定时器，定时更新一些UI，结果在滑动scrollview的时候定时器停止了，网上
搜了下，修改下runloop的mode就行了，这个也不知到为啥...

还有对一些现象的观察：我们知道depatch一个子线程之后，这个线程执行的任务完成后，
就被销毁了，如果不想被销毁，而是周期性的做一些事情，那就得写个while循环或者递归了，
然后在加上sleep；就能像timer周期性的循环做一件事；

反思主线程：怎么感觉主线程就是一直存活的呀，app可以随时响应我们的操作，你可以
停一会，也可以持续操作，主线程和分线程怎么就不一样了呢，为什么主线程能一直存活？
查看代码之后，也没有发现哪里有while循环啊，甚至于递归，
此事必有蹊跷，元芳你怎么看？

我的假设：假如系统隐式地创建了一个循环，那么主线程就能一直跑了，而不会运行之后就停止了。当初学java的时候，曾经写过一个猜大小的小游戏，程序运行后，会随机生成一个1-1000的整数，然后一直猜，如果猜的不对就输出你猜大了或者猜小了，并且继续等待输入，猜对时提示恭喜猜对了，是否继续玩游戏？编写这个小游戏，主要是用两个while循环（嵌套），外部的while循环一次，表示游戏玩了一局，内部的while循环一次，表示猜了一次；不过玩游戏的时候只能一直等待输入，线程阻塞到这了！所以我们app的主线程不可能是一个简单的while循环就能搞定的，要做到不阻塞就需要一种机制，让app有事要做的时候就干活，没事了就睡觉...

## NSRunLoop 的简单介绍

这个类在 Foundation framework 里，十分简单，这是他的所有方法了，这个类提供了部分 runloop 的接口，可以方便的获取到她，或者添加定时器或者端口等；

```objc
//获取所在线程的 runloop
+ (NSRunLoop *)currentRunLoop;
//获取主线程的 runloop
+ (NSRunLoop *)mainRunLoop NS_AVAILABLE(10_5, 2_0);
//当前输入类型
@property (nullable, readonly, copy) NSString *currentMode;
//获取core foundation 对象，实现更多的功能，比如添加监听；
- (CFRunLoopRef)getCFRunLoop CF_RETURNS_NOT_RETAINED;
//把定时器加入到runloop
- (void)addTimer:(NSTimer *)timer forMode:(NSString *)mode;

- (void)addPort:(NSPort *)aPort forMode:(NSString *)mode;
- (void)removePort:(NSPort *)aPort forMode:(NSString *)mode;

- (nullable NSDate *)limitDateForMode:(NSString *)mode;
- (void)acceptInputForMode:(NSString *)mode beforeDate:(NSDate *)limitDate;

@end

@interface NSRunLoop (NSRunLoopConveniences)

- (void)run;
- (void)runUntilDate:(NSDate *)limitDate;
- (BOOL)runMode:(NSString *)mode beforeDate:(NSDate *)limitDate;

@end

@interface NSRunLoop (NSOrderedPerform)

- (void)performSelector:(SEL)aSelector target:(id)target argument:(nullable id)arg order:(NSUInteger)order modes:(NSArray<NSString *> *)modes;
- (void)cancelPerformSelector:(SEL)aSelector target:(id)target argument:(nullable id)arg;
- (void)cancelPerformSelectorsWithTarget:(id)target;

@end
```

WARNING

```objc
The NSRunLoop class is generally not considered to be thread-safe and its methods should only be called within the context of the current thread. You should never try to call the methods of an NSRunLoop object running in a different thread, as doing so might cause unexpected results.
```

 - 其中 currentRunLoop ，current 指代的线程！我们可以把 runloop 当做线程的基础组件来对待；因为没有她的话，线程运行就会遇到一些问题，或者要费事些，比如有些线程可以让操作系统唤醒睡眠的线程以管理到来的事情，而 runloop 就是这些线程的基础；

 - runloop 是一种可以在一个周期内调度任务并处理到来的事件的循环；也就是说循环是有周期的（这不是废话么），具备调度和处理事件的能力，这是了不起的；

## RunLoop 和线程的关系

- 每个线程最多只有一个 runloop，创建一个线程时，默认没有；当调用获取方法的时候懒加载创建；主线程系统默认创建了，具体何时创建的不知道，或许系统在某个时候（当然是app启动完毕之前）调用了获取方法，这样就创建好了，换句话说在 applicationDidFinishLaunching 之后你就可以访问了！

- 分线程开始运行 runloop 之前，要添加输入源或者定时器，要不然 runloop 会立刻退出！

- runloop 为我们提供了与线程交互的能力，视情况而定，也许根本就用不到她；最常用的可能就是牵涉到网络交互的时候，这个最好的教程当然是 matt 大神写的 AFNetWorking 啦；有兴趣的看下源码吧，日后有时间我也会分享下阅读第三方框架的心得；

- runloop 的作用在于当有事情（事情来自于下文的输入源，与 Mode 也有关系）要做的时侯他就去唤醒当前的线程开始工作，没事情可做就让线程去休眠；


## RunLoop 的输入源

runloop 从输入源和定时器这两类源中接收事件；输入源(通常是基于端口或者自定义的)会异步向应用发送事件，主要差别在于内核会自动发出基于端口的源信号，而自定义源就需要从不同的线程中手动发出。可以通过实现与 CFRunLoopSourceRef 相关的几个回调函数来创建自定义输入源。

* 定时器，这个是 iOS 开发中经常用到的；你对他了解多少？定时器是基于时间的通知，他为线程提供了一种可以在未来某个时间执行某个任务的机制；他是同步发出的，并且与特定的 mode （就是把定时器添加进 runloop 的那个 mode）有关，如果没有监控特定的 mode ，那么事件就会被会略掉，当然线程也不会收到通知的，直到 runloop 运行在相应的 mode 下为止；

  定时器的触发有必要解释下，我们可能知道定时器的定时间隔不是那么严格的，也就说可能会有偏差！定时器调度是基于设定的开始时间的而不是实际触发时间的！这句话可能不好理解，慢慢讲给你听吧，如果到达定时器触发时间之前有别的任务没有完成，那么就会向后拖延定时器的触发时间，如果一直拖延，加入0.5s应当执行的，拖延到了1.1s的时候可以执行了，那么上次的那个就被忽略了，如果是刷新 UI，那么效果上就是卡顿下；紧接着下一次循环触发时间不是 1.1s + 0.5s， 而是0.5s *3 = 1.5s;这下明白了吧，是基于你设定开始的那个时间的，如果中间拖延了，就会被忽略过去！并且这个延迟是没有上限的！

> 注：使用定时器是否需要手动添加到 runloop 取决于创建的方式，通过阅读 [NSTimer Class Reference](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Classes/NSTimer_Class/#//apple_ref/occ/clm/NSTimer/timerWithTimeInterval:invocation:repeats:) 得到的结论：
>
   - 1.使用 initWithFireDate 或者 timerWithTimeInterval 这些方式创建的定时器必须手动加入到runloop ；
>
   - 2.使用 scheduledTimerWithTimeInterval 创建的则是默认加入到当前runloop的；

* 也可以为 runloop 添加监听者，可以在 runloop 执行过程中的某个时候收到回掉，比如进入或者退出、睡眠、唤醒、处理输入源或者定时器之前等；这个就需要使用 core Fundation 里的 api 了（CFRunLoopObserverRef 等）；Fundation 提供的 api 是对  core Fundation 的封装，因此你也能找到添加定时器和 source 的方法: CFRunLoopAddTimer / CFRunLoopAddSource ;

总的来说就是：**如果你有事情想让 runloop 为你管理线程去完成，那么你选取一种输入源添加进 runloop，runloop就回去监测这些输入源有没有事情要做**；


## RunLoop 和 Mode

* mode 有几种？阅读过 [NSRunLoop Class Reference](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Classes/NSRunLoop_Class/index.html#//apple_ref/occ/instm/NSRunLoop/addTimer:forMode:) 文档之后见到了两种，NSDefaultRunLoopMode，NSRunLoopCommonModes;

其实不止两种呢，在别的地方也能找到：[UIApplication Class Reference](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIApplication_Class/)

```objc
Run Loop Mode for Tracking
Mode while tracking in controls is taking place.

Declaration
SWIFT
let UITrackingRunLoopMode: String
OBJECTIVE-C
UIKIT_EXTERN NSString *UITrackingRunLoopMode;

Constants
UITrackingRunLoopMode

The mode set while tracking in controls takes place. You can use this mode to add timers that fire during tracking.

Available in iOS 2.0 and later.
```
这种模式发生在 tracking 时，现在学习的 UIKit 中的控件貌似只有 scrollview 有tracking；

- mode 有什么用途？我们通过阅读上文已经知道了，runloop 可以调度线程去完成我们要做的事情，先看两个场景吧：

  - 1.微信客户端中的聊天界面而言，当滑动聊天页面的时候，你发的动画就会暂停，手松开后就会动起来，这样做的好处就是使得滑动列表更加流畅；

  - 2.还有一些相反的场景，就是在滑动列表的时候我们也想让我们的倒计时在一直跑秒而不是停下来；

 这些都是可以通过 mode 来配置的，在不同的场景下 runloop 运行在不同的 mode 下；可以因此添加 timer ，port 时都要指定 这个源的 mode；这样 runloop 才能知道当前所处的 mode 是不是要处理输入源的事情！相当于对输入源分组，这个分组比较特殊，输入源可以同时属于不同的 mode；比如场景1设置为 DefaultRunLoopMode 就行了；对于场景2设置为DefaultRunLoopMode还不行，这会导致在滑动列表的时候停止更新UI，因为 滑动的时候 runloop 处于 UITrackingRunLoopMode ，不同于 DefaultRunLoopMode！因此到了定时器触发的时间了，却没有调用 target 的方法，所以要把 定时器加入到 UITrackingRunLoopMode 才行，这样滑动的时候也能触发定时器了！

> 说了半天还未提及 NSRunLoopCommonModes 这个 mode ；有人把她称之为伪模式，因为他代表了所以模式，可以说不是一种真正的模式！这些模式名称都是字符串，如果你对于 mode 不理解的话，你大可把他们都当做 **枚举** 而 commonModes = (default + uitacking + other...);并且每个 mode 都映射一个数组，数组里放的是添加的输入源，当然可以把输入源放到多个数组里啦；这样 runloop 运行在不同的 mode 下时就去找不同的数组，去完成任务，相信我这样通俗的说你会明白的！

------------

这是 RunLoop 学习的第一篇博客，随着我学习的加深也会继续分享，我本人也很期待自己能耐心写作，毕竟写作的过程是枯燥的😢O(∩_∩)O~~
