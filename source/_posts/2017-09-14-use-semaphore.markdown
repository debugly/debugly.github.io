---
layout: post
date: 2017-09-14 9:10:42 +0800
comments: true
tags: issues
title: "使用信号量解决多线程同步问题"
keywords: gcd semaphore,多线程同步
---

> 临时帮忙去做了一期千帆小视频的SDK，大致的流程是这样的 : 录制小视频公开了两个串行队列，一个是处理摄像头回调的，一个是处理麦克风数据回调的，当用户按下录制按钮时开始采集音视频，通过代理方法拿到一帧帧的数据，当检测到音频[^1]时就创建一个编码器，开始编码，用户松手后停止编码。

# IMP

看代码之前需要说明下，**转码器的创建、开始/停止编码要在同一个线程中**，这些操作是不耗时的，为了简单就在主线程中做，代码如下:

```objc

if (self.recordEncoder) {
    NSLog(@"--xql-prepare-created");
    return;
}

WS(weakSelf);

dispatch_block_t execute = ^{
    SS(strongSelf);

    self.recordEncoder = [[TERecordEncoder alloc]initWithSavePath:videoPath muxerItem:item];
    NSLog(@"create encoder:%@",self.recordEncoder);
};

if([NSThread isMainThread]){
    NSLog(@"dispatch_main_sync");
    execute();
}else{
    NSLog(@"dispatch_sync_begin");
    dispatch_sync(dispatch_get_main_queue(), execute);
}
```

解释：

1. 如果已经创建了，不要重复创建；
2. 如果当前就在主线程，则直接执行；否则就同步到主线程执行，注意我用 dispatch_sync[^2] 函数，主要考虑到编码器必须要初始化完成后，才能开始编码，否则时序就乱了。

# Hole

测试的时候发现，如果连续狂点录制按钮（按下松开/开始录制停止录制）的话，会导致上次编码还没结束，又创建了一个编码器，这就出了问题了，解码器内部错误；编码组要求时序要正确，不能同时搞两个编码器编码，必须等上一个完成！

我就在代码里加了log，然后发现编码器确实创建了两次，但是看代码不知道哪里出了问题了，因为log显示都是在异步线程同步到主线程创建的，代理queue都是串行的。

然后我在log里加上了线程的信息，发现创建两次竟然是在不同的线程里创建的，我恍然大悟：因为数据是从两个队列里吐出来的，有可能是视频的，也有可能是音频的，虽然都是串行的，但是可能同时回调，于是这块代码就构成了竞态条件了！

那么接下来就是处理多线程同步问题了，一般都是加同步块，加锁，串行队列，信号量等等。

# Semaphore & 互斥锁

将信号量设置为1，做一把互斥锁就可以解决上面的问题了:如果是视频回调先获得了信号量，那么音频回调就需要等待，因为没有可用的信号量了，等待结束后，我们的编码器也就创建好了，创建的过程又是同步的，因此接下来就可以编码了；反之，音频回调先来了，那么视频回调时也只能等着！

代码修改如下:

```objc
init{
	self.semaphore = dispatch_semaphore_create(1);
}
```

```objc
///视频的线程和音频的线程都会走这个方法，因此做个信号量保证同步；
dispatch_semaphore_wait(self.semaphore, DISPATCH_TIME_FOREVER);

if (self.recordEncoder) {
    NSLog(@"--xql-prepare-created");
    dispatch_semaphore_signal(self.semaphore);
    return;
}
 WS(weakSelf);

dispatch_block_t execute = ^{
    SS(strongSelf);

    self.recordEncoder = [[TERecordEncoder alloc]initWithSavePath:videoPath muxerItem:item];
    NSLog(@"create encoder:%@",self.recordEncoder);
};

if([NSThread isMainThread]){
    NSLog(@"dispatch_main_sync");
    execute();
    dispatch_semaphore_signal(self.semaphore);
}else{
    NSLog(@"dispatch_sync_begin");
    dispatch_sync(dispatch_get_main_queue(), execute);
    NSLog(@"dispatch_sync_end:%@",self.recordEncoder);
    dispatch_semaphore_signal(self.semaphore);
}
```

只要进入竞态区就要获取信号量，用完之后要记得释放信号量，否则会导致线程死等！信号量使用这块完全可以封装成一把锁🔐来用！



[^1]: 进入页面后摄像头就打开了，用户点击后，立马就能拿到视频的回调，因此为了防止音频还没吐数据就开始编码，所以就去判断音频回调。

[^2]: dispatch_sync(dispatch_queue_t queue, DISPATCH_NOESCAPE dispatch_block_t block);的作用是：将通过block添加的任务派发到指定的queue去执行，这一过程将阻塞当前线程，只有当任务执行完毕后，逻辑才能接着往下走；如果当前线程和指定的queue是统一线程的话就会死锁！
