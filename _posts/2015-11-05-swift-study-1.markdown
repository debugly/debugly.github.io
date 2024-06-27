---
layout: post
title: "Swift 学习（一）"
date: 2015-11-05 23:46:42 +0800
comments: true
tags: ["iOS"]
---

# Introduction

Swift 最新已经是 2.1 了，更优美了，日趋成熟了，加上公司项目以后可能支持到 iOS7，就可以使用 Swift 写项目了，所以必须学习下了，先看看官方的文档:     
 [Using Swift with Cocoa and Objective-C (Swift 2.1)](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/BuildingCocoaApps/index.html#//apple_ref/doc/uid/TP40014216-CH2-ID0)

# Interoperablility : 互动性

- Initialization

`oc 初始化方法，在swift里省去了with，with后面的变成了参数名：`

```swift
- (instancetype)initWithFrame:(CGRect)frame
style:(UITableViewStyle)style;

init(frame: CGRect, style: UITableViewStyle) { /* ... */ }
```

`oc alloc swift不需要调用，alloc和init一气呵成：`

```swift
UITableView *myTableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStyleGrouped];

let myTableView: UITableView = UITableView(frame: CGRectZero, style: .Grouped)
```

- Class Factory Methods and Convenience Initializers

`oc 工厂方法保留，提供便利性`

```swift
UIColor *color = [UIColor colorWithRed:0.5 green:0.0 blue:0.5 alpha:1.0];

let color = UIColor(red: 0.5, green: 0.0, blue: 0.5, alpha: 1.0)
```
<!--more-->
- Failable Initialization

`oc 初始化失败返回 nil, swift 把这处理成了一种语言特性，称之为 failable initialization.`

```swift
if let image = UIImage(contentsOfFile: "MyImage.jpg") {
// loaded the image successfully
} else {
// could not load the image
}
```
- Accessing Properties

	swift property attributes: nonnull,nullable,null_resettable

	readonly: just a getter {get}

	weak: marked with the weak keyword (weak var)

	assign,copy,strong,unsafe_unretained == oc

	atomic / noatomic : are not reflected in swift(没有用了，不过oc导入swift的时候有用)

	getter= / setter= : are ignoerd by swift(忽略了)

	访问属性使用 dot.
- Working with Methods

`swift 里访问 oc 的方法也可以使用 dot.`

```swift
	oc 方法名被拆开：
[myTableView insertSubview:mySubview atIndex:2];
	swift 方法名是oc的第一段，剩下的段作为参数名，第一个参数并没有参数名！
myTableView.insertSubview(mySubview, atIndex: 2)
	对于没有参数的，直接带个小括号
myTableView.layoutIfNeeded()
```
- id Compatibility

`id compatibility 兼容性：swift include an AnyObject type, is similar to oc's id type;保持类的灵活性；`

```swift
var myObject: AnyObject = UITableViewCell()
myObject = NSDate()

let futureDate = myObject.dateByAddingTimeInterval(10)
let timeSinceNow = myObject.timeIntervalSinceNow
```

`This includes Objective-C compatible methods and properties marked with the @objc attribute.`

- Unrecognized Selectors and Optional Chaining

`和 oc 一样的，AnyObject 对象调用方法不会有警告，如果不能响应，在运行时就会crash;
For example, the following code compiles without a compiler warning, but triggers an error at runtime:`

```swift
myObject.characterAtIndex(5)
// crash, myObject doesn't respond to that method
```

`不过 swift 做的很好！！！
swift use optionals to guard against such unsafe behavior.
swift 使用自选项来规避诸如此类的危险行为。`

`Accessing a property on AnyObject always returns an optional value.
属性访问总是返回自选值；`

- Downcasting AnyObject

`当确定或者能够合理推断时向下转换对象类型；
but can not guaranteed to succeed.`

不确定的时候用 ： as?
```swift
let userDefaults = NSUserDefaults.standardUserDefaults()
let lastRefreshDate: AnyObject? = userDefaults.objectForKey("LastRefreshDate")
if let date = lastRefreshDate as? NSDate {
print("\(date.timeIntervalSinceReferenceDate)")
}
```

确定的时候用： as!
```swift
let myDate = lastRefreshDate as! NSDate
let timeInterval = myDate.timeIntervalSinceReferenceDate
```

如果类型不一致就会报错，有点assert的味道哦
```swift
let myDate = lastRefreshDate as! NSString // Error
```

- Nullability and Optionals

`oc object references can be nil,
swift all values--including structures and object references--are guaranteed to be on-null.`

>value 的 type 是可选的；赋值为 nil 意味着 值的丢失；
Instead, you represent a value that could be missing by wrapping the type of the value in an optional type. When you need to indicate that a value is missing, you use the value nil. For more information about optionals, see Optionals in The Swift Programming Language (Swift 2.1).


| 情形    |   使用    |
|--------|----------|
|针对于个人类型:| _Nullable / _Nonnull |
|针对于个人属性:| nullable / nonnull / null_resettable |
|针对于整个区域:| NS_ASSUM_NONNULL_BEGIN - NS_ASSUM_NONNULL_END |

`如果没有相关的信息，swift 就不能区分是不是自选的，并且将作为 an implicitly unwrapped optional.`

For example, consider the following Objective-C declarations:

```objc
@property (nullable) id nullableProperty;
@property (nonnull) id nonNullProperty;
@property id unannotatedProperty;

NS_ASSUME_NONNULL_BEGIN
- (id)returnsNonNullValue;
- (void)takesNonNullParameter:(id)value;
NS_ASSUME_NONNULL_END

- (nullable id)returnsNullableValue;
- (void)takesNullableParameter:(nullable id)value;

- (id)returnsUnannotatedValue;
- (void)takesUnannotatedParameter:(id)value;
```

Here’s how they’re imported by Swift:

```swift
var nullableProperty: AnyObject?
var nonNullProperty: AnyObject
var unannotatedProperty: AnyObject!

func returnsNonNullValue() -> AnyObject
func takesNonNullParameter(value: AnyObject)

func returnsNullableValue() -> AnyObject?
func takesNullableParameter(value: AnyObject?)

func returnsUnannotatedValue() -> AnyObject!
func takesUnannotatedParameter(value: AnyObject!)
```
- Lightweight Generics 轻型、泛型

For example, consider the following Objective-C property declarations:

```objc
@property NSArray<NSDate *> *dates;
@property NSSet<NSString *> *words;
@property NSDictionary<NSURL *, NSData *> *cachedData;
```
Here’s how Swift imports them:

```swift
var dates: [NSDate]
var words: Set<String>
var cachedData: [NSURL: NSData]
```
除了Foundation这些之外，别的会被忽略；
Aside from these Foundation collection classes, Objective-C lightweight generics are ignored by Swift.
