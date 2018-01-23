---
layout: post
title: "千帆 SDK Issue: TimeStamp"
date: 2016-11-30 21:03:04 +0800
comments: true
tags: 千帆SDK
---

## 简介
去年我写过这么一篇文章 [《小心 unsigned 数据类型埋下坑》](/ios/2015/10/30/unsigned-type-use.html#1) 主要说明了一个问题，一定要小心不能将一个小于 0 的值赋给 unsigned 类型！今天要说的我们经常会给服务传个时间戳，客户端最好不要使用 int 类型来接受，因为很可能程序只能正常运行到 2038 年。

## 时间戳

服务器端需要一个以毫秒为单位的时间戳，同事是这么写的：

```objc
NSInteger time = [[NSDate date] timeIntervalSince1970] * 1000;
```
结果测试就报了一个bug:
> ❌ iPhone 5 出现上接口返回参数校验错误...

你如果足够细心你会有个疑问，为何 iPhone5 躺枪了？5s、6s 怎么没事，是性能问题吧? 🙄
我们来具体分析一下吧，这个 timeIntervalSince1970 方法获取的时间戳是 double 类型的，我写博客的时候是 1,480,511,599.854223;这是系统的方法，一般不会有问题，那么问题应该是 NSInteger 引起的，它不是一个新类型，是 typedef 出来的，我们查看它的定义：

```objc
#if __LP64__ || (TARGET_OS_EMBEDDED && !TARGET_OS_IPHONE) || TARGET_OS_WIN32 || NS_BUILD_32_LIKE_64
typedef long NSInteger;
typedef unsigned long NSUInteger;
#else
typedef int NSInteger;
typedef unsigned int NSUInteger;
#endif
```
简单的说就是跟你的设备有关系，设备的 CPU 字长是 64 位的话那么 NSInteger 是 long ,否则就是 int ; iOS 设备从 5s 开始以后都是 64 位的，所以测试用的 iPhone5 是32位的机器，NSInteger 其实就是 int ！我想问你天天用的 int 能够表示的最大范围是多少你知道吗？这个可以计算出来，不需要记忆的：

> int 在 iOS 里内存空间是 4 个字节，每个字节是 8 个二进制位，因此 int 类型的范围就是 2 的 32(4x8) 次幂减 1，能表示的最大值是: 4,294,967,295

所以问题就找到了，32 位机器上时间戳早就超出了 int 能够表示的最大值了，因为一直都是最大值 2147483648 ，即使使用 unsigned int 也不能放下！ 在 5s 等 64 位的机器上 NSInteger 是 long ，long 的最大范围比较大，因此不会出问题!

因此我们为毫秒级的时间戳找个合适的数据类型就行了，时间戳没有负值，因此使用 unsigned 比较合适，使用4个字节的类型不够用，需要使用8个字节的，所以我选择了 UInt64 ，它也是 typedef 出来的，不过不论什么机器，这个类型永远都是占 64 个二进制位!

```objc
UInt64 ts = [[NSDate date] timeIntervalSince1970] * 1000;
```

## 总结

- 以**秒**为单位的时间戳如果使用 int 类型可以用到 **2038** 年，使用 unsigned int 类型可以用到 **2106** 年;
- 以**毫秒**为单位的时间戳不能使用 int 类型，必须使用 64 位的类型！
	- long 类型不同字长的机器上不同，因此选择 long long 或者 UInt64 最为妥当！64 位类型的范围很大，存储时间戳足够了，不使用 unsigned 类型也可以！

下面是这个表是不同 CPU 字长各数据类型占用的长度：

| 类 型 | （32位机器）长度  | （64位机器）长度  |
|------|-----|----|
|Byte | 1 | 1 |
|char | 1 | 1 |
|short| 2 | 2 |
|int  | 4 | 4 |
|long | **4** | **8** |
|long long|  8 | 8 |

其实只有 long 这个数据类型有变化而已！
