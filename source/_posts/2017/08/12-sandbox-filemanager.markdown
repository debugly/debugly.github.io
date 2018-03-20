---
layout: post
title: "iOS 沙盒与文件管理类"
date: 2017-08-12 09:24:47 +0800
comments: true
tags: iOS
keywords: sanbox,filemanager,沙盒,文件管理
---

> 正常情况下，我们的文档只能存储到沙盒里，在写业务逻辑时经常需要判断沙盒里某个文件是否存在，或者文件夹不存在创建文件夹等操作，因此写篇文章记录下如何获取沙盒路径，如何使用文件管理类创建目录等常用操作。

# 沙盒路径

什么是沙盒？为了保证App的正常运行，不受到其他App的干扰，或者病毒的侵害，苹果为每个App设定了自己独立的目录，对于开发者而言，你只能访问这个目录下的文件或者子目录，这个目录是你App的根目录，这就是沙盒机制，大大减少了流氓软件和病毒。

关于沙盒设计可看官方介绍 [App Sandbox Design Guide](https://developer.apple.com/library/content/documentation/Security/Conceptual/AppSandboxDesignGuide/AboutAppSandbox/AboutAppSandbox.html)

## 沙盒内重要目录

获取沙盒根目录，直接使用这个 C 方法就OK了:

`NSHomeDirectory()`

沙盒里面有几个文件夹还记得吗？有 3 个，分别是：

- Documents : 一般重要的文件会放这里，不过默认情况下，备份App时会备份这里面的数据；这个目录也可以设置共享，就可以在itunes里向App导入数据了

`NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)`

注意：NSSearchPathForDirectoriesInDomains 函数返回的是个数组，取一个就行了。

- Library/Caches : 一般会将图片这种没那么重要的资源缓存到这里

`NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES)`

- tmp : 就是个临时目录，中间临时文件，存这里面，系统可能会删这里的文件，最好我们自己清理临时文件，减少沙盒的体积

`NSTemporaryDirectory()`

这三个都在App沙盒根目录里，因此也可以通过 NSHomeDirectory() 拼接出来。

# 管理文件和目录

iOS 里使用 NSFileManager 类管理文件（夹），这是一个单利类，但你仍旧可以创建新的实例，自己使用。下面总结下 NSFileManager 的常用方法：

- 创建文件 

```
NSFileManager *fileManager = [NSFileManager defaultManager];
///文件路径，文件内容，相关属性
BOOL succ = [fileManager createFileAtPath:path contents:nil attributes:nil];
if (succ) {
    NSLog(@"创建成功");
} else {
    NSLog(@"创建失败");
}
```

- 直接写入文件

NSString,NSData,NSArray,NSDictionary等常用类均提供了直接写入文件的方法；这里以 NSString 举例说明；由于这个方法的存在，所以上面的创建文件方法用的不是很多；

```
NSString *iOSPath = [documentsPath stringByAppendingPathComponent:@"iOS.txt"];
NSString *text = @"测试直接写入";
BOOL succ = [text writeToFile:path atomically:YES encoding:NSUTF8StringEncoding error:nil];
if (succ) {
    NSLog(@"写入成功");
} else {
    succ(@"写入失败");
}
```

- 从文件读取

```
- (void)readFileContent{
    NSString *text = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    NSLog(@"text: %@", text);
}
```

- 创建文件夹

```
NSFileManager *fileManager = [NSFileManager defaultManager];
///第二个参数，一般传YES，意思是创建中间目录；
BOOL succ = [fileManager createDirectoryAtPath:@"/a/b/c" withIntermediateDirectories:YES attributes:nil error:nil];
if (succ) {
    NSLog(@"创建成功");
} else {
    NSLog(@"创建失败");
}
```

- 删除文件，文件夹

最好在异步线程里删除文件

```
NSFileManager *fileManager = [NSFileManager defaultManager];
BOOL succ = [fileManager removeItemAtPath:path error:nil];
if (succ) {
    NSLog(@"删除成功");
}else{
    NSLog(@"删除失败");
}
```

- 文件是否存在

```
BOOL succ = [[NSFileManager defaultManager]fileExistsAtPath:savePath];
if (succ) {
    NSLog(@"文件存在");
}else{
    NSLog(@"文件不存在");
}
```

- 文件夹是否存在

```
NSString *cachePath = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) firstObject];
NSString *basePath = [cachePath stringByAppendingPathComponent:@"telittleVideo"];
    
BOOL directory = NO;
///注意，文件夹存在时，这个方法返回的也是YES哦，所以要继续判断 directory ！
if ([[NSFileManager defaultManager]fileExistsAtPath:basePath isDirectory:&directory] && !directory) {
	 ///如果不是文件夹，那么说明存在了同名文件了，删掉吧
    [[NSFileManager defaultManager]removeItemAtPath:basePath error:nil];
}
    
///文件夹不存在，要创建
if(!directory){
    NSError *err = nil;
    [[NSFileManager defaultManager] createDirectoryAtPath:basePath withIntermediateDirectories:YES attributes:nil error:&err];
    NSLog(@"%@",err);
}
```
