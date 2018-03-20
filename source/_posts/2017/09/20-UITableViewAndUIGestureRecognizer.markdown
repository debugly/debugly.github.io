---
layout: post
date: 2017-09-20 13:40:38 +0800
comments: true
tags: [issues,iOS]
author: 朱泽光
title: "在UITableViewCell上添加手势的问题"
keywords: UITableView,UIGestureRecognizer,cell重用
---

### 问题描述

在某一些UITableViewCell上添加长按手势。

```objc
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    SLPlaybackCommentViewCell *cell = [tableView dequeueReusableCellWithIdentifier:kSLPlaybackCommentViewCell];
    SLZoneCommentModel *comment = [self.comments sc_objectOrNilAtIndex:indexPath.row];
    [cell updateCell:comment];
    
    if([[SLLiveUserCenter sdkUid] isEqualToString:comment.Uid]) {
        UILongPressGestureRecognizer *longPressGR = [[UILongPressGestureRecognizer alloc]initWithTarget:self action:@selector(longPressGR:)];
        longPressGR.minimumPressDuration = 1;
        [cell addGestureRecognizer:longPressGR];
    }
    
    return cell;
}
```

现在，列表里某些cell添加了长按手势，这时做如下操作：多次滑动列表，然后去长按那些没有添加长按手势的cell，竟然也响应了长按手势。经分析，原来是cell重用导致的这个问题，滑动列表的过程中，那些添加了长按手势的cell被重用了，所以导致某些原本没有添加长按手势的cell也被附着了长按手势。另外，这种写法也会导致在一个cell上多次添加长按手势。

### 解决方案

如果我们只需要在UITableView的某些符合条件的cell上添加手势，我们可以直接在UITableView上添加手势：

```objc
UITableView *contentTableView = [[UITableView alloc] init];
UILongPressGestureRecognizer *longPressGR = [[UILongPressGestureRecognizer alloc]initWithTarget:self action:@selector(longPressGR:)];
longPressGR.minimumPressDuration = 1;
[contentTableView addGestureRecognizer:longPressGR];
```

然后我们去实现手势的处理方法，在处理方法里面去判断哪些cell需要做逻辑处理：

```objc
//长按手势响应方法
-(void)longPressGR:(UILongPressGestureRecognizer *)gesture
{
    if(gesture.state == UIGestureRecognizerStateBegan) {
        //获取触摸点，根据触摸点确定哪一行cell被长按了
        CGPoint point = [gesture locationInView:self.contentTableView];
        NSIndexPath * indexPath = [self.contentTableView indexPathForRowAtPoint:point];
        if(indexPath == nil) return ;
        SLZoneCommentModel *comment = [self.comments sc_objectOrNilAtIndex:indexPath.row];
        //判断该行cell是否符合条件（自己定义），如果不符合直接return，符合了再去做逻辑处理
        if(![[SLLiveUserCenter sdkUid] isEqualToString:comment.Uid]) return;
        //逻辑处理
        ...
    }
}
```

这样就解决了只在某些UITableViewCell上添加手势的需求，再也不用怕cell重用导致的添加手势相关的bug了。