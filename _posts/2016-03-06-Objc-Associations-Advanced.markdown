---
layout: post
title: "深入理解关联引用"
date: 2016-03-06 09:58:46 +0800
comments: true
tags: ["iOS"]
tocnum: false
---

> 今日吃饱了，确实撑得慌，找了我的邻居-阿杰一起散步，走了好大一圈，最后在小区下聊起了技术，从YYKit，SDWebImage 等第三方库，扯到了关联引用，因为他们都用到了这个技术，然而我又想到了单例，单例和关联引用在实现上有一个相同点---都需要一个静态变量；那么疑问就来了：同样都需要一个静态变量，为什么结果不一样呢？或许你还没明白我的疑问是什么，请继续阅读吧！

### 一、回顾单例


我简单的写了个单例类 **SingletonObject** ，把静态变量 instance 放在 sharedInstance 类方法里看起来可能更好一些，放在外面也是可以的，二者的区别是作用域不同，生命周期也差不多，我个人比较喜欢放在方法内部，因为外部一般不需要直接获取，这里放在外部是为了和我们今天的角儿进行对比，提出我的疑问做铺垫。

```objc
@implementation SingletonObject

static id instance;

+ (instancetype)sharedInstance
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc]init];
    });
    return instance;
}

@end

```

请问你有没有思考过，为什么这里可以实现单例，instance 变量不是每个对象都有一份吗？当然不是的！这个 instance 静态变量的地址是和类 **SingletonObject** 是对应的，也就说 instance 静态变量的地址是确定的，只要这个类的地址确定了，他也就是确定的了，因此可以简单的理解为 instance 静态变量是属于类的，姑且称之为 “**类变量**”，与**实例变量**相对应。

> 实际上这里所谓的 “类变量” 与 Java 之类的面向对象语言里的类变量不是一个意思，Objective C 是没有类变量，这里只是通过静态变量达到这种效果罢了，因此这里我将她称之为 “**类变量**”。


### 二、提出疑问


我们已经知道了静态变量是个“**类变量**”，我们也都用过 SDWebImage，其内部实现正是使用了关联引用，才使得我们使用起来是那么的方便，图片可以准确无误的下载显示出来，也就是说每个 imageView 对应图片都是自己想要的，一一对应的，我的问题来了，既然关联引用也使用了“**类变量**”，那么不应该是 imageView 最终都要显示为同一张图片才对嘛？！虽然你创建了 N 个 imageView ，但是 imageView 的 “**类变量**”（关联引用的 key） 是唯一的啊，这明显是个一对多的关系！可为什么使用 SDWebImage 的时候一切都那么正常，最终图片都一一对应上了，你怎么看呢？我觉得此事必有蹊跷！

### 三、大胆推测

我最后给阿杰做了一个这样的推测：问题肯定在关联引用的处理上，要不然我们就没必要在使用的时候传个 key 进去了，或许正是根据这个 key 做了一个地址偏移什么的，每个对象都能获取元类信息，然后给自身加个偏移存储下这个关联的对象，我们可以从打印静态变量地址，打印堆栈信息，runtime源码入手...

然后就各回各家，各找各妈了...

### 四、揭开神秘面纱

这么大的疑问放心里，肯定睡不着的，回家就开始找源码了，找到了内部实现代码，现在拿出来仔细分析下内部实现：

