---
layout: post
title: "千帆 SDK Refactor: NetWork"
date: 2016-11-28 21:16:43 +0800
comments: true
tags: ["千帆SDK"]
---

> 重构，不是说说而已，也不是不想看别人的`烂代码`自己重写一遍，而是真的遇到了会破坏当前架构的实际问题了，或者之前就没想那么多，继续往下写只会将业务逻辑搞得支离破碎，毫无条理而言，日后维护负担大，相同的逻辑写了多遍之时，才需要重构;我将会结合实际分享几篇SDK内关于重构的文章。

# 网络请求的现状

重构要有合适的动机，不能出师无名，所以我们先来看看我为何决定要重构网络请求；目前SDK的所有（接口，除图片下载外的）请求均是由上层 Service 发起，底层调用 SLNetWork 完成，表现稳定，但 SLNetWork 为 Service 层提供的调用接口太多，将响应数据解析为 Model的处理逻辑糅合在 Service 层和底层，图片下载没有使用 SLNetWork 而是另外一套逻辑。

## SLNetWork 库简介
这个网络库是我今年 4 月份写的，用于搜狐视频的上传模块，那时候还没有千帆 SDK，我还是视频主线的一个新人，做这块业务的时候，主管说这块要写成一个单独的模块，日后可能会提供给别的部门用，于是就没有使用视频内部现有的网络库，而是重新造的轮子 `SVPNetWork`；后来我换了部门来做千帆SDK了，做 SDK 的过程中，我尽可能的减少对外部的依赖，减少宿主 App 的工作量，尽管千帆 SDK 目前仅提供给视频和新闻用，但是不依赖外部这个理念是始终萦绕在我的脑海，于是为了快速开发而又不造成依赖的情况下，我就把 SVPNetWork 库直接带了过来，用于担任直播间请求的底层。

> 这里有一点要说的是，SVPNetWork 库里所有的类都要改下前缀，因为OC没有命名空间！

这样原本在视频里的 SVPNetWork 就成了千帆 SDK 里的 SLNetWork 了。

## SLNetWork 库设计思路
核心类有两个：

- SLNetworkService
	- 负责发起，管理请求
	- 内部处理与系统 NSURLSession 的交互（请求的代理处理）
	- 不同的阶段，把 request 置为不同的状态，request 根据状态回调对应的 callback ；

- SLNetworkRequest
	- 网络请求的抽象,包含了请求的相关部分
		- URL: 请求地址
		- Method: HTTP请求方式，GET，POST等
		- Headers: HTTP请求的Header，包含了Content-Type，Cookie，UA等信息
		- Progress: 上传进度，SDK暂时没用到
		- State: 请求的状态，比如Start是开始，Completed和Error时触发回调回调给上层等
		- Response: 响应数据，提供的便利方法有，获取string，获取JSON等

简单的说就是 SLNetworkService 管理 SLNetworkRequest，维持他的状态，SLNetworkRequest 根据状态做出相应的动作。坦白的说这个设计思路是从 MKNetWork 借鉴的。发起一个网络请求：

```objc
NSString *url = @"your url"
SLNetworkRequest *request = [[SLNetworkRequest alloc]initWithURLString:url params:nil httpMethod:@"GET"];
///set cookie    
NSMutableDictionary *cookieHeader = [NSMutableDictionary dictionary];
if (cookieStr) {
    [cookieHeader setObject:cookieStr forKey:@"Cookie"];
}
[request addHeaders:cookieHeader];

///添加请求完毕的处理，支持添加多个
[request addCompletionHandler:^(SLNetworkRequest *request) {
	NSDictionary *result = request.respAsJSON;
}];

///start
[[SLNetworkService alloc]startRequest:request];

```

## SLNetWork 库增加便利方法

一般请求均是 GET，POST，因此为了发送请求方便，所以在 SLNetworkService+Simple 类别里提供了一些便利的方法：

```objc
//可设置自动取消
- (SLNetworkRequest *) Post2:(NSString *)url params:(NSDictionary *)params cancelOwner:(id)owner completion:(SLNKHandler)chandler;
- (SLNetworkRequest *) Post2:(NSString *)url params:(NSDictionary *)params completion:(SLNKHandler)chandler;

//可设置自动取消
- (SLNetworkRequest *) Get:(NSString *)url params:(NSDictionary *)params completion:(SLNKHandler)chandler;
- (SLNetworkRequest *) Get:(NSString *)url completion:(SLNKHandler)chandler;
- (SLNetworkRequest *) Get:(NSString *)url params:(NSDictionary *)params cancelOwner:(id)owner completion:(SLNKHandler)chandler;
- (SLNetworkRequest *) Get:(NSString *)url cancelOwner:(id)owner completion:(SLNKHandler)chandler;
```

