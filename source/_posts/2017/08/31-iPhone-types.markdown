---
layout: post
title: "iOS 获取设备、应用相关信息"
date: 2017-08-31 09:13:18 +0800
comments: true
tags: ["iOS"]
keywords: iOS,iphone uname,获取当前设备具体型号
---

> 有的时候我们需要针对特定的机型或者系统版本做一些特殊的处理，使得我们的程序能够正常的运行，这时就要去判断设备型号、系统版本了，获取这些信息本身并没有什么技术含量，只是比较零碎，因此为了查阅方便，整理了一份代码出来，用的时候直接copy即可。

# 设备信息

使用 uname 方法可以获取设备的硬件信息，其中就包括型号，我们可以根据型号具体的判断一个设备，比如 iPhone5s 的型号是 'iPhone6,2';

使用的时候需要导入头文件： #import <sys/utsname.h>

```
struct utsname systemInfo;

uname(&systemInfo);

NSString *platform = [NSString stringWithCString:systemInfo.machine encoding:NSASCIIStringEncoding];
```
这样获取的型号，不是我们平时叫的设备名称，所以一般都需要一个对应关系，如下：

```
- (NSString *)deviceType {

	struct utsname systemInfo;

	uname(&systemInfo);

	NSString *platform = [NSString stringWithCString:systemInfo.machine encoding:NSASCIIStringEncoding];

	if ([platform isEqualToString:@"iPhone1,1"]) return @"iPhone 2G";
    
    if ([platform isEqualToString:@"iPhone1,2"]) return @"iPhone 3G";
    
    if ([platform isEqualToString:@"iPhone2,1"]) return @"iPhone 3GS";
    
    if ([platform isEqualToString:@"iPhone3,1"]) return @"iPhone 4";
    
    if ([platform isEqualToString:@"iPhone3,2"]) return @"iPhone 4";
    
    if ([platform isEqualToString:@"iPhone3,3"]) return @"iPhone 4";
    
    if ([platform isEqualToString:@"iPhone4,1"]) return @"iPhone 4S";
    
    if ([platform isEqualToString:@"iPhone5,1"]) return @"iPhone 5";
    
    if ([platform isEqualToString:@"iPhone5,2"]) return @"iPhone 5";
    
    if ([platform isEqualToString:@"iPhone5,3"]) return @"iPhone 5c";
    
    if ([platform isEqualToString:@"iPhone5,4"]) return @"iPhone 5c";
    
    if ([platform isEqualToString:@"iPhone6,1"]) return @"iPhone 5s";
    
    if ([platform isEqualToString:@"iPhone6,2"]) return @"iPhone 5s";
    
    if ([platform isEqualToString:@"iPhone7,1"]) return @"iPhone 6 Plus";
    
    if ([platform isEqualToString:@"iPhone7,2"]) return @"iPhone 6";
    
    if ([platform isEqualToString:@"iPhone8,1"]) return @"iPhone 6s";
    
    if ([platform isEqualToString:@"iPhone8,2"]) return @"iPhone 6s Plus";
    
    if ([platform isEqualToString:@"iPhone8,4"]) return @"iPhone SE";
    
    if ([platform isEqualToString:@"iPhone9,1"]) return @"iPhone 7";
    
    if ([platform isEqualToString:@"iPhone9,2"]) return @"iPhone 7 Plus";
    
    if ([platform isEqualToString:@"iPhone9,3"]) return @"iPhone 7";
    
    if ([platform isEqualToString:@"iPhone9,4"]) return @"iPhone 7 Plus";
    
    if ([platform isEqualToString:@"iPhone10,1"]) return @"iPhone 8";
    
    if ([platform isEqualToString:@"iPhone10,2"]) return @"iPhone 8 Plus";
    
    if ([platform isEqualToString:@"iPhone10,3"]) return @"iPhone X";
    
    if ([platform isEqualToString:@"iPhone10,4"]) return @"iPhone 8";
    
    if ([platform isEqualToString:@"iPhone10,5"]) return @"iPhone 8 Plus";
    
    if ([platform isEqualToString:@"iPhone10,6"]) return @"iPhone X";
    
    if ([platform isEqualToString:@"iPod1,1"])  return @"iPod Touch 1G";
    
    if ([platform isEqualToString:@"iPod2,1"])  return @"iPod Touch 2G";
    
    if ([platform isEqualToString:@"iPod3,1"])  return @"iPod Touch 3G";
    
    if ([platform isEqualToString:@"iPod4,1"])  return @"iPod Touch 4G";
    
    if ([platform isEqualToString:@"iPod5,1"])  return @"iPod Touch 5G";
    
    if ([platform isEqualToString:@"iPad1,1"])  return @"iPad 1G";
    
    if ([platform isEqualToString:@"iPad2,1"])  return @"iPad 2";
    
    if ([platform isEqualToString:@"iPad2,2"])  return @"iPad 2";
    
    if ([platform isEqualToString:@"iPad2,3"])  return @"iPad 2";
    
    if ([platform isEqualToString:@"iPad2,4"])  return @"iPad 2";
    
    if ([platform isEqualToString:@"iPad2,5"])  return @"iPad Mini 1G";
    
    if ([platform isEqualToString:@"iPad2,6"])  return @"iPad Mini 1G";
    
    if ([platform isEqualToString:@"iPad2,7"])  return @"iPad Mini 1G";
    
    if ([platform isEqualToString:@"iPad3,1"])  return @"iPad 3";
    
    if ([platform isEqualToString:@"iPad3,2"])  return @"iPad 3";
    
    if ([platform isEqualToString:@"iPad3,3"])  return @"iPad 3";
    
    if ([platform isEqualToString:@"iPad3,4"])  return @"iPad 4";
    
    if ([platform isEqualToString:@"iPad3,5"])  return @"iPad 4";
    
    if ([platform isEqualToString:@"iPad3,6"])  return @"iPad 4";
    
    if ([platform isEqualToString:@"iPad4,1"])  return @"iPad Air";
    
    if ([platform isEqualToString:@"iPad4,2"])  return @"iPad Air";
    
    if ([platform isEqualToString:@"iPad4,3"])  return @"iPad Air";
    
    if ([platform isEqualToString:@"iPad4,4"])  return @"iPad Mini 2G";
    
    if ([platform isEqualToString:@"iPad4,5"])  return @"iPad Mini 2G";
    
    if ([platform isEqualToString:@"iPad4,6"])  return @"iPad Mini 2G";
    
    if ([platform isEqualToString:@"iPad4,7"])  return @"iPad Mini 3";
    
    if ([platform isEqualToString:@"iPad4,8"])  return @"iPad Mini 3";
    
    if ([platform isEqualToString:@"iPad4,9"])  return @"iPad Mini 3";
    
    if ([platform isEqualToString:@"iPad5,1"])  return @"iPad Mini 4 (WiFi)";
    
    if ([platform isEqualToString:@"iPad5,2"])  return @"iPad Mini 4 (LTE)";
    
    if ([platform isEqualToString:@"iPad5,3"])  return @"iPad Air 2";
    
    if ([platform isEqualToString:@"iPad5,4"])  return @"iPad Air 2";
    
    if ([platform isEqualToString:@"iPad6,3"])  return @"iPad Pro 9.7";
    
    if ([platform isEqualToString:@"iPad6,4"])  return @"iPad Pro 9.7";
    
    if ([platform isEqualToString:@"iPad6,7"])  return @"iPad Pro 12.9";
    
    if ([platform isEqualToString:@"iPad6,8"])  return @"iPad Pro 12.9";
    
    if ([platform isEqualToString:@"iPad6,11"])  return @"iPad 5 (WiFi)";
    
    if ([platform isEqualToString:@"iPad6,12"])  return @"iPad 5 (Cellular)";
    
    if ([platform isEqualToString:@"iPad7,1"])  return @"iPad Pro 12.9 inch 2nd gen (WiFi)";
    
    if ([platform isEqualToString:@"iPad7,2"])  return @"iPad Pro 12.9 inch 2nd gen (Cellular)";
    
    if ([platform isEqualToString:@"iPad7,3"])  return @"iPad Pro 10.5 inch (WiFi)";
    
    if ([platform isEqualToString:@"iPad7,4"])  return @"iPad Pro 10.5 inch (Cellular)";
    
    if ([platform isEqualToString:@"AppleTV2,1"])  return @"Apple TV 2";
    
    if ([platform isEqualToString:@"AppleTV3,1"])  return @"Apple TV 3";
    
    if ([platform isEqualToString:@"AppleTV3,2"])  return @"Apple TV 3";
    
    if ([platform isEqualToString:@"AppleTV5,3"])  return @"Apple TV 4";
    
    if ([platform isEqualToString:@"i386"])  return @"iPhone Simulator";
    
    if ([platform isEqualToString:@"x86_64"])  return @"iPhone Simulator";

	return @"unKnown";
}
```

