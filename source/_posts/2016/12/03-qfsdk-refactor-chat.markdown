---
layout: post
title: "千帆 SDK Refactor: 优雅的处理聊天数据源"
date: 2016-12-03 12:04:20 +0800
comments: true
tags: ["千帆SDK"]
keywords: 千帆,SDK,UITableview数据源
---

> 以下讨论基于的前提思想是：Cell 和 Model 是绑定的，一一对应的；Cell 是数据源所决定的，Cell 要做的就是展示数据源而已，或者说是先确定的数据源而不是 Cell，因此我们今天以讨论 Model 为主。简单的概括这次重构是为 Cell 建立一个CellModel，他有个实现构建协议的属性，展示前通过协议方法构建 Cell需要的数据并且存储到 CellModel 里，这样的好处是随便一个Model都可以作为数据源使用，只需实现必要的协议，Cell也不必关心数据源到底是谁提供的！

# 基于协议的CellModel

### 现状：Cell 绑定 SLLiveRoomModel

千帆 SDK 直播间的聊天是通过 UITableview 展示的，今天就来聊一聊如何优雅的处理 UITableview 数据源问题。既然这篇文章属于重构篇，因此我要说出重构的理由哈，这次重构的导火线是聊天区域要展示用户送给主播的千帆盛典票。

- 聊天是从 `Chat` 、`BC`等通道返回的，特点是数据结构类似，最重要的是每个通道只有一种事件（一种 JOSN 结构，没有类型而言）需要处理，因此抽取了一个父类`SLLiveRoomModel` 采用了工厂的形式去解析，通过增加一个枚举属性来区分开 Model，每个枚举都对应了一个子类，父类的 modelWithSocketJSON 方法里根据 `route` 字段选择出一个合适的子类，并且确定一个枚举值;
- 盛典票的 JSON 数据是从 `RC` 通道返回的，这个通道的有个`type`字段，用于标识类型，盛典票的type是47(以后简称为 RC47)，不同类型对应不同的业务，目前已经处理了三种类型，这三种类型并不牵涉显示到聊天区，目前的做法是抽取一个 `RCBaseModel` 父类（相当于工场）用于统一解析JSON为Model；

简单了解了现状和需求之后，我们看下遇到的问题：RC47需要显示到聊天区，而聊天区的数据都是 SLLiveRoomModel 类的子类，RC47 却是 RCBaseModel 的子类，这块无法做到统一！对此我想了两个改动比较小的方案：

- 将 RC47 继承 SLLiveRoomModel 类; 带来的问题是需要在 RC 通道根据 type 进行不同的解析，就会出现分支，原本应该是 RCBaseModel 的子类，现在却搞成了 SLLiveRoomModel 的子类，Model 解析时不再是统一！如果以后再出现 RC47 的类似情况，分支更多，时间久了逻辑就会碎片化！
- 将 Cell 数据源改为 id ,内部通过判断 class 去解决；带来的问题是 Cell 内部的处理显得不够优雅，久而久之也会碎片化！

### 改进：Cell 绑定 SLLiveRoomCellModel

以上两种方法都是权宜之计，于是我和同事进行了一番讨论了之后，采用我 15 年在创业公司的做法，并且做了个升级(基于协议)，更加优秀了！下面说下 16 版的哈：

- 基于协议的，将 Cell 需要的数据协议化，Cell 不依赖于真正的数据源（model），而是拥有一个通用的数据源（cellModel），这样的好处就是 Cell 不会对数据源（model）产生依赖，数据源可以是任意类型；
- 数据源的构建很灵活，不同的数据源仍旧可以使用各自的父类的通用解析方式；
- 数据源可注册点击事件的 block，不注册意味着不需要点击事件，顶级后无反应；

从实际出发，我的 Cell 需要的展示一个属性字符串，获取到行高而已，因此制订的协议如下：

```objc
@protocol SLLiveRoomCellModelBuitProtocol <NSObject>
@required;
- (float)heightForCell;
- (NSAttributedString *)attributedStringForCell;
@end
```

再根据需要制订 CellModel，需要的是存储属性字符串、行高、真正的数据源model，如下：

```objc
@interface SLLiveRoomCellModel : NSObject

@property (nonatomic, assign) float cellHeight;
@property (nonatomic, strong) NSAttributedString * attributedText;
@property (nonatomic, strong) id<SLLiveRoomCellModelBuitProtocol>model;//真正的数据支撑

///构建cellModel必须的行高和显示的属性字符串
- (void)buildit;
@end
```

