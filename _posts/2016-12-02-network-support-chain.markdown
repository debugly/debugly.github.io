---
layout: post
title: "SLNetwork 支持链式编程"
date: 2016-12-02 22:00:59 +0800
comments: true
tags: ["千帆SDK"]
keywords: 链式编程
---

> 之前用 Masonry 写过一阵子自动布局，感觉很是方便，最大的特点是：使用block，在block块内编写约束即可，方便 update 约束，并且支持链式编程，于是我研究了下如何链式编程后，为我的网络请求也加了这个功能...

## 思考如何才能做到链式

必须满足的一个条件肯定是调用方法之后，方法的返回值调用者本身啦；如何优雅地返回自身对象呢，最简单的方式是这样？

```objc
- (SLNetworkRequest *)c_setResponseParser:(id<SLNHTTPResponseParser>)responseParser
{
    [self setResponseParser:responseParser];
    return self;
}
```

这样的话，你会发现不行，因为调用的时候太不方便了啊，你得使用中括号的方式调用，点语法也不行了，因为使用点语法的话需要有等号啊！

为了解决这个问题，我们需要解决的是：

1. 能够支持打点调用；括号不方便!
2. 不能有参数，否则造成调用的时候传参要用等号！
3. 必须有返回值；返回自身对象；
4. 能够带参数，这样才实用；

基于前 3 点可以写如下方法：

```objc
- (self)test;

//调用
self.test;
```

接下来需要做的是第4点解决传参问题，这根第2点是矛盾的！这个方法是不能支持参数的，可不支持参数方法就会显得很不实用！接下来我陷入困境，貌似一个 OC 的普通方法是无法满足这样苛刻的条件啦，然后我去 github 找了下，索性这没能难住牛叉的前辈们，使用 block 来解决，我们知道 block 的回调形式是这样的：

```objc
 ablock(@"parameter");
```

并且 block 是支持返回值的，我们要将block支持返回值和参数的特性充分利用起来；既然上面我们设计的链式编程的原型有了，所以接着改造吧，我们没有别的选择了，除了返回值之外，因为必须保证调用方式啊！于是乎 block 就有了这样一种奇特的用法，如果你是第一次见到，我觉得十有八九你会不理解的。

先看下方法声明：

```objc
- (SLNetworkRequest *(^)(NSString *method))c_Method;
```

先不考虑实现，就调用下试试：
SLNetworkRequest * req = self.c_Method(@"POST");
困惑吗？怎么传参数使用小括号了？思考下原来是这样：
self.c_Method 的作用是获取了一个block，其实就是回调 block(@"POST");
到此外部调用已经通了，我们看下怎么实现这个方法吧：

```objc
- (SLNetworkRequest *(^)(NSString *method))c_Method
{
    return ^ SLNetworkRequest * (NSString *method){
        self.httpMethod = method;
        return self;
    };
}
```

创建了一个 block ，block 的参数直接给当前对象使用，然后把当前对象作为这个 block 的返回值；block 的调用时机很巧妙，你传参的同时其实就是回调 block ！这到底是谁先想起来的呢？超赞！

## 效果

于是我干了一会的体力活，最后的结果给大家看下：

![](/images/201612/Snip20161202_20.jpg)

有木有很赞？当然也有缺点，block 后面的参数 Xcode 不会自动提示！
