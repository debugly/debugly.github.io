---
layout: post
date: 2017-10-12 09:49:58 +0800
comments: true
tags: ["iOS","issues"]
author: 姬艳
title: "实现随音乐播放滚动歌词的音乐提词器"
keywords:  歌词解析,歌词随时间滚动
---

> 由于开发需要实现一个随音乐播放滚动歌词的音乐提词器，通过网上查找资料，实现了效果，将代码贴出来，方便大家使用，主要步骤如下：

## 歌词解析
  
TEMusicLrcParser.h

```objc
#import <Foundation/Foundation.h>

@interface LrcParser : NSObject

//时间
@property (nonatomic,strong) NSMutableArray *timerArray;
//歌词
@property (nonatomic,strong) NSMutableArray *wordArray;

//解析歌词
-(void) parseLrc:(NSString*)lrc;
@end 
```


TEMusicLrcParser.m

```
#import "TEMusicLrcParser.h"

@interface LrcParser ()

-(void) parseLrc:(NSString *)word;

@end

@implementation LrcParser

-(instancetype) init{
    self=[super init];
    if(self!=nil){
        self.timerArray=[[NSMutableArray alloc] init];
        self.wordArray=[[NSMutableArray alloc] init];
    }
    return  self;
}


-(void)parseLrc:(NSString *)lrc{
    NSLog(@"%@",lrc);
    
    if(![lrc isEqual:nil]){
        NSArray *sepArray=[lrc componentsSeparatedByString:@"["];
        NSArray *lineArray=[[NSArray alloc] init];
        [self.wordArray removeAllObjects];
        [self.timerArray removeAllObjects];
        for(int i=0;i<sepArray.count;i++){
            if([sepArray[i] length]>0){
                lineArray=[sepArray[i] componentsSeparatedByString:@"]"];
                if(![lineArray[0] isEqualToString:@"\n"]){
                    [self.timerArray addObject:lineArray[0]];
                    
                    [self.wordArray addObject:lineArray.count>1?lineArray[1]:@""];
                }
            }
        }
    }
}
@end

```
歌词解析部分主要是将歌词格式的字符串切分开，wordArray里面是歌词，timerArray里面是每句时间点

## 实现歌词的滚动
使用tableview来显示歌词

TEMusicLrcView.h

```objc
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import "TEMusicLrcParser.h"


@protocol TEMusicLrcViewDelegate <NSObject>
@optional
-(void) updateTime;//根据音乐播放器的时间更新时间，代理中实现
@end

@interface TEMusicLrcView : UITableView <UITableViewDataSource,UITableViewDelegate>
@property (strong,nonatomic) LrcParser* lrcContent;
@property (assign) NSInteger currentRow;

@property (nonatomic, weak) id<TEMusicLrcViewDelegate> musicLrcViewDelegate;
@property (nonatomic,strong) AVAudioPlayer *player;
@property (nonatomic,strong) NSString *musicTotalLrc;//整首歌的歌词解析前的字符串
-(instancetype)initWithFrame:(CGRect)frame musicTotalLrc:(NSString *)musicTotalLrc;
@end 
```

TEMusicLrcView.m

```

#import "TEMusicLrcView.h"

#import "TECaptureViewController.h"

@interface TEMusicLrcView ()
@property (nonatomic,strong) NSTimer *timer;

@end


@implementation TEMusicLrcView

-(instancetype)initWithFrame:(CGRect)frame musicTotalLrc:(NSString *)musicTotalLrc{
    self = [super initWithFrame:frame];
    if(self)
    {
        self.delegate=self;
        self.dataSource=self;
        self.lrcContent=[[LrcParser alloc] init];
        self.separatorStyle = UITableViewCellSeparatorStyleNone;
        self.allowsSelection = NO;
        
        [self.lrcContent parseLrc:musicTotalLrc];
        [self reloadData];
        [NSTimer scheduledTimerWithTimeInterval:0.5 target:self selector:@selector(update) userInfo:nil repeats:YES];
        
        UIImageView *bgView=[[UIImageView alloc] init];
        bgView.backgroundColor = [UIColor clearColor];
        //bgView.alpha=0.8;
        self.backgroundView=bgView;
    }
    return self;
}


-(void)update{
    [self.musicLrcViewDelegate updateTime];
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return self.lrcContent.wordArray.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    if(indexPath.row==_currentRow){
        return 60.0/kVisualFactor;
    }
    else{
        return 54.0/kVisualFactor;
    }
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    [tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:@"TEMusicLrcCell"];
    UITableViewCell *cell=[self dequeueReusableCellWithIdentifier:@"TEMusicLrcCell" forIndexPath:indexPath];
    
    cell.textLabel.text=self.lrcContent.wordArray[indexPath.row];

    if(indexPath.row==_currentRow){
        cell.textLabel.textColor = [UIColor colorFromHex:@"ffda44"];
        cell.textLabel.font = [UIFont systemFontOfSize:34.0/kVisualFactor];
        cell.textLabel.layer.shadowColor = [UIColor clearColor].CGColor;
        cell.textLabel.layer.shadowOffset = CGSizeMake(0.0f, 0.0f);
    }
    else{
        cell.textLabel.textColor = [UIColor colorWithWhite:1 alpha:0.7];
        cell.textLabel.font = [UIFont systemFontOfSize:28.0/kVisualFactor];
        cell.textLabel.layer.shadowOpacity = 1.0;
        cell.textLabel.layer.shadowColor = [UIColor colorWithWhite:0 alpha:0.4].CGColor;
        cell.textLabel.layer.shadowOffset = CGSizeMake(0.0f, 1.0f);
        cell.textLabel.layer.shadowRadius = 2;
    }
    cell.textLabel.textAlignment = NSTextAlignmentCenter;
    cell.backgroundColor=[UIColor clearColor];
   
    return cell;
}


@end

```

其中更新提词器的时间的实现方法是

```

#pragma mark - 更新提词器时间
-(void) updateTime{
    CGFloat currentTime=self.musicPlayer.currentlocation;
//    NSLog(@"%d:%d",(int)currentTime / 60, (int)currentTime % 60);
    for (int i=0; i<self.musicLrcView.lrcContent.timerArray.count; i++) {
        NSArray *timeArray=[self.musicLrcView.lrcContent.timerArray[i] componentsSeparatedByString:@":"];
        float lrcTime=[timeArray[0] intValue]*60+[timeArray[1] floatValue];
        if(currentTime>lrcTime){//过了这句歌词的起始时间后，刷新当前歌词
            self.musicLrcView.currentRow=i;
        }else
            break;
    }
    
    [self.musicLrcView reloadData];
    [self.musicLrcView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.musicLrcView.currentRow inSection:0] atScrollPosition:UITableViewScrollPositionMiddle animated:YES];
}

```

currentTime为当前播放器的时间，lrcTime为当前歌词的开始时间，过了这句歌词的起始时间后，刷新当前歌词