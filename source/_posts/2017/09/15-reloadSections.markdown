---
layout: post
date: 2017-09-15 14:50:44 +0800
comments: true
tags: [issues,iOS]
author: 朱泽光
title: "IOS 刷新 UITableView 的 section 时崩溃"
keywords: UITableView,reloadSections
---

## 问题描述

在调用UITableView的如下方法时崩溃

```
NSIndexSet *indexSet=[[NSIndexSet alloc]initWithIndex:1];
[tableview reloadSections:indexSet withRowAnimation:UITableViewRowAnimationNone];
```

崩溃信息如下

```objc
*** Terminating app due to uncaught exception 'NSInternalInconsistencyException', reason: 'Invalid update: invalid number of rows in section 3.  The number of rows contained in an existing section after the update (1) must be equal to the number of rows contained in that section before the update (0), plus or minus the number of rows inserted or deleted from that section (0 inserted, 0 deleted) and plus or minus the number of rows moved into or out of that section (0 moved in, 0 moved out).'
*** First throw call stack:
(
	0   CoreFoundation                      0x0000000106ed0d4b __exceptionPreprocess + 171
	1   libobjc.A.dylib                     0x0000000105d5421e objc_exception_throw + 48
	2   CoreFoundation                      0x0000000106ed4e42 +[NSException raise:format:arguments:] + 98
	3   Foundation                          0x00000001058e966d -[NSAssertionHandler handleFailureInMethod:object:file:lineNumber:description:] + 195
	4   UIKit                               0x00000001094c377d -[UITableView _endCellAnimationsWithContext:] + 17558
	5   UIKit                               0x00000001094dac43 -[UITableView _updateSections:updateAction:withRowAnimation:headerFooterOnly:] + 487
	6   SohuLiveDemo                        0x0000000101a91ad3 __40-[SLAnchorsTabView loadRecommendAnchors]_block_invoke + 771
	7   SohuLiveDemo                        0x0000000101ada0cb __50-[SCNetworkService(Maker) sendRequest:completion:]_block_invoke + 155
	8   SohuLiveDemo                        0x0000000101942778 __39-[SCNetworkRequest doFinishWithResult:]_block_invoke_2 + 168
	9   CoreFoundation                      0x0000000106e600b2 __53-[__NSArrayM enumerateObjectsWithOptions:usingBlock:]_block_invoke + 114
	10  CoreFoundation                      0x0000000106e5ff42 -[__NSArrayM enumerateObjectsWithOptions:usingBlock:] + 194
	11  SohuLiveDemo                        0x00000001019425e2 __39-[SCNetworkRequest doFinishWithResult:]_block_invoke + 194
	12  libdispatch.dylib                   0x000000010b8f1978 _dispatch_call_block_and_release + 12
	13  libdispatch.dylib                   0x000000010b91b0cd _dispatch_client_callout + 8
	14  libdispatch.dylib                   0x000000010b8fb8a4 _dispatch_main_queue_callback_4CF + 406
	15  CoreFoundation                      0x0000000106e94e49 __CFRUNLOOP_IS_SERVICING_THE_MAIN_DISPATCH_QUEUE__ + 9
	16  CoreFoundation                      0x0000000106e5a37d __CFRunLoopRun + 2205
	17  CoreFoundation                      0x0000000106e59884 CFRunLoopRunSpecific + 420
	18  GraphicsServices                    0x000000010c7a2a6f GSEventRunModal + 161
	19  UIKit                               0x0000000109384c68 UIApplicationMain + 159
	20  SohuLiveDemo                        0x000000010031b3ef main + 111
	21  libdyld.dylib                       0x000000010b96768d start + 1
)
libc++abi.dylib: terminating with uncaught exception of type NSException
```

## 问题分析

崩溃信息描述大概是这个意思，这个刷新无效，具体指section 3的行数无效。下面给出了具体的原因，section 3刷新前是1行，刷新后变成了0行，而在reloadSections的set里边又没有包含要刷新的section 3，故表在刷新的时候就报错了。这个问题该如何解决呢？

1. 我们在局部刷新的时候，若表数据改变了，一定要把所有改变的区，或者是行都包含进去，才能避免崩溃。
2. 若section的row是动态变化的，考虑直接使用reloadData，可避免崩溃。