因此任意modle如果想要作为 cell 的真正数据源，只要实现必要的方法才行了，别如 RC47Model、SLLiveRoomModel 等。

### 整理解析

Cell 数据源这块已经整理好了，接下来梳理下从 Socket 通道接收到 JSON 数据到构建出 SLLiveRoomCellModel 的过程：

- Parser JOSN->Model

```objc
- (SLCommonRCBaseModel *)parserCommRCJSON:(id)json
{
   return [SLCommonRCBaseModel modelWithSocketJSON:json];
}
```

- Build Model->CellModel

```objc
- (SLLiveRoomCellModel *)buildCellModelFromCommRC47Model:(SLComRC47Model *)rcModel
{
    SLLiveRoomCellModel *model = [[SLLiveRoomCellModel alloc] init];
    model.model = rcModel;
    [model buildit];//前面加过注释的，会调用协议方法用于构建；
    return model;
}
```

- Show RC47 JSON->Cell

```objc
- (void)append2ChatListWithCommRC47Model:(SLComRC47Model *)model
{
    if (model) {
        SLLiveRoomCellModel *cellModel = [self buildCellModelFromCommRC47Model:model];
        if(cellModel){
            [self append2ChatCellModel:cellModel];
        }
    }
}
```

这是整个过程，现在合起来看下RC处理的整个过程：

- 处理通用组播

```objc
- (void)handleComRCEvent:(NSDictionary *)json
{
    SLCommonRCBaseModel *baseModel = [self parserCommRCJSON:json];
    switch (baseModel.rcType) {
        case SLCommonRCType28:
        {
            //不需要显示到聊天区，自有别的处理逻辑...
		 }
            break;
        case SLCommonRCType32:
        {
            //不需要显示到聊天区，自有别的处理逻辑...
        }
            break;
        case SLCommonRCType53:
        {
            //不需要显示到聊天区，自有别的处理逻辑...
        }
            break;
        case SLCommonRCType47:
        {
            SLComRC47Model *rc47 = (SLComRC47Model *)baseModel;
            [self append2ChatListWithCommRC47Model:rc47];
        }
            break;
    }
}
```

可以看出，RC的处理流程是统一的，先解析为Model，然后根据 type 做不同的处理，对于之前的聊天通道的数据处理方式比这个更简单，就不再粘贴代码了，因为那些通道没有 type，比较单一，处理起来更简单！

### 整理点击处理逻辑

把点击事件的处理跟构建CellModel的逻辑放在一块！这是我的同事给我提的建议，我觉得很好，于是就为 CellModel 加了如下方法，以便于支持注册 Block 处理点击事件：

```objc
typedef void(^SLLiveRoomCellHandler)(SLLiveRoomCellModel *model);
- (void)registerHandler:(SLLiveRoomCellHandler)handler;
- (void)invokeHandler;
```

配合点击的代理方法实现 block 回调：

```objc
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [tableView deselectRowAtIndexPath:indexPath animated:NO];

    SLLiveRoomCellModel *cellModel = [self.dataSource objectOrNilAtIndex:indexPath.row];
    [cellModel invokeHandler];//回调block；
}
```

看下使用吧：

```objc
- (SLLiveRoomCellModel *)buildCellModelFromChatModel:(SLLiveRoomModel *)cModel
{
    SLLiveRoomCellModel *model = [[SLLiveRoomCellModel alloc]init];
    model.model = cModel;
    [model buildit];
    ///只有这种类型才去注册点击事件；
    if (cModel && SLLiveRoomMessageTypeBC == cModel.messageType) {
        [model registerHandler:^(SLLiveRoomCellModel *model) {
	   ///处理点击事件逻辑...
        }];
    }

    return model;
}
```
看起来不错呢，逻辑很紧凑，构建和点击事件的处理都放在一块了，检查代码，或者把这一块逻辑封装为一个方法等都很方便。

## 结束语

到此，这次数据源和解析的重构就结束了，确实做到了分离，各有自己的继承体系，没有耦合；这次重构很适合直播间的业务逻辑，对于别的业务还是要具体分析才行，不可死搬硬套哈！

有个细节我想提下，就是从 Socket 通道接受到数据开始均为异步的，直到构建完 CellModel，展示到 Cell 上时才回到主线程，所以即使直播间火爆，一直刷屏也不会因为聊天解析导致卡顿，这个是经过测试的呢！