```c++
//这是我们调用的方法
void objc_setAssociatedObject(id object, const void *key, id value, objc_AssociationPolicy policy)
{
    objc_setAssociatedObject_non_gc(object, key, value, policy);
}
//这是内部的私有方法；
void objc_setAssociatedObject_non_gc(id object, const void *key, id value, objc_AssociationPolicy policy) {
    _object_set_associative_reference(object, (void *)key, value, policy);
}

//设置关联引用对象，最终将调用这个方法
void _object_set_associative_reference(id object, void *key, id value, uintptr_t policy) {
    // 这段代码有点像重写 setter 方法的感觉；old就是赋值之前的老值，要被释放掉的；ObjcAssociation 下面会介绍；
    ObjcAssociation old_association(0, nil);
    // acquireValue：对传入的 value 做 reatain,copy 等策略
    id new_value = value ? acquireValue(value, policy) : nil;
    {
        AssociationsManager manager;//这是重点，每个类都可以创建一个 manager 管理关联的对象，不过 manager 管理的 HashMap 一直都是一个，并且是线程安全的！
        AssociationsHashMap & (manager.associations());//获取唯一的 map 引用；
        disguised_ptr_t disguised_object = DISGUISE(object);//把对象伪装下，说得直白些就是将对象的地址转化为一个 unsigned long 的整型；
        if (new_value) { //如果新值不是空的
            // 这里是 c++ 语法，按照 key 查找 map 里的键值对，返回的是一个 iterator；
            AssociationsHashMap::iterator i = associations.find(disguised_object);
            if (i != associations.end()) { //说明找到了对象对应的 map 了；
                ObjectAssociationMap *refs = i->second; //取 value，first 是取 key http://www.cplusplus.com/reference/unordered_map/unordered_map/
                ObjectAssociationMap::iterator j = refs->find(key);
                if (j != refs->end()) {  //说明在对象对应的 map 里找到了 key 对应的 map ；
                    old_association = j->second; //取值赋给 old，后面会释放；
                    j->second = ObjcAssociation(policy, new_value); //赋上新值；这里包装了下，不是直接赋值，可思考下为什么？
                } else { //说明在对象对应的 map 里没能找到 key 对应的 map ！
                    (*refs)[key] = ObjcAssociation(policy, new_value);
                }
            } else { //找不到对象对应的 map ；第一次肯定都找不到，需要创建；
                // create the new association (first time).
                ObjectAssociationMap *refs = new ObjectAssociationMap;
                associations[disguised_object] = refs; //创建一个 map ，对象是 key;
                (*refs)[key] = ObjcAssociation(policy, new_value); //然后把关联对象放到对象对应的空 map 里；key就是关联引用使用的那个静态变量；
                object->setHasAssociatedObjects(); //做个标记；下次就能够找到了；
            }
        } else { //如果新值是空的，相当于 set 了 nil ；
            // setting the association to nil breaks the association.
            AssociationsHashMap::iterator i = associations.find(disguised_object);
            if (i !=  associations.end()) { //找到了对象对应的 map 了；
                ObjectAssociationMap *refs = i->second; //取出对象对应的 map
                ObjectAssociationMap::iterator j = refs->find(key); //查找 key 对应的 ObjcAssociation
                if (j != refs->end()) {
                    old_association = j->second; //取值赋给 old，后面会释放；
                    refs->erase(j); //从 map 里擦除；
                }
            }
        }
    }
    // 释放 old
    if (old_association.hasValue()) ReleaseValue()(old_association);
}

```

仔细阅读完源码后，疑问马上没了，也挺好理解的，只不过需要一点 c++ 的知识，基本每一行都加了注释，这里就不详细说了，做个简单的总结：

1.使用**AssociationsManager**类管理所有类关联的对象，其内部用静态的（也就是唯一的） **AssociationsHashMap** 存储，map 存的是键值对，这里的键就是这个类的对象（需要处理下），值是 **ObjectAssociationMap**。（这两个 map 有着不同的父类）简单看下AssociationsManager：

```c++
class AssociationsManager {
    static spinlock_t _lock; //还用到了自旋锁
    static AssociationsHashMap *_map; // associative references:  object pointer -> PtrPtrHashMap.
public:
    AssociationsManager()   { spinlock_lock(&_lock); }
    ~AssociationsManager()  { spinlock_unlock(&_lock); }

    AssociationsHashMap &associations() { //c++ 的引用，好难理解清楚引用和指针
        if (_map == NULL)
            _map = new AssociationsHashMap();
        return *_map;
    }
};
```

2.每个对象的**ObjectAssociationMap**里存的当然也是键值对，这里的键就是你定义的关联对象的 key，值是 **ObjcAssociation** ，这里做了一次包装，看下他的源码：

