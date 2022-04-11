---
layout: post
title: "关联引用的使用方法"
date: 2016-03-05 22:57:36 +0800
comments: true
tags: ["iOS"]
toc: false
---

> 实际开发中，关联引用的使用是很广泛并且实用的，比如我们熟知的 SDWebImage,下拉刷新控件，YYKit等库里均有使用；我 14 年看 EGO 下拉刷新实现的时候发现了这种用法，那是我第一次接触，这里简单的介绍下使用方法...


假如现有工程里已经有个类 **SingletonObject**，我想给他加个属性，我们知道类别是不可以加属性的，这里就要使用 Runtime 的技术了---关联引用；

1.第一步创建个类别文件，声明一个静态变量，用于被关联对象的和次对象产生关系；

```objc
static char keyAddress;

@implementation SingletonObject (association)
@end
```

2.导入头文件：#import <objc/runtime.h> ；提供getter和setter方法；

```objc
- (void)setTestAddNum:(NSNumber *)testAddNum
{
    objc_setAssociatedObject(self, &keyAddress, testAddNum, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (NSNumber *)testAddNum
{
   NSLog(@"@implementation之外的 association key:%p",&keyAddress);
   NSNumber *value = objc_getAssociatedObject(self, &keyAddress);
   return value;
}
```

3.把 getter 和 setter 方法暴漏到头文件中就行了，不过我们习惯了属性，因此我描述了一个属性；

```objc
@interface SingletonObject (association)

//通过关联引用给 SingletonObject加上一个 testAddNum 属性；
@property (nonatomic, retain) NSNumber *testAddNum;

@end
```

4.这就OK啦，测试下吧：

```objc
SingletonObject *single = [SingletonObject sharedInstance];
single.testAddNum = @(3597);
NSLog(@"---%@",single.testAddNum);
```
结果必须是打印“---3597”啦！

5.这里我写的是个单例类，不过没关系啦，单利只是保证只有一个对象而已，我给这个对象关联一个 num 对象是木有问题的！

总结
===

**关联引用+类别** 有着继承无法比拟的优势！不需要创建新类就可以增加新的属性和方法，对于已有类没有侵害，不用修改继承体系！并且使用关联引用无需管理内存，详细的内部实现介绍请看下篇博客: [浅析关联引用](/ios/2016/03/06/Objc-Associations-Advanced.html)；


测试工程的地址：[https://github.com/debugly/StudyAssociationSourceCode](https://github.com/debugly/StudyAssociationSourceCode)