自动取消是指，可以将网络请求绑定到某个对象上，当该对象销毁时，自动取消该请求，在以后的博客里介绍吧。
为了方便使用，甚至在 SLNetworkService 类里还提供了单利方法，这样普通的请求都是用这个单利就好了：

```objc
///单利的，不过支持多实例！
+ (instancetype)sharedService;
```

至此，SLNetWork 库的封装完毕。我们暂不讨论这么设计有什么缺点，因为好的架构不是吹出来的，评判的标准是看是否符合当前项目业务层的使用，业务层是否用着很爽，所以我们看完业务层在来做客观评价吧。

## Service层的调用方式

SLNetWork 提供了最基础的发起请求的方式，在业务层我们要根据业务和 SLNetWork 底层提供的方法，进行再次封装，由于底层没有提供将 JOSN 解析为 Model 的方法，那么这个工作就留给了业务层了，我是这么处理的：

```objc
// Created on 16/5/13.
// 网络请求服务层；基于 SLNetworkService 发送请求 和 SLJSONUtil 进行JOSN解析；
// 更加上层，可以直接进行数据验证和JOSN解析为Model；方便业务逻辑调用；

#import "SLNetworkService.h"
#import "SLNetworkService+Simple.h"

typedef void(^SLNetWorkHandler)(SLNetworkRequest *request,id result,NSError *err);

@interface SLNetworkService (JSONParser)

- (SLNetworkRequest *) Post2:(NSString *)url params:(NSDictionary *)params checkKeyPath:(NSString *)kp checkHandler:(BOOL (^)(id value))checkHandler modelKayPath:(NSString *)mkp modelName:(NSString *)mName completion:(SLNetWorkHandler)chandler;

- (SLNetworkRequest *) Get:(NSString *)url params:(NSDictionary *)params checkKeyPath:(NSString *)kp checkHandler:(BOOL (^)(id value))checkHandler modelKayPath:(NSString *)mkp modelName:(NSString *)mName completion:(SLNetWorkHandler)chandler;

- (SLNetworkRequest *) Get:(NSString *)url checkKeyPath:(NSString *)kp checkHandler:(BOOL (^)(id value))checkHandler modelKayPath:(NSString *)mkp modelName:(NSString *)mName completion:(SLNetWorkHandler)chandler;

- (SLNetworkRequest *) Get:(NSString *)url checkKeyPath:(NSString *)kp checkHandler:(BOOL (^)(id value))checkHandler modelKayPath:(NSString *)mkp completion:(SLNetWorkHandler)chandler;

```

然后随便找一个业务层的接口看下如何使用JSONParser这一层（这里说层不严谨）：

```objc
- (void)requestNeighborOnlineAnchorsWithRoomid:(NSString *)rid comp:(void(^)(id result,NSError *err))comp
{
    if (rid.length == 0 ) {
        return;
    }

    NSDictionary *param = @{@"roomid":rid};
    NSString *url = @"...";
    SLNetworkRequest *request = [[SLNetworkService sharedService] Get:url
                                                               params:param
                                                         checkKeyPath:@"status"
                                                         checkHandler:^BOOL(id value) {
        return ([value intValue] == 200); }
                                                         modelKayPath:@"message"
                                                            modelName:@"SLNeighborAnchorModel"
                                                           completion:^(SLNetworkRequest *request, id result, NSError *err) {
                                                             comp(result,err);
                                                           }];
    [self addCancleRef:request];
}
```

根据服务器返回的数据，来解释 checkKeyPath、modelKayPath、modelName 这些参数都是干嘛用的：

```json
{
	status:200,
	message:
		{
			anchor:5006697,
			avator:http://img,
			nickName:么么哒
		}
}
```

- checkKeyPath: 需用该字段做接口检查，支持 keypath，比如:aa/status
- checkHandler: 内部返回通过 checkKeyPath 字段取出来的值，block 回调过来，然后返回是否检验通过；只有通过才能解析为 Model
- modelKayPath: 根据该参数去服务器返回的 json 数据里查找 目标 json，比如这个例子的目标就是message的内容
- modelName: 将通过 modelKayPath 找到的 json 解析为类名为 modelName 的 model实例
- completion: 网络请求的着陆点，判断下err，如果没有err，result 就是你想要的 model 了，这里回调给上层

至此，SDK 的网络库使用现状已经毫无保留的给大家介绍了。

# 网络请求改进方向

知道了网路请求的现状后，我们才能有针对性的去改进他。我们可以看到主要的问题是：

- SLNetworkService 提供了太多的发送请求的便利方法，特别是支持 JSON 转 Model 之后，可能就是一个参数之差就需要增加一个方法，不方便之处也显而易见，Xcode 自动提示的时候，都他妈不能完全显示了，被省略了，这样反而降低了开发的效率呢！

![](/images/201611/Snip20161129_8.jpg)

