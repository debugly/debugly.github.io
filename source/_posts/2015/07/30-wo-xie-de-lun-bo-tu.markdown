---
layout: post
title: "无限循环轮播图"
date: 2015-07-30 11:09:45 +0800
comments: true
tags: "iOS"
keywords: iOS 无限循环轮播图
---

<img src="/images/201507/EZCarouseImageView.gif" width="370" height="236">

> 我们的 App 要展示广告，形式为几张循环滚动的图片，俗称 Banner，这里我称之为轮播图。 我写了两个版本一个 EY 版和一个 EZ 版，区别是实现方式的不同：EY 使用 ScrollerView，最多会有 3 个子 view ，EZ 使用 CollectionView，她有重用机制，所以最多会有 2 个子 view；轮播的触发使用了定时器，这个已经解决了循环引用问题，直接使用了，不清楚的可以移步 [这里](/ios/2015/07/14/jie-jue-nstimeryin-qi-de-nei-cun-xie-lou.html) ！下面分别介绍下：


## EY 实现思路

在 ScrollView 上添加 3 张 ImageView 展示图片，为了节省内存，所以最多创建 3 张就行了(其实 2 张也是可以的，这个后续继续优化，版本且定为 EYS ，哈哈她是 EY 的加强版)！

比如现在有6张（［1,2,3,4,5,6］）图片需要显示，那么首先我会配置出来需要显示的图片索引，放在一个数组里［6，1，2］当作数据源，然后调整偏移量让 ScrollView 滚动到中间，那么看到的就是第一张了，此时向右滑动看到最后一张，向左滑动看到第二张；如下流程：

	* ScrollView 滚动到中间显示［1］，数据源里为［6，1，2］，刷新视图，此时可以滑动
	* 向右滑动显示［6］之后就重新配置为［5，6，1］,然后刷新视图让 ScrollView 滚动到中间
	* 向左滑动显示［2］之后就重新配置为［1，2，3］,然后刷新视图让 ScrollView 滚动到中间

>同时还需要处理一张图片的情况，如果就 1 张，那么不可滑动，数据源为［1］；

可以看出，中间那一张是当前看到的，他的左右两侧会放上合适的图片，这样滑动的时候就感觉像是一直在循环♻️一样了；

### 先看使用方法吧


```objc
EYCarouseImageView *carouseY = [[EYCarouseImageView alloc]initWithFrame:CGRectMake(0, 20, self.view.bounds.size.width, 240) animationDuration:3];

[carouseY resetEasyURLArr:@[@"http://pic.nipic.com/2007-11-09/2007119122519868_2.jpg",
                           @"http://pic26.nipic.com/20121223/9252150_195341264315_2.jpg",
                           @"http://b.hiphotos.baidu.com/album/pic/item/cb8065380cd79123c6f9b8dead345982b2b7807a.jpg?psign=c6f9b8dead345982b2b7d0a20cf431adcaef76094b36a442",
                           @"http://pic.nipic.com/2007-11-09/2007119121849495_2.jpg"]];

[self.view addSubview:carouseY];

[carouseY didClickedEYCarouseImageView:^(NSUInteger idx) {
    NSLog(@"----%lu",(unsigned long)idx);
}];
```

### 内部实现

* 配置下 ScrollView,添加手势处理点击；注册内存警告⚠的通知；
* 处理控制轮播的属性: autoScrollTimeInterval,allowAutoScroll;
* 配置定时器:

```objc
//一个时间间隔后开始轮播
- (void)resumeAutoScroll
//销毁定时器
- (void)invalidateTimer
//重置timer；
- (void)resetTimer
//定时器触发的自动轮播；
- (void)autoScrollLoop
```

* 准备数据源

```objc
//获取下一个可用的索引
- (NSInteger)getValidNextPageIndexWithPageIndex:(NSInteger)currentPageIndex {
    if(currentPageIndex == -1) {
        return self.totalCount - 1;
    } else if (currentPageIndex == self.totalCount) {
        return 0;
    } else {
        return currentPageIndex;
    }
}

//准备当前需要显示的索引数组；
- (NSArray *)prepareNeedShowPageIdxArr
{
    NSArray *idxArr = nil;

    if (_urlArr.count == 1) {
        idxArr = @[@(0)];
    }else{
        NSInteger prevPageIndex = [self getValidNextPageIndexWithPageIndex:self.currentIdx - 1];
        NSInteger nestPageIndex = [self getValidNextPageIndexWithPageIndex:self.currentIdx + 1];
        idxArr = @[@(prevPageIndex),@(self.currentIdx),@(nestPageIndex)];
    }
    return idxArr;
}
```

* 刷新的视图的时候需要更新图片

