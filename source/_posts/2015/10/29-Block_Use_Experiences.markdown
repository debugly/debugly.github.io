---
layout: post
title: "使用 Block 的一些技巧和心得"
date: 2015-10-29 21:43:10 +0800
comments: true
tags: iOS
---

Introduction
============

项目中大量使用了 Block，今天无意间有了新的用法，不同往常的一般使用方法，使得编程又有了新的乐趣！想了一下，第一次写 Block 应该是两年前了，这么长时间并没有总结过，今天顺便总结下使用 Block 的场景 ...

# Block的一般使用场景

 以下场景均是个人理解，词汇也是个人命名，理解就好了：

- 完成事情的回掉；方法一般可以附加一个 completion handler 参数作为完成的回掉，AFNetworking 里网络请求好多都是这种场景了，比如这个方法，GET 请求成功后就会回调 success ，失败则回调 failure，并且可以带有 **参数** （ps：这个以后会有大用处）！

```objc
- (NSURLSessionDataTask *)GET:(NSString *)URLString
                   parameters:(id)parameters
                      success:(void (^)(NSURLSessionDataTask *task, id responseObject))success
                      failure:(void (^)(NSURLSessionDataTask *task, NSError *error))failure;
```
- 下发任务的区块；方法附带一个获取任务的 block,我们把需要处理的任务放到里面即可，利用 GCD 派发任务，做动画等等都是这样做的，由于是单纯的任务，所以一般不需要参数：

```objc
void dispatch_async(dispatch_queue_t queue, dispatch_block_t block);

[UIView animateWithDuration:0.25 animations:^{
   //do your animates
}];

[NSBlockOperation blockOperationWithBlock:^{
 //your task       
}];

```

- 权利下放；如果做一件事情的时候，我们不知道该如何拍板，抉择的时候，就可以把这个权利下放给调用者，这样的代码就显得很灵活；

```objc
[needSortArray sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
      return NSOrderedAscending;//your power!
}];
```
- 封装代码块；如果你的逻辑比较复杂，需要判断很多种情况，各种 if else 嵌套；很多个 else 的地方都调用同样的代码块，则可以考虑使用 block 块；我觉得你应该也遇见过这种情况！至少我见过别人这么写过，结果就是同样的代码块几十行，在一个方法里写了两次，其实不用 block 也行的，抽取一个方法或许也行，使用 block 的好处，大概就是可以捕获了！如果代码块是一个方法，那么可能就没必要使用 block 来封装了，不过如果是好多行的逻辑，使用 block 封装下很是比较好的！

```objc
NSString* (^callback)(NSArray *needSortArray) = ^(NSArray *needSortArray){
        [needSortArray sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
            return NSOrderedAscending;//your power!
        }];
        return [needSortArray componentsJoinedByString:@"|"];
  };
  BOOL A,B,C;
  NSArray *needArr = @[@"A",@"C",@"D",@"F",];
  if (A) {
      if (B) {
          if (C) {
              [self handleArr:needArr];
          }else{
              callback(needArr);
          }
      }else{
          [self handleArr2:needArr];
      }
  }else{
      callback(needArr);
  }
```

从技术层面上看，基本上这些使用代理也可以完成，但是绝对没有使用 block 来的优雅！我是一个喜欢使用的 block 的 coder，因为觉得编写代理很麻烦，代码不是那么的直观；这里只是简单总结了下平时我经常用到的场景，当然还有别的很多场景；希望你能发邮件给我，补充这里来；

# Blokc 高级用法

说高级用法可能会有些夸张，不过这确实不是很常用，因为常用的场景上面已经说过了，所以这里为了区分就是用了高级这个词汇！下面就来见识下我所谓的 “高级” 吧，我看问题喜欢有上下文，因此先看下场景：

```objc
///添加一个下载任务
- (void)addDownloadTask:(id)task
            handleError:(BOOL(^)(NSInteger errCode))errHandle
             completion:(void(^)(id task , NSInteger errCode))comBlock{
//    1.generate err code;
    NSInteger errCode = 12432;
//    2.check error;
    if (errHandle) {
        if(errHandle(errCode)){
            //下放权利，调用者灵活判断后 add
            [self doAdd:task];
        }
    }else{
        // 默认的判断条件   3.add
        [self doAdd:task];
    }
}

- (void)doAdd:(id)task
{

}

//处理错误，可能是单独的类(QLErroHandel)；
+ (BOOL)handleError:(NSInteger)errCode
{
    BOOL someCons;
    if(someCons){
        return YES;
    }
    return NO;
}
```
有了上面的方法后就可以封装一个通用的自动处理错误的方法了，因为我是那么的懒，当然这也是面向切面编程的体验，面向错误处理这个切面编程，不让错误处理流落到每个添加调用处，避免日后维护的工作！

