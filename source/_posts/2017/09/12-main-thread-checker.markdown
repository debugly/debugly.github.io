---
layout: post
date: 2017-09-12 17:36:14 +0800
comments: true
tags: [issues,iOS]
title: "Main Thread Checker"
keywords: iOS11,Xcode9,Main Thread Checker
---

> 我的测试机升级到 iOS11 beta10 之后，发现了严重的问题，我的手机直接卡死了，只有强制关机！这是我使用 Xcode 调试抓到的日志:

```
Main Thread Checker: UI API called on a background thread: -[UIApplication applicationState]
PID: 2015, TID: 196235, Thread name: (none), Queue name: com.apple.avfoundation.videodataoutput.bufferqueue, QoS: 0
Backtrace:
4   LittleVideoDemo                     0x0000000104ca9630 -[TECaptureViewController didOutputVideoSampleBuffer:] + 92
5   LittleVideoDemo                     0x0000000104c77fcc -[FUCamera captureOutput:didOutputSampleBuffer:fromConnection:] + 416
6   AVFoundation                        0x000000018bf57f0c <redacted> + 344
7   AVFoundation                        0x000000018bf57d24 <redacted> + 100
8   CoreMedia                           0x000000018983d598 <redacted> + 260
9   CoreMedia                           0x0000000189859b70 <redacted> + 224
10  libdispatch.dylib                   0x000000010750d45c _dispatch_client_callout + 16
11  libdispatch.dylib                   0x000000010751a800 _dispatch_continuation_pop + 592
12  libdispatch.dylib                   0x000000010750f24c _dispatch_source_invoke + 1592
13  libdispatch.dylib                   0x000000010751bf30 _dispatch_queue_serial_drain + 212
14  libdispatch.dylib                   0x00000001075109a4 _dispatch_queue_invoke + 332
15  libdispatch.dylib                   0x000000010751bf30 _dispatch_queue_serial_drain + 212
16  libdispatch.dylib                   0x00000001075109a4 _dispatch_queue_invoke + 332
17  libdispatch.dylib                   0x000000010751d104 _dispatch_root_queue_drain_deferred_wlh + 424
18  libdispatch.dylib                   0x0000000107524100 _dispatch_workloop_worker_thread + 652
19  libsystem_pthread.dylib             0x000000018631efe0 _pthread_wqthread + 932
20  libsystem_pthread.dylib             0x000000018631ec30 start_wqthread + 4
2017-09-12 10:43:02.790898+0800 LittleVideoDemo[2015:196235] [reports] Main Thread Checker: UI API called on a background thread: -[UIApplication applicationState]
PID: 2015, TID: 196235, Thread name: (none), Queue name: com.apple.avfoundation.videodataoutput.bufferqueue, QoS: 0
Backtrace:
4   LittleVideoDemo                     0x0000000104ca9630 -[TECaptureViewController didOutputVideoSampleBuffer:] + 92
5   LittleVideoDemo                     0x0000000104c77fcc -[FUCamera captureOutput:didOutputSampleBuffer:fromConnection:] + 416
6   AVFoundation                        0x000000018bf57f0c <redacted> + 344
7   AVFoundation                        0x000000018bf57d24 <redacted> + 100
8   CoreMedia                           0x000000018983d598 <redacted> + 260
9   CoreMedia                           0x0000000189859b70 <redacted> + 224
10  libdispatch.dylib                   0x000000010750d45c _dispatch_client_callout + 16
11  libdispatch.dylib                   0x000000010751a800 _dispatch_continuation_pop + 592
12  libdispatch.dylib                   0x000000010750f24c _dispatch_source_invoke + 1592
13  libdispatch.dylib                   0x000000010751bf30 _dispatch_queue_serial_drain + 212
14  libdispatch.dylib                   0x00000001075109a4 _dispatch_queue_invoke + 332
15  libdispatch.dylib                   0x000000010751bf30 _dispatch_queue_serial_drain + 212
16  libdispatch.dylib                   0x00000001075109a4 _dispatch_queue_invoke + 332
17  libdispatch.dylib                   0x000000010751d104 _dispatch_root_queue_drain_deferred_wlh + 424
18  libdispatch.dylib                   0x0000000107524100 _dispatch_workloop_worker_thread + 652
19  libsystem_pthread.dylib             0x000000018631efe0 _pthread_wqthread + 932
20  libsystem_pthread.dylib             0x000000018631ec30 start_wqthread + 4
2017-09-12 10:43:03.145023+0800 LittleVideoDemo[2015:196235] current bundle is nil
2017-09-12 10:43:05.278417+0800 LittleVideoDemo[2015:195860] key = 109004    attach =
```

可以很直观的看到，问题是在子线程更新了UI导致的，修改很简单，找到对应的代码，在主线程里调用即可。查了下之后才知道，他是继 [Thread Sanitizer](https://developer.apple.com/documentation/code_diagnostics/thread_sanitizer) 之后新出的一种新的代码诊断，用来发现在子线程更新UI的问题。

# 工作原理

在 App 启动后，这个 Checker 就利用 runtime 将只能在主线程执行的方法给替换掉（这不正是那些年被我们玩坏了的AOP嘛）然后帮你检查调用是否合法，对于本身就是线程安全的方法，则不会替换，不会帮你再次审查。因为是AOP所以不用重新编译代码，持续集成工具注入这个动态库 `/Applications/Xcode.app/Contents/Developer/usr/lib/libMainThreadChecker.dylib` 就能帮你检查了[^Note]。

# 性能

会额外增加大约 0.1s 的启动时候，和 1–2% 的 CPU 开销。这 0.1s 肯定是利用 runtime 是 swizzle 方法了呗。[^footnote]因为这个开销比较小，所以当连着线，直接使用 xcode 调试时，这货会自动启动，帮你检查，听起来挺省心的[^debugger]。

参考文章：[https://developer.apple.com/documentation/code_diagnostics/main_thread_checker ](https://developer.apple.com/documentation/code_diagnostics/main_thread_checker )


[^Note]:
	> Unlike other code diagnostic tools, the Main Thread Checker doesn't require recompilation, and can be used with existing binaries. You can run it on a macOS app without the Xcode debugger, such as on a continuous integration system, by injecting the dynamic library file located at /Applications/Xcode.app/Contents/Developer/usr/lib/libMainThreadChecker.dylib.

[^debugger]: 
	> The Main Thread Checker is automatically enabled when you're running your app with the Xcode debugger.