```objc
- (void)updateImage4URLIdx:(NSUInteger)uidx
{
    NSNumber *idxNum = [self.showURLIdxMap objectForKey:[self getMapKey:uidx]];

    if (idxNum) {
        NSUInteger idx = [idxNum integerValue];
        UIImageView *imgView = self.contentViewArr[idx];
        NSString *url = self.urlArr[uidx];

        UIImage *img = [[SDImageCache sharedImageCache]imageFromMemoryCacheForKey:url];
        if (img) {
            imgView.image = img;
        }else{
            imgView.image = self.placeHolderImage;
            //            内存里没有，就查本地；
            __weak __typeof(self)weakSelf = self;
            [[SDImageCache sharedImageCache]queryDiskCacheForKey:url done:^(UIImage *image, SDImageCacheType cacheType) {
                //                查到了就放内存，刷新下view；
                __strong __typeof(weakSelf)strongSelf = weakSelf;
                if (image && strongSelf) {
                    [strongSelf updateImage4URLIdx:uidx];
                }
            }];
        }
    }
}
```

* 重写数据源处理必要的操作

```objc
- (void)setUrlArr:(NSArray *)urlArr
{
    //    copy个新的，防止外部改变了，影响了轮播图
    _urlArr = [urlArr copy];
    self.totalCount = _urlArr.count;
    self.currentIdx = 0;
    self.scrollEnabled = self.totalCount > 1;
//    配置子view；
    [self prepareScrollViewContentDataSource];

    if (self.totalCount > 0) {
//        更新子view显示的图片；
        [self updateSubViews];
    }
    //        重设下，更新自动轮播的状态；
    self.allowAutoScroll = self.allowAutoScroll;
    //        下载图片；
    for (int i = 0; i < _urlArr.count; i ++) {
        NSString *url = _urlArr[i];
        __weak __typeof(self)weakSelf = self;
        [[SDWebImageManager sharedManager]downloadImageWithURL:[NSURL URLWithString:url] options:0 progress:NULL completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
            //                更新下当前显示的图片；
            __strong __typeof(weakSelf)strongSelf = weakSelf;
            if (strongSelf && image) {
                if (i < strongSelf.urlArr.count) {
                    [strongSelf updateImage4URLIdx:i];
                }
            }
        }];
    }
}

- (void)updateSubViews
{
    NSArray *idxArr = [self prepareNeedShowPageIdxArr];

    NSInteger counter = 0;

    for (NSNumber *tempNumber in idxArr)
    {
        NSInteger tempIndex = [tempNumber integerValue];
        [self.showURLIdxMap setObject:@(counter) forKey:[self getMapKey:tempIndex]];
        [self updateImage4URLIdx:tempIndex];
        counter++;
    }
    //    显示中间的；
    if (self.totalCount > 1)
    {
        [self setContentOffset:CGPointMake(self.frame.size.width, 0)];
    }
}
```

* 重新配置数据源逻辑

```objc
- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    CGFloat contentOffsetX = scrollView.contentOffset.x;

    if(contentOffsetX >= (2 * CGRectGetWidth(scrollView.frame))) {
        [self showNextPage];
    }else if(contentOffsetX <= 0) {
        [self showPreviousPage];
    }
}
```

* 处理点击事件

```objc
- (void)tapScrollView:(UITapGestureRecognizer *)sender
{
    [self resumeAutoScroll];

    if (self.DidClickedBlock) {
        self.DidClickedBlock(self.currentIdx);
    }

    if (self.carouseDelegate && [self.carouseDelegate respondsToSelector:@selector(eyCarouseImageView:didClickedImageView:)]) {
        [self.carouseDelegate eyCarouseImageView:self didClickedImageView:self.currentIdx];
    }
}
```


## EZ 实现思路

思路和EY是一样的，只不过这个使用 CollectionView 来实现，数据源的配置是一样的，就是减少了一个展示图片的 ImageView ！

### 使用方法：

```objc
EZCarouseImageView *carouse = [[EZCarouseImageView alloc]initWithFrame:CGRectMake(0, 20, self.view.bounds.size.width, 240) animationDuration:3];

[carouse resetEasyURLArr:@[@"http://cdn.duitang.com/uploads/item/201110/09/20111009155438_ddWci.jpg",
    @"http://pic27.nipic.com/20130220/11588199_085521216128_2.jpg",
    @"http://a0.att.hudong.com/57/78/05300001208815130387782748704.jpg",
    @"http://pic29.nipic.com/20130506/3822951_101843891000_2.jpg"]];

[self.view addSubview:carouse];

[carouse didClickedEZCarouseImageView:^(NSUInteger idx) {
    NSLog(@"--点击：--%lu",(unsigned long)idx);
}];
```

### 内部实现

* 配置下collectionview的Layout；