```objc
///封装一个通用的自动处理错误的方法
- (void)addDownloadTaskAutoHandleError:(id)task
             NoErrorCompletion:(void(^)(id task))comBlock
{
    [self addDownloadTask:task handleError:^BOOL(NSInteger errCode) {
       return [[QLErroHandel class]handleError:errCode];
    } completion:^(id task, NSInteger errCode) {
        if (comBlock) {
            comBlock(task);
        }
    }];
}
```

如果只是这些的话，看着还不错，一劳永逸，错误处理自动处理了，没错误后就添加任务！ But，有了新的需求了，要加入会员特权，可以免流量下载！并且流程和之前也有所不同了，有些情况是不能添加的！什么？这怎么办！淡定么，代码是我写怕啥！那么就在 handleError 里处理不行吗？

不行！因为会员的判断是异步的，同时伴有 Alert 等提示！异步是最麻烦的，因为没办法直接返回 bool 值了！因此必须重构 handleError 方法，等待异步出结果，是不是能够添加任务！考虑了一阵子，决定从 block 上入手，想到的办法是传递一个权利下放的 callBackblock 到 handleError 方法；当 handleError 获取到会员信息后回调 callBackblock；如何传递呢？没有更好的办法，因此就尝试把 callBackblock 作为参数传递下去，改造后是这样的:

```objc
+ (void)asynVIP:(void(^)(bool))compBlock
{
	//异步请求VIP信息
}

//处理错误，可能是单独的类；
+ (void)handleError:(NSInteger)errCode withCallback:(void(^)(NSInteger flag))calback
{
    [self asynVIP:^(bool isVIP){
    //使用 callback 告诉上层 api 是不是要开始添加任务
        if (calback) {
            calback(isVIP);
        }
    }];
}

///添加一个下载任务
- (void)addDownloadTask:(id)task
            handleError:(void(^)(NSInteger errCode,void(^calback)(NSInteger flag)))errHandle
             completion:(void(^)(id task , NSInteger errCode))comBlock{
//    1.generate err code;
    NSInteger errCode = 12432;
//    2.check error;
    if (errHandle) {

        void(^calback)(NSInteger flag) = ^(NSInteger flag){
            if (flag) {
//                3.add
                [self doAdd:task];
            }
        };
        //下放权利，调用者灵活判断
        errHandle(errCode,calback);
    }
}

///封装一个通用的自动处理错误的方法
- (void)addDownloadTaskAutoHandleError:(id)task
             NoErrorCompletion:(void(^)(id task))comBlock
{
    [self addDownloadTask:task handleError:^(NSInteger errCode, void(^callback)(NSInteger flag)) {
    //把 callback 传递下去，等待时机成熟，回掉回来，决定任务是不是添加
        [[QLErroHandel class] handleError:errCode withCallback:callback];
    } completion:^(id task, NSInteger errCode) {
        if (comBlock) {
            comBlock(task);
        }
    }];
}
```

这样 VIP 的需求就搞定啦，总结下就是： block 的参数可以是 block；这个可以作为 B 调用 A 的时候，B 在适当的时机回掉给 A 一些信息，而不是 B 仅仅从听从 A 安排的时间被调用！相当于握手，相互传递了信息，而不是单方向被动调用，这就相当于 A 在某个时候让 B 做一些任务，B 完成了任务之后根据完成的情况拿着 A 传给他的callback 回掉到 A 决定 A的下一步任务！这个也许需要你静静的思考品位几分钟...

再回过头来看看之前的权利下放方式：通过返回值去决定 A 的下一步任务，这个在 B 没有异步任务的情况下很实用，不过 B 有了异步任务后就不行了，特别是 B 的任务又是通过 block 派发的情形，就更不适合这个返回值模式了！


时间比较仓促，写的不对的地方或者疑惑之处可以评论等其他方式联系我...