```c++
class ObjcAssociation {
        uintptr_t _policy; //存储策略，这个在销毁对象的时候需要用到；
        id _value;//被包装的对象
    public:
        ObjcAssociation(uintptr_t policy, id value) : _policy(policy), _value(value) {}
        ObjcAssociation() : _policy(0), _value(nil) {}

        uintptr_t policy() const { return _policy; }
        id value() const { return _value; }

        bool hasValue() { return _value != nil; }//还记得上面用到这个方法了吗？
    };
```

3.明白了**setter**方法之后，很容易理解**getter**方法，简单看下**objc_getAssociatedObject**内部的细节：
```c++
//这是我们调用的方法
id objc_getAssociatedObject(id object, const void *key)
{
    return objc_getAssociatedObject_non_gc(object, key);
}

//这是内部的私有方法；
id objc_getAssociatedObject_non_gc(id object, const void *key) {
    return _object_get_associative_reference(object, (void *)key);
}

//获取关联引用对象，最终将调用这个方法
id _object_get_associative_reference(id object, void *key) {
    id value = nil;
    uintptr_t policy = OBJC_ASSOCIATION_ASSIGN;
    {
        AssociationsManager manager;
        AssociationsHashMap &associations(manager.associations());
        disguised_ptr_t disguised_object = DISGUISE(object);
        AssociationsHashMap::iterator i = associations.find(disguised_object);
        if (i != associations.end()) {
            ObjectAssociationMap *refs = i->second;
            ObjectAssociationMap::iterator j = refs->find(key);
            if (j != refs->end()) {
                ObjcAssociation &entry = j->second;
                value = entry.value();
                policy = entry.policy();
                //上面的还是那两步，最后根据key找到对应的关联对象；这里冒出来一个 getter policy，倒是很少遇见！或许在 copy 对象的时候才会遇见吧...
                if (policy & OBJC_ASSOCIATION_GETTER_RETAIN) ((id(*)(id, SEL))objc_msgSend)(value, SEL_retain);
            }
        }
    }
    if (value && (policy & OBJC_ASSOCIATION_GETTER_AUTORELEASE)) {
        ((id(*)(id, SEL))objc_msgSend)(value, SEL_autorelease);
    }
    return value;
}

```


### 五、内存如何管理

关联引用对象是**不需要管理内存**的，这里看下源码就知道怎么回事了；
销毁对象的时候，内部调用了这个方法：
```c++
/***********************************************************************
* objc_destructInstance
* Destroys an instance without freeing memory.
* Calls C++ destructors.
* Calls ARR ivar cleanup.
* Removes associative references.
* Returns `obj`. Does nothing if `obj` is nil.
* Be warned that GC DOES NOT CALL THIS. If you edit this, also edit finalize.
* CoreFoundation and other clients do call this under GC.
**********************************************************************/
void *objc_destructInstance(id obj)
{
    if (obj) {
        // Read all of the flags at once for performance.
        bool cxx = obj->hasCxxDtor();
        bool assoc = !UseGC && obj->hasAssociatedObjects();
        bool dealloc = !UseGC;

        // This order is important.
        if (cxx) object_cxxDestruct(obj);
        if (assoc) _object_remove_assocations(obj);//移除关联的对象
        if (dealloc) obj->clearDeallocating();
    }

    return obj;
}
```
下面看下 **_object_remove_assocations(obj)** 方法：

```c++
void _object_remove_assocations(id object) {
    vector< ObjcAssociation,ObjcAllocator<ObjcAssociation> > elements;
    {
        AssociationsManager manager;
        AssociationsHashMap &associations(manager.associations());
        if (associations.size() == 0) return;
        disguised_ptr_t disguised_object = DISGUISE(object);
        AssociationsHashMap::iterator i = associations.find(disguised_object);
        if (i != associations.end()) {
            // copy all of the associations that need to be removed.
            ObjectAssociationMap *refs = i->second;
            for (ObjectAssociationMap::iterator j = refs->begin(), end = refs->end(); j != end; ++j) {
                elements.push_back(j->second);//Add element at the end //http://www.cplusplus.com/reference/vector/vector/            }
            // remove the secondary table.
            delete refs;
            associations.erase(i);
        }
    }
    // the calls to releaseValue() happen outside of the lock.
    for_each(elements.begin(), elements.end(), ReleaseValue());
}
```
从 manager 里取出类对应的 AssociationsHashMap，然后查找当前对象对应的AssociationsHashMap ；如果找到了，说明这个对象确实使用了关联引用，然后取出对应的 ObjectAssociationMap ；