```objc
- (instancetype)initWithFrame:(CGRect)frame
{
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc]init];

    layout.minimumLineSpacing = 0;
    layout.minimumInteritemSpacing = 0;
    layout.itemSize = frame.size;
    layout.sectionInset = UIEdgeInsetsZero;
    layout.scrollDirection = UICollectionViewScrollDirectionHorizontal;

    self = [super initWithFrame:frame collectionViewLayout:layout];
    if (self) {
        [self initialization];
        [self registerMemoryWarningNotification];
    }
    return self;
}
```
* 配置定时器
* 注册MemoryWarningNotification；内存警告后加载当前显示的图片；

```objc
- (void)registerMemoryWarningNotification
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(needLoadImageFromDisk2Memory)
                                                 name:UIApplicationDidReceiveMemoryWarningNotification
                                               object:nil];
}

//内存警告后，从本地加载当前需要显示的图片到内存；
- (void)needLoadImageFromDisk2Memory
{
    NSInteger idx = [self itemMapedURLidx:self.currentIdx];
    if (idx != NSNotFound) {
        [self fetchImageForCellWithURLidx:idx];
    }
}
```

* 重写数据源处理跟EY类似

```objc
    - (void)setUrlArr:(NSArray *)urlArr
    {
        //    copy个新的，防止外部改变了，影响了轮播图
        _urlArr = [urlArr copy];
        if (_urlArr && _urlArr.count > 0) {

            self.currentIdx = 0;
            //        更新映射的索引；
            [self updateMapedIdx:[self prepareNeedShowPageIdxArr]];
            [self reloadData];

            if ([self totalCount] > 1) {
                self.scrollEnabled = YES;
                //            显示第一张；假如有n（n > 1）帧，那么［n－1，0，1］
                [self scrollToItemAtIndexPath:[NSIndexPath indexPathForItem:1 inSection:0] atScrollPosition:UICollectionViewScrollPositionNone animated:NO];
            }else{
                self.scrollEnabled = NO;
            }
            //        重设下，更新自动轮播的状态；
            self.allowAutoScroll = self.allowAutoScroll;
            //        下载图片；
            for (NSString *url in _urlArr) {
                __weak __typeof(self)weakSelf = self;
                [[SDWebImageManager sharedManager]downloadImageWithURL:[NSURL URLWithString:url] options:0 progress:NULL completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
                    //                更新下当前显示的图片；
                    __strong __typeof(weakSelf)strongSelf = weakSelf;
                    if (strongSelf && image) {
                        [strongSelf reloadItemsAtIndexPaths:[strongSelf indexPathsForVisibleItems]];
                    }
                }];
            }
        }else{
        //        重设下，更新自动轮播的状态；
        self.allowAutoScroll = self.allowAutoScroll;
            [self reloadData];
        }
    }
```

* 看下UICollectionView 的 DataSource吧

```objc
    - (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
    {
        EZCarouseCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:EZCarouseCellReuseIdentifier forIndexPath:indexPath];
        //    通过item获取对应的数组索引；
        NSInteger idx = [self itemMapedURLidx:indexPath.item];
        UIImage *image = nil;
        if (idx != NSNotFound) {
            image = [self fetchImageForCellWithURLidx:idx];
        }
        //    找不到图片就用placeHolder
        if (!image && self.placeHolderImage) {
            image = self.placeHolderImage;
        }
        cell.imgView.image = image;
        return cell;
    }
```

* 根据图片的数量配置cell个数；

```objc
    - (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
    {
        if ([self totalCount] == 1){
            return 1;//一个不让滚动
        }else if([self totalCount] > 1){
            return 3;//超过一个就用3个，然后显示中间的
        }else{
            return 0;
        }
    }
```

* 何时更新map的索引，更新显示的图片？

```objc
    - (void)scrollViewDidScroll:(UIScrollView *)scrollView
    {
        CGFloat contentOffsetX = scrollView.contentOffset.x;
        //显示了第3个item,或者第1个item时就要更新下显示的图片索引数组
        if(contentOffsetX >= (2 * CGRectGetWidth(scrollView.frame))) {
            [self showNextPage];//这个会更新视图
        }else if(contentOffsetX <= 0) {
            [self showPreviousPage];//这个会更新视图
        }
    }
```

* 点击事件

```objc
    //点击支持代理和block回调
    - (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
    {
        if (self.carouseDelegate && [self.carouseDelegate respondsToSelector:@selector(ezCarouseImageView:didClickedImageView:)]) {
            [self.carouseDelegate ezCarouseImageView:self didClickedImageView:[self itemMapedURLidx:indexPath.item]];
        }
        if (self.DidClickedBlock) {
            self.DidClickedBlock([self itemMapedURLidx:indexPath.item]);
        }
    }

    - (void)didClickedEZCarouseImageView:(void (^)(NSUInteger))block
    {
        self.DidClickedBlock = block;
    }
```

## 完

核心的逻辑都在这了，欢迎在 [github](https://github.com/debugly/QLCodes) 上提问题！
