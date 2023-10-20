---
layout: post
title: "在 dealloc 里使用 weak self 引起崩溃？"
date: 2017-07-17 14:43:15 +0800
comments: true
tags: ["iOS"]
keywords: dealloc,weak self,crash
---

> 我们都知道 weak 修饰的变量，在对象释放后，会自动置为 nil，这一机制减少了大量的野指针崩溃；可是如果你在对象的 dealloc 里使用 weak 修饰 self 会如何呢 ？答案是崩溃 ~_~ 最近我们 SDK 在集成到某个 App 之后，就遇到了这样的问题，一起看下吧！


先看下解析后的崩溃日志吧：

```objc
Thread 0 Crashed:
0   libsystem_kernel.dylib        	0x0000000182c1987c __terminate_with_payload + 8
1   libsystem_kernel.dylib        	0x0000000182c144f0 abort_with_payload + 0
2   libsystem_kernel.dylib        	0x0000000182c1446c abort_with_payload_wrapper_internal + 0
3   libobjc.A.dylib               	0x000000018267fea4 _objc_fatalv(unsigned long long, unsigned long long, char const*, char*) + 112
4   libobjc.A.dylib               	0x000000018267fdfc __objc_error + 0
5   libobjc.A.dylib               	0x0000000182693edc weak_entry_insert(weak_table_t*, weak_entry_t*) + 0
6   libobjc.A.dylib               	0x000000018269c3ac objc_storeWeak + 332
7   SOHUVideo                     	0x00000001004b5ba0 -[SharePopView setDelegate:] (SharePopView.h:31)
8   SOHUVideo                     	0x00000001003ce7c8 -[ShareViewController shareView] (ShareViewController.m:70)
9   SOHUVideo                     	0x00000001003ce2a0 -[ShareViewController dealloc] (ShareViewController.m:43)
10  UIKit                         	0x000000018a0a5960 -[UIPresentationController .cxx_destruct] + 312
11  libobjc.A.dylib               	0x000000018267ef00 object_cxxDestructFromClass(objc_object*, objc_class*) + 148
12  libobjc.A.dylib               	0x000000018268c334 objc_destructInstance + 92
13  libobjc.A.dylib               	0x000000018268c398 object_dispose + 28
14  UIKit                         	0x000000018a0a1348 -[UIPresentationController dealloc] + 64
```

如果连着线直接 debug 的话，可能控制台只输出了这样一句话，并且代码定位到使用 weak self 那一行，此时可以使用 `bt` 打印堆栈信息，打出来跟上面是一样:

```
objc[78013]: Cannot form weak reference to instance (0x7fbc9287e840) of class ShareViewController. It is possible that this object was over-released, or is in the process of deallocation.
```

接下来我们一行一行的分析崩溃日志，然后确定问题，这是函数调用栈，因此先走的方法在下面，最上面的是最后走的方法，因此我们倒着来看，从第 9 行看就好了：

```
9 : ShareViewController 的 dealloc 走了
8 : 访问了 ShareViewController 对象的属性 shareView
7 : 给 shareView 设置了代理对象
6 : 看库名知道这是走到了 objc 底层了，看方法名知道这个操作应该是要存储一个 weak 修饰的对象
5 : 将 weak entry 插入到 table 里
4 : 遇到了错误
3 : 处理致命错误
2 : 代码继续往下走，objc 交给了 system 处理
1 : 系统终结了你的程序
```

底层的错误肯定是上层调用错误引起的，因此我们只看 App 层最后一个方法调用，那就是 `[SharePopView setDelegate:]`，源码是这样写的:

```
- (void)dealloc {
    self.shareView.delegate = nil;
    self.shareView = nil;
}

- (SharePopView *)shareView {
    if (!_shareView) {
        CGFloat height = titleHeight + ShareIconViewHeightForSL * 2 + bottomTitleHeight + cancelButtonHeight;
        _shareView = [[SharePopView alloc] initWithFrame:CGRectMake(0, DeviceHeight - height, DeviceWidth, height)];
        _shareView.delegate = self;///连着线调试时，崩溃后定位到了这一行！！！
    }
    return _shareView;
}

@interface SharePopView : UIView

////这里使用的是 weak 修饰的
@property (nonatomic, weak) id<SharePopupViewDelegate> delegate;

@end
```

我看到这个代码的第一反应是，**dealloc 不应该使用 self 打点访问懒加载的属性**，我也经常重写 get 方法来懒加载，因此我对于这个很敏感，因为对象正在释放，没有创建相关属性的必要了，这里之所以崩溃，是因为创建对象之后，立马指定了 self 为代理，并且是 weak 的，从崩溃堆栈信息也能看出，设置了weak修饰的代理后，objc 底层对 self 进行了处理，在处理的时候，发现不对劲，然后就 abort 了！！

ps : 不管是使用 weak 修饰的属性，还是使用 __weak 修饰的变量，objc 都会对这个变量处理，也只有这样才能让修饰对象在释放之后，自动置空！

看到源码问题就好解决了，加个判断就行了，不要懒加载去创建，而是判断下，如果创建过就将代理置空，这样就避免了在 dealloc 里使用 weak 修饰 self 对象！

```
- (void)dealloc {
	if(_shareView){
	 	_shareView.delegate = nil;
    	_shareView = nil;
	}
}
```

问题是解决了，可是还没搞明白底层 objc 的处理流程呢，有兴趣的话接着往下看吧：[源码分析 weak 对象置空原理](/ios/2017/07/17/objc-weak-obj-imp.html).