# UIDevice 获取设备相关信息

- 系统版本号

```
// 10.3.2
[[UIDevice currentDevice]systemVersion]
```

- 系统名称

```
// iOS
[[UIDevice currentDevice] systemName]
```
- 电池电量

```
//模拟器得到的是 -1
[[UIDevicecurrentDevice]batteryLevel]
```

- 厂商唯一串号

```
//226072EA-5C4C-43F9-9E66-6E8ACE31DE49

[[[UIDevice currentDevice] identifierForVendor]UUIDString]
```

- 用户名

```
///Matt Reach's iPhone
[[UIDevice currentDevice] name]
```

# infoDictionary

App 的版本，应用名称等都记录在 info.plist 里，可以这样获取：

```
NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];

// 应用装到设备上之后，显示的名称  
[infoDictionary objectForKey:@"CFBundleDisplayName"]

// 应用的版本号  比如：6.8.3
[infoDictionary objectForKey:@"CFBundleShortVersionString"];

// 应用的build号  比如：2778
NSString *appCurVersionNum = [infoDictionary objectForKey:kCFBundleVersionKey];
```

其实这个里面信息蛮多的，其他的不再一一列举了：

```html
{
    BuildMachineOSBuild = 16A323;
    CFBundleDevelopmentRegion = "zh_CN";
    CFBundleDisplayName = "\U5343\U5e06-SDK";
    CFBundleExecutable = SohuLiveDemo;
    CFBundleIcons =     {
        CFBundlePrimaryIcon =         {
            CFBundleIconFiles =             (
                AppIcon29x29,
                AppIcon40x40,
                AppIcon57x57,
                AppIcon60x60
            );
        };
    };
    CFBundleIdentifier = "com.sohu.live.demo";
    CFBundleInfoDictionaryVersion = "6.0";
    CFBundleName = SohuLiveDemo;
    CFBundleNumericVersion = 0;
    CFBundlePackageType = APPL;
    CFBundleShortVersionString = "6.8.3";
    CFBundleSignature = "????";
    CFBundleSupportedPlatforms =     (
        iPhoneSimulator
    );
    CFBundleVersion = 1598;
    DTCompiler = "com.apple.compilers.llvm.clang.1_0";
    DTPlatformBuild = "";
    DTPlatformName = iphonesimulator;
    DTPlatformVersion = "10.2";
    DTSDKBuild = 14C89;
    DTSDKName = "iphonesimulator10.2";
    DTXcode = 0821;
    DTXcodeBuild = 8C1002;
    LSApplicationCategoryType = "";
    LSApplicationQueriesSchemes =     (
        wechat,
        weixin,
        alipay,
        qianfan56,
        qfA31D406E33689950,
        mqq
    );
    LSRequiresIPhoneOS = 1;
    MinimumOSVersion = "7.0";
    NSAppTransportSecurity =     {
        NSAllowsArbitraryLoads = 1;
    };
    NSCameraUsageDescription = "\U7231\U4e0a\U76f4\U64ad";
    NSMicrophoneUsageDescription = "\U8bf7\U5141\U8bb8\U6211\U4f7f\U7528\U9ea6\U514b\U98ce";
    NSPhotoLibraryUsageDescription = "\U5343\U5e06SDK\U60f3\U4f7f\U7528\U60a8\U7684\U76f8\U518c";
    UIAppFonts =     (
        "MFLiHei-Regular.ttf"
    );
    UIDeviceFamily =     (
        1
    );
    UILaunchImages =     (
                {
            UILaunchImageMinimumOSVersion = "8.0";
            UILaunchImageName = "Brand Assets-800-Portrait-736h";
            UILaunchImageOrientation = Portrait;
            UILaunchImageSize = "{414, 736}";
        },
                {
            UILaunchImageMinimumOSVersion = "8.0";
            UILaunchImageName = "Brand Assets-800-667h";
            UILaunchImageOrientation = Portrait;
            UILaunchImageSize = "{375, 667}";
        },
                {
            UILaunchImageMinimumOSVersion = "7.0";
            UILaunchImageName = "Brand Assets-700";
            UILaunchImageOrientation = Portrait;
            UILaunchImageSize = "{320, 480}";
        },
                {
            UILaunchImageMinimumOSVersion = "7.0";
            UILaunchImageName = "Brand Assets-700-568h";
            UILaunchImageOrientation = Portrait;
            UILaunchImageSize = "{320, 568}";
        }
    );
    UILaunchStoryboardName = "Launch Screen";
    UIRequiredDeviceCapabilities =     (
        armv7
    );
    UIStatusBarStyle = UIStatusBarStyleDefault;
    UISupportedInterfaceOrientations =     (
        UIInterfaceOrientationPortrait,
        UIInterfaceOrientationLandscapeLeft,
        UIInterfaceOrientationLandscapeRight
    );
    UIViewControllerBasedStatusBarAppearance = 0;
}
```
