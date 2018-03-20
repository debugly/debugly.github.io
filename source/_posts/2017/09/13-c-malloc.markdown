---
layout: post
date: 2017-09-13 19:06:42 +0800
comments: true
tags: [issues,iOS]
author: 慢慢
title: "C语言malloc、free、memmove"
keywords: malloc free memmove
---

在开发斗地主的语音房时，显示当前音量用的C语言实现，会分配buffer地址，最后释放buffer，使用了malloc、free和memmove等方法。
三个方法的具体使用如下：

## malloc

`void *malloc(long NumBytes);`

该函数分配了NumBytes个字节，并返回了指向这块内存的指针。如果分配失败，则返回一个空指针（NULL）。 失败的原因有多种，比如说空间不足。

## free

```void free(void *FirstByte);```

该函数是将之前用malloc分配的空间还给程序或者是操作系统，也就是释放了这块内存。对于free(p)这句语句，如果p是NULL指针，那么free对p无论操作多少次都不会出问题。如果p不是NULL指针，那么free对p连续操作两次就会导致程序运行错误。每次用free释放完空间，都将指针置为NULL，这样就避免了重复释放时程序崩溃。

## memmove

```c
void *memcpy(void *dst, const void *src, size_t count);
void *memmove(void *dst, const void *src, size_t count);
```

都是由src所指内存区域复制count个字节到dest所指内存区域。作用是一样的，唯一的区别是，当内存发生局部重叠的时候，memmove保证拷贝的结果是正确的，memcpy不保证拷贝的结果的正确，但memcopy比memmove的速度要快一些。

在使用free时，会遇到崩溃的情况，应该是遇到野指针的问题，对同一内存多次释放，所以在使用free后，应该将指针置为NULL。
