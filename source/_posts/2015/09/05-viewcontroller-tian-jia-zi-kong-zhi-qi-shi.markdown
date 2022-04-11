---
layout: post
title: "ViewController 子控制器 view 的大小问题"
date: 2015-09-05 23:00:07 +0800
comments: true
tags: ["iOS"]
toc: false
---

> * ViewContrller 管理的 view 的大小是如何确定的？
> * 不同的系统版本 View 的大小一样吗？
> * 用 ViewContrller 管理的 view 的大小如何**优雅**的控制？

这些问题是我在写项目的时候遇到的，比较有感受；我写的是一个只支持横屏的 iPad 项目，view 比较多，因此按区域划分为好几个控制器分别管理，为了确保使用期间对象的安全存在，所以要把控制器保留住，如果不保留控制器，MRC 就会内存泄露，ARC下控制器就会释放，剩下他的 view 孤军奋战，这肯定不是你想要的结果，所以常规做法是保留控制器，然后把view添加上去，改变frame；这也可能是你现在正在使用的方法吧？！这里隐含了一个条件，在这个控制器里添加子控件的时候，是按一定的大小来写的，比如，A 控制器是一个详情展示，view 大小是(500,768),那么子视图的参考平面就是{(0,0),(500,768)}了,当然也可以超出边界，但这不是讨论的范围。

<iframe width="656" height="400" src="https://www.youtube.com/embed/hfXZ6ydgZyo" frameborder="0"></iframe>

### 这种方法有什么问题？

其实这种方法可以，不过我在写某个模块时遇到了这样一个情形：

图 1 点击标签显示为图2

<img src="/images/201509/23.18.21.jpg" width="483" height="369">

图 2

<img src="/images/201509/23.18.42.jpg" width="483" height="369">

先看第一张图，很简单的九宫格布局；点击标签会出来一个浮层，样式大致是一样的，就是少了一个标签而已，所以立马想到的应该是重用了！（我可不想写两套布局）先别写哦，想下改怎么写？

按照引言部分的分析，大小已经确定了，不能重用！对于一个固执的人，没办法，就是要重用！因此考虑下怎么把这个 view 的大小变得可操控，然后子视图参考父视图而自动改变不就行了！

* 查看view创建时的大小吧，因为这个很关键，子视图要参考的：

	```objc
	 在 viewDidLoad 里打印时，不论你模拟器的是什么方向，它默认总是竖屏(Portrait) size，也就是说在横屏模式下 width 和 height 是相反的，不是你想要的；本来猜测着vc的view的宽高会跟window的有关，通过测试把window 的宽高翻转也不行，反而会带来别的问题！经过测试，在viewDidAppear时，已经修改好了，变成横屏的大小了！又测试了下系统版本，发现：
	 !!!iOS 8 已经没这个问题了，也就是说iOS 8 之后view的大小就是你的屏幕大小，而且与方向对应，比如横屏就是(1024,768)；
	 ```
问题来了，我们布局子视图的代码都写在 viewDidLoad 里，当我们在外部修改 view 的大小时 viewDidLoad 已经调用过了，因此这个外部指定的大小对于子视图来说然并卵啊！参照个毛线啊！有没有一举两得的办法，外部可以指定 子控制器 view 的大小，并且子控制器 viewDidLoad 里可以获取到指定的大小，而不是没有卵用的屏幕大小？

* 由果索因 --- view 从哪里来？

	 当控制器的 view 被访问时就会调用 loadView 方法创建，然后紧接着调用 viewDidLoad ，
	 我们创建添加子视图的代码一般也都写在这里面，因此如果 loadView 的时候 size 能正确的指定，
	 我们就可以在 viewDidLoad 参照 view 的大小，布局子视图了！先打印看看结果吧，
	 结果和 viewDidLoad 里打印的一样；所以可以从这里下手，
	 在 loadVeiw 的时候指定一个 view 的 size，
	 那么不可避免的就要加一个属性 viewSize 了！然后处理：

```objc
 - (instancetype)initWithViewSize:(CGSize)aSize
{
    self = [super init];
    if (self) {
        self.viewSize = aSize;
    }
    return self;
}

- (void)loadView
{
    [super loadView];
//    这里用了frame；用bound可能会导致origin不是0,0;导致 view 在其父视图上的位置有偏移；
    CGRect rect = self.view.frame;
    rect.size = self.viewSize;
    self.view.frame = rect;
}

- (void)setViewSize:(CGSize)viewSize
{
    _viewSize = viewSize;
    if (self.isViewLoaded) {
        CGRect rect = self.view.frame;
        rect.size = self.viewSize;
        self.view.frame = rect;
    }
}
```

* 有了上面的处理我们就可以在 viewDidLoad 以 view 的大小为参照布局子视图了！只需在外部调用的时候赋值就行了，不过需要注意，最好在外部使用到 view 之前给 viewSize 赋值，尽管已经实现了 setViewSize 方法！

```objc
// 这个 fetch 方法是根据索因找出对应控制器的，如果是刚创建的就需要添加为子控制器
- (UIViewController *)fetchAControllerwidthIndex:(NSUInteger)idx
{
  if (idx >= self.btnArr.count) {
      return nil;
  }

  BLBaseViewController *vc = self.controllers[idx];
  if ([vc isKindOfClass:[UIViewController class]]) {
      return vc;
  }else{
  	//!!!创建控制器
      vc = (BLBaseViewController *)[self createViewControllerwidthIndex:idx];
      if (vc) {
      	//!!! 访问 view 属性之前指定 view 的大小
          vc.viewSize = _contentView.bounds.size;
          //!!! 添加控制器和 view
          [self addChildViewController:vc];
          [self.contentView addSubview:vc.view];
          //!!! 这个显然就没什么用了；vc.view.frame = _contentView.bounds;
          [self.controllers replaceObjectAtIndex:idx withObject:vc];
      }
      return vc;
  }
}
```

* 这样一来我就可以参考父视图写我的子控制器了，由于页面几乎一样，所以抽取了父类，页面布局都是在父类完成的，逻辑统一处理，两个子类就剩下寥寥数行而已！

**加了一个属性，使用方法一样，还是在外部指定大小，最重要的是内部可以参考了！这达到了我预期的要求了！经过在项目中的使用，感觉比较理想！**