接着枚举 ObjectAssociationMap ，取出关联的对象，然后放到 vector 的末尾；

最后通过 for_each 操作 vector 里的每一个元素，都去调用 ReleaseValue（）方法；

前面已经见过**ReleaseValue()**这个方法了，这里看下源码：

```c++

static void releaseValue(id value, uintptr_t policy) {
    if (policy & OBJC_ASSOCIATION_SETTER_RETAIN) {//这就是为何要把关联的对象包装一下的原因！
        ((id(*)(id, SEL))objc_msgSend)(value, SEL_release);//发送release消息；
    }
}

struct ReleaseValue {
	//应该是重载运算符了，我的c++知识忘光了耶；
    void operator() (ObjcAssociation &association) {
        releaseValue(association.value(), association.policy());
    }
};
```
由此看来，我们无需关系关联对象的内存管理，当一个对象释放的时候，会自动去释放被关联的对象！这也正好符合内存管理的法则：谁使用谁管理！

### 六、验证类变量

我觉得我的猜测应该是靠谱的，因此我打印了类的起始地址和结束地址，各种类变量地址，全局变量地址，以及对象地址，结果如下：

```objc
2016-03-06 14:17:42.056 StudyAssociationSourceCode[27561:2531350]
-------------
类方法的地址:0x100001770
起始地址:0x100002320
结束地址:0x100002328
@implementation之内，方法之外全局变量地址:0x100002348

实例方法内的静态变量地址:0x100002360
@implementation之外，静态变量地址:0x100002361
@implementation之内，方法之外静态变量地址:0x100002362

对象的起始地址:0x1002005e0
对象的结束地址:0x1002005e8
-------------

-------------
2016-03-06 14:17:42.056 StudyAssociationSourceCode[27561:2531350] association key:0x100002363
```
1.可以看出这几个的地址是连续的：

```objc
0x100002360 :实例方法内的静态变量地址
0x100002361 :@implementation之外，静态变量地址
0x100002362 :@implementation之内，方法之外静态变量地址
0x100002363 :@implementation之外的 association key 静态变量地址【不同的文件】
```
这说明类变量不管写到哪里都是放到了一起的，都在一个区域内；

2.这几个的内存空间是相近的：

```objc
0x100001770 :类方法的地址
0x100002320 :类起始地址
0x100002328 :类结束地址
0x100002348 :全局变量地址
0x100002360 :静态变量变量地址
...
```
这里看起来很是怪异，类方法的地址竟然在类的地址空间之前！！要想解释这个现象就需要知道 OC 对象的继承体系、元类、Class结构体等，这里先卖个关子，后续博客介绍。

大体上看，凡是跟类相关的变量，无论是全局的还是静态的变量或方法的内存都是在一块逻辑区域内分配的；

3.对比类地址和对象地址：

```objc
0x100002320 :类起始地址
0x100600450 :对象的起始地址
```
可以看出他们的内存空间差的很多，这说明了在内存分配上类和对象是分开的！更加具体的细节以后验证吧，我现在也不能把他们说明白。

这是我测试工程的地址：[https://github.com/debugly/StudyAssociationSourceCode](https://github.com/debugly/StudyAssociationSourceCode)

### 七、总结

一切都清楚了，对于 **“类变量” ** 的理解也是没错的，简单的说：类变量是属于类的，实例变量是属于对象的，清楚这一点有利于我们在编码过程中正确的使用使用类变量，迅速找到使用类变量埋下坑，类变量属于类这一特性有时候真的可能会给你带来问题，比如你写一个局部静态变量，页面每次进来都修改下这个值，可是你会发现第二次进来的时候他仍旧是上次修改过的，或许这不是你想看到的！

关联引用的实现如此巧妙，元类如此的迷人，这些都需要继续深入学习才能体会得到！苹果把 Runtime 开源了，那么我们就有必要去看看源码，即使我们不能为之作出什么贡献，但至少可以提升自身，对于知识体系的形成都有很大帮助！

不足之处请多多指正！