- 响应解析处理不够好，糅合在底层的上层之间，没有扩展性，比如我想把图片的请求也统一过来，目前来看很难做到！

![](/images/201611/Snip20161129_9.jpg)

因此，接下来主要针对与调用方式和响应解析进行重构！

# 重构请求响应处理逻辑

目前优秀的开源库有可以借鉴的地方吗？有，比如最流行的 AFNetworking 的响应解析处理的很好呢，跟 SLNetwork 库的区别是不支持 JSON 转 Model，对于这个问题我觉得采用继承去解决比较合适，所以建立的下面的几个类：

`Model 继承自 JSON，JSON 继承自 HTTP；`

![](/images/201611/Snip20161129_10.jpg)

这块完全模仿自 AFNetworking ，但还是多少有些创建之处，因为目前服务响应里都有个状态码，比如上面我举例接口中的 status 字段，当 status 等于 200 时，就是接口正常返回了数据，才能进行 Model 解析：

![](/images/201611/Snip20161129_15.jpg)

这个子类来处理 Model 解析的，为了方便，提供了 keypath 的概念：

![](/images/201611/Snip20161129_11.jpg)

这是处理逻辑，这个使用的是我之前写的 JOSN 转 Model 的小框架，使用方式可参考我的[开源项目](https://github.com/debugly/JSONUtil)：

![](/images/201611/Snip20161129_12.jpg)

这里选择这个小框架是因为他是我自己写的，非常小众化，加上目前也没什么问题，`最大的好处是 SDK 不会造成依赖`！假如使用开源的 Mantle 的话就很容易和嵌入的 App造成冲突，不凑巧的是 App 修改了里面的逻辑，这就更糟糕了。

到此，解析响应数据这块就重构完了，好处是由底层完成，上层不必关系这个过程；还有扩展性比较强，未来注定还会有一次重构：将网络请求和图片请求统一！那时就可以再写个 SLNHTTPResponseParser 的子类处理图片就好了，想想都觉得不错呢！感谢 AFNetworking 作者提供的好思路！

# 重构调用方式，减少不必要的方法

这个问题是耐人寻味的，我的目标是写一个方法，就能够实现发送请求，而不是一个参数的差异就要为之写个方法，如果在加上普通请求的类型（GET，POST），方法数就要乘以 2 了！这简直是灾难，回想下我刚才举例那个请求吧，共有 6 个参数，我不能保证这 6 个必须的有几个，我也不想就提供一个带 6 个参数的方法，那样失去了灵活性!

解决这个问题的时候我是有灵感的，其实重构之前灵感就有了，否则我也不会去重构了；因为去年我就做过类似的事情，那个时候我还在创业公司做项目，这是使用的方式：

```objc
///Make 这个接口需要的参数，内部有签名
NSDictionary *paramDic = MakeHttpParam(^(NSMutableDictionary *const make) {
        [make setObject:phone forKey:@"phone"];
        [make setObject:type forKey:@"template"];
    });

///传入签过名的参数，发送请求
[self PostPath:@"/mobile/sendmsg" parems:paramDic SuccBlock:^(NSDictionary * json) {
    if (succBlock) {
        succBlock();
    }
} FailedBlock:^(NSError *error, id resultJson) {
    if (errorBlock) {
        errorBlock(error);
    }
}];

```
这里的 MakeHttpParam 是方便构建请求参数的，为何这么写？是因为方便，MakeHttpParam 内部会将参数按照规则进行一次签名，然后返回，因此 paramDic 就是处理好的参数字典，可直接用于网络请求！其实这么处理的思路也不是我凭空想象出来的，是我在使用 Masonry 的过程中，学习到的，稍微修改了下而已，这里也要感谢 Masonry 作者提供的好思路！

我简单总结了下，只要满足这样一个条件就可以使用采用这个思路：

> block 里需要提供一个 maker，这个 maker 能够处理原本通过形参传递进来的参数！

因此我们来看下 SLNetworkService 满足这个条件吗？哈哈，满足，因为 SLNetworkService 提供的这些方法的参数最终都传给了 SLNetworkRequest ！所以这个 maker 就找了，就是 SLNetworkRequest ！

思路有了，剩下的都是体力活了，把之前的 Simple，JOSN 类别都删了，然后创建一个 Maker 的类别，同样为了方便使用额外提供了 GET 和 POST:

![](/images/201611/Snip20161129_13.jpg)

因此 Service 层的调用方式就改成了这样：

![](/images/201611/Snip20161129_14.jpg)

这样一来，就算是再多的参数，不管哪个参数有或者没有，都可以在这个 block 里完成，使用这中方式写了几个请求之后发现这统统这不都是对网络请求的配置么！不知道你有这个感觉没？

本次对网络请求的重构就到这里啦，如有问题请留言给我。下次网络重构的内容可能是：

> **图片请求收入 SLNetwork 麾下，彻底实现网络请求大一统。**
