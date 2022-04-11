---
layout: post
title: Mac 开发 Tips
date: 2019-05-31 16:23:23
tags: ["Mac开发"]
---

> 忙了大概 2 个月了，基本 9116 的节奏，现在临近封板了，赶紧把最近使用的一些小技巧总结下。

## 监听 ESC 键按下

```
#import <Carbon/Carbon.h>

id eventMonitor = [NSEvent addLocalMonitorForEventsMatchingMask:NSKeyDownMask handler:^NSEvent * _Nullable(NSEvent * _Nonnull theEvent) {
        if ([theEvent keyCode] == kVK_Escape){
            NSLog("ESC key down");
        }
        return theEvent;
    }];
///dealloc 里记得移除
[NSEvent removeMonitor:eventMonitor];
```

## 商店屏幕快照和预览图尺寸

```
https://help.apple.com/app-store-connect/#/devd274dd925
https://help.apple.com/app-store-connect/#/dev4e413fcb8

屏幕快照要求：

最多 10 张屏幕快照，下列分辨率哪个都行

1280 x 800 像素

1440 x 900 像素

2560 x 1600 像素

2880 x 1800 像素

预览要求
最多 3 张 App 预览图，尺寸为 1920 x 1080 像素（16:9 宽高比）

```

<!--more-->

## 窗口最小化后如何还原

直接调用 window 的 orderFront 是不好使的，其实 window 进入了 miniaturize 模式了，只要调用 deminiaturize 方法就行了:

```
http://www.unixresources.net/faq/10225673.shtml

if([aWindow isMiniaturized])
{
   [aWindow deminiaturize:self];
}

```

## 鼠标 Hover 时指针变成小手

创建 NSTrackingArea 对象时，options 传入 **NSTrackingCursorUpdate** ；然后设置成想要的指针类型就好了。通过 mouseEnter 和 mouseExit 实现会有bug，有的时候鼠标进入了指针却没能改变！

```
- (void)cursorUpdate:(NSEvent *)theEvent
{
    [[NSCursor pointingHandCursor] set];
}
```

## 模拟鼠标单击

测试发现，会弹出一个辅助功能控制电脑的弹框，默认是不允许的，所以项目中并没有用这个方案。

```
https://stackoverflow.com/questions/12123150/how-to-programmatically-simulate-a-mouse-click-without-moving-mouse-in-cocoa

//Compile instructions:
//
//gcc -o click click.c -Wall -framework ApplicationServices
#include <ApplicationServices/ApplicationServices.h>
#include <unistd.h>
int main(int argc, char *argv[]) {
 int x = 0, y = 0, n = 1;
 float duration = 0.1;
 if (argc <3) {
 printf("USAGE: click X Y [N] [DURATION]n");
 exit(1);
 }
 x = atoi(argv[1]);
 y = atoi(argv[2]);
 if (argc> = 4) {
 n = atoi(argv[3]);
 }
 if (argc> = 5) {
 duration = atof(argv[4]);
 }
 CGEventRef click_down = CGEventCreateMouseEvent(
 NULL, kCGEventLeftMouseDown,
 CGPointMake(x, y),
 kCGMouseButtonLeft
 );
 CGEventRef click_up = CGEventCreateMouseEvent(
 NULL, kCGEventLeftMouseUp,
 CGPointMake(x, y),
 kCGMouseButtonLeft
 );
//Now, execute these events with an interval to make them noticeable
 for (int i = 0; i <n; i++) {
 CGEventPost(kCGHIDEventTap, click_down);
 sleep(duration);
 CGEventPost(kCGHIDEventTap, click_up);
 sleep(duration);
 }
//Release the events
 CFRelease(click_down);
 CFRelease(click_up);
 return 0;
}
```