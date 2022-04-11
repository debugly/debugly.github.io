---
layout: post
title: "小心 unsigned 数据类型埋下坑"
date: 2015-10-30 21:59:14 +0800
comments: true
tags: ["iOS"]
---

Introduction
============

> 今天来说下使用 unsigned 数据类型时遇到的坑，也许这个很不起眼，但是有的时候她会坑了你的，如果你不信就来试试下面这道题，如果做对了那么说明你很细心，足够优秀，也不用继续看我的博客了，当然这也不排除是由于我提前说明了注意点使你细心...

# 小试牛刀

习惯性的说下故事的背景，无缘无故的剧情我不喜欢，也不会是我入戏，作为一个 coder ，就像演员一样，你若想很出色地展示出你的演技就要入戏很深...

> 项目中某处逻辑需要评估磁盘剩余空间，以便做出决策是否继续任务，故而同事写了类似如下的逻辑：

```objc
- (BOOL)hasEnoughDiskSpace {
    //获取磁盘剩余空间；
    UInt64 validFreeSpaceSize = [self getTotalFreeSpace];
    //此次任务需要的总空间；
    UInt64 taskTotalSize = self.totalSize;
    //此次任务已经完成的空间；
    UInt64 downloadedSize = self.finishedSize;

    return ((validFreeSpaceSize - (taskTotalSize - downloadedSize)) > 0);
}
```

# 题目剖析

不用说上面的代码肯定是存在问题的，下面是我改过之后的代码，对比下也没有多少不同，按数学运算来看没什么不一样，你说是吗：

```objc
- (BOOL)hasEnoughDiskSpace {
    //获取磁盘剩余空间；
    UInt64 validFreeSpaceSize = [self getTotalFreeSpace];
    //此次任务需要的总空间；
    UInt64 taskTotalSize = self.totalSize;
    //此次任务已经完成的空间；
    UInt64 downloadedSize = self.finishedSize;

    return (validFreeSpaceSize > (taskTotalSize - downloadedSize));
}
```
看到这里你能明白问题出在哪了吗？如果你还是疑惑的话，或许你该去复习下 C 语言的数据类型了，特别是 有没有符号这一说；C 语言基础数据类型默认是有符号的，也就说有正负之分，无符号意味着都是非负数；上面之所以使用无符号是因为空间的大小不会存在负的，还有就是使用无符号能够表示的值就是有符号的二倍！

简单了解了 unsigned 之后，就来仔细看这个表达式吧：

* 当 validFreeSpaceSize 大于 (taskTotalSize - downloadedSize) 时，确实没有问题；
* 当 validFreeSpaceSize 等于 (taskTotalSize - downloadedSize) 时，也没有问题；
* 当 validFreeSpaceSize 小于 (taskTotalSize - downloadedSize) 时，问题就来了，由于是无符号数据类型，所以我们认为的结果会是一个负值，其实却是一个非常大的正值！因此当没有足够磁盘空间的时候也检查不出来，说白了这个检查没有作用，永远返回 YES！

经过这样 (validFreeSpaceSize > (taskTotalSize - downloadedSize)) 的比较其实就避免了刚才小于判断出错问题；

# 后记

对于 unsigned 这种数据类型来说是需要的，因为他能够表示值的空间大了一倍，诸如磁盘空间这样的场景使用有符号类型也是一种浪费，因为变量占用着同样大小的空间，却不能够表示那么大的范围！因此使用时切记她带来的非负性就好了，不要让结果和 0 比较！

C 语言的数据类型长度不是固定的，跟机器字长有关系，我也记不太清；不过 Java 是跨平台的，长度固定，这个是我记忆中的 Java 数据类型长度，可以简单看下：

| 类 型 | 长 度 |     值的范围      | 无符号值的范围 |
|------|:-----:|:---------------:|:------------:|
|Byte |  1 | -2(7)-1 ~ 2(7)   | 0 ~ 2(8)-1 |
|char |  2 | -2(15)-1 ~ 2(15) | 0 ~ 2(16)-1|
|short|  2 | -2(15)-1 ~ 2(15) | 0 ~ 2(16)-1|
|int  |  4 | -2(31)-1 ~ 2(31) | 0 ~ 2(32)-1|
|long |  8 | -2(63)-1 ~ 2(63) | 0 ~ 2(64)-1|
