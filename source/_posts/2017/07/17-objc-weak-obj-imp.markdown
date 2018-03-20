---
layout: post
title: "源码分析 weak 对象自动置空原理"
date: 2017-07-18 7:40:28 +0800
comments: true
tags: iOS
keywords: ios weak,dealloc,nil
---

> 我们都知道 weak 修饰的变量，在对象释放后，会自动置为 nil，这一机制减少了大量的野指针崩溃；我们还知道在 dealloc 里不要 weak 修饰 self 对象，否则当对象 dealloc 时就会崩溃掉；一起看下源码实现吧!

## 下载源码

虽然 iOS 不是开源的，但是 OBJC 这部分代码是 Open的，下载地址 : [objc4-709.tar.gz](https://opensource.apple.com/tarballs/objc4/) 。这是第二次阅读 objc 源码，第一次是分析关联引用实现原理时阅读的 : [深入理解关联引用](/ios/2016/03/06/Objc-Associations-Advanced.html#1);我猜测 weak 的实现和关联对象应该是大同小异的，思路上应该是相同的，应该也是在创建后存表，dealloc 时置空，然后从表里移除掉。

## 注册 weak 变量

初始化一个 weak 指针时会走 objc_initWeak 函数:

```objc
/** 
 * Initialize a fresh weak pointer to some object location. 
 * It would be used for code like: 
 *
 * (The nil case) 
 * __weak id weakPtr;
 * (The non-nil case) 
 * NSObject *o = ...;
 * __weak id weakPtr = o;
 * 
 * This function IS NOT thread-safe with respect to concurrent 
 * modifications to the weak variable. (Concurrent weak clear is safe.)
 *
 * @param location Address of __weak ptr. 
 * @param newObj Object ptr. 
 */
 
id objc_initWeak(id *location, id newObj)
{
    if (!newObj) {
        *location = nil;
        return nil;
    }

    return storeWeak<DontHaveOld, DoHaveNew, DoCrashIfDeallocating>
        (location, (objc_object*)newObj);
}
```

内部会走 objc_storeWeak 方法来存储你声明的 weak 变量 :

```objc
/** 
 * This function stores a new value into a __weak variable. It would
 * be used anywhere a __weak variable is the target of an assignment.
 * 
 * @param location The address of the weak pointer itself
 * @param newObj The new object this weak ptr should now point to
 * 
 * @return newObj
 */

id objc_storeWeak(id *location, id newObj)
{
    return storeWeak<DoHaveOld, DoHaveNew, DoCrashIfDeallocating>
        (location, (objc_object *)newObj);
}
```

内部则调用了 storeWeak 这个函数，其实这个注释已经说的很明白了，**如果 CrashIfDeallocating 是 true 的话，当 newObj 正在 dealloc 或者 newObj 不支持 weak 就会崩溃！**调用的时候传的是枚举值 DoCrashIfDeallocating，正是 true ！所以上一篇博客里提到的在 dealloc 里使用 weak self 会崩溃，立即 [传送](/ios/2017/07/17/weakself-in-dealloc-cause-crash.html) ！

```objc
// Update a weak variable.
// If HaveOld is true, the variable has an existing value 
//   that needs to be cleaned up. This value might be nil.
// If HaveNew is true, there is a new value that needs to be 
//   assigned into the variable. This value might be nil.
// If CrashIfDeallocating is true, the process is halted if newObj is 
//   deallocating or newObj's class does not support weak references. 
//   If CrashIfDeallocating is false, nil is stored instead.
enum CrashIfDeallocating {
    DontCrashIfDeallocating = false, DoCrashIfDeallocating = true
};
template <HaveOld haveOld, HaveNew haveNew,
          CrashIfDeallocating crashIfDeallocating>
          
static id storeWeak(id *location, objc_object *newObj)
{
    assert(haveOld  ||  haveNew);
    if (!haveNew) assert(newObj == nil);

    Class previouslyInitializedClass = nil;
    id oldObj;
    SideTable *oldTable;
    SideTable *newTable;

    // Acquire locks for old and new values.
    // Order by lock address to prevent lock ordering problems. 
    // Retry if the old value changes underneath us.
 retry:
    if (haveOld) {
        oldObj = *location;
        oldTable = &SideTables()[oldObj];
    } else {
        oldTable = nil;
    }
    if (haveNew) {
        newTable = &SideTables()[newObj];
    } else {
        newTable = nil;
    }

    SideTable::lockTwo<haveOld, haveNew>(oldTable, newTable);

    if (haveOld  &&  *location != oldObj) {
        SideTable::unlockTwo<haveOld, haveNew>(oldTable, newTable);
        goto retry;
    }

    // Prevent a deadlock between the weak reference machinery
    // and the +initialize machinery by ensuring that no 
    // weakly-referenced object has an un-+initialized isa.
    if (haveNew  &&  newObj) {
        Class cls = newObj->getIsa();
        if (cls != previouslyInitializedClass  &&  
            !((objc_class *)cls)->isInitialized()) 
        {
            SideTable::unlockTwo<haveOld, haveNew>(oldTable, newTable);
            _class_initialize(_class_getNonMetaClass(cls, (id)newObj));

            // If this class is finished with +initialize then we're good.
            // If this class is still running +initialize on this thread 
            // (i.e. +initialize called storeWeak on an instance of itself)
            // then we may proceed but it will appear initializing and 
            // not yet initialized to the check above.
            // Instead set previouslyInitializedClass to recognize it on retry.
            previouslyInitializedClass = cls;

            goto retry;
        }
    }

    // Clean up old value, if any.
    if (haveOld) {
        weak_unregister_no_lock(&oldTable->weak_table, oldObj, location);
    }

    // Assign new value, if any.
    if (haveNew) {
        newObj = (objc_object *)
            weak_register_no_lock(&newTable->weak_table, (id)newObj, location, 
                                  crashIfDeallocating);
        // weak_register_no_lock returns nil if weak store should be rejected

        // Set is-weakly-referenced bit in refcount table.
        if (newObj  &&  !newObj->isTaggedPointer()) {
            newObj->setWeaklyReferenced_nolock();
        }

        // Do not set *location anywhere else. That would introduce a race.
        *location = (id)newObj;
    }
    else {
        // No new value. The storage is not changed.
    }
    
    SideTable::unlockTwo<haveOld, haveNew>(oldTable, newTable);

    return (id)newObj;
}
```


内部调用 weak_register_no_lock 注册一个 weak指针和对象的键值对，然后返回；如果注册的时候发现该对象正在 dealloc 则会崩溃，并且通过 _objc_fatal 方法留了遗言！！

```objc
/** 
 * Registers a new (object, weak pointer) pair. Creates a new weak
 * object entry if it does not exist.
 * 
 * @param weak_table The global weak table.
 * @param referent The object pointed to by the weak reference.
 * @param referrer The weak pointer address.
 */
id 
weak_register_no_lock(weak_table_t *weak_table, id referent_id, 
                      id *referrer_id, bool crashIfDeallocating)
{
    objc_object *referent = (objc_object *)referent_id;
    objc_object **referrer = (objc_object **)referrer_id;

    if (!referent  ||  referent->isTaggedPointer()) return referent_id;

    // ensure that the referenced object is viable
    bool deallocating;
    if (!referent->ISA()->hasCustomRR()) {
        deallocating = referent->rootIsDeallocating();
    }
    else {
        BOOL (*allowsWeakReference)(objc_object *, SEL) = 
            (BOOL(*)(objc_object *, SEL))
            object_getMethodImplementation((id)referent, 
                                           SEL_allowsWeakReference);
        if ((IMP)allowsWeakReference == _objc_msgForward) {
            return nil;
        }
        deallocating =
            ! (*allowsWeakReference)(referent, SEL_allowsWeakReference);
    }

    if (deallocating) {
        if (crashIfDeallocating) {
            _objc_fatal("Cannot form weak reference to instance (%p) of "
                        "class %s. It is possible that this object was "
                        "over-released, or is in the process of deallocation.",
                        (void*)referent, object_getClassName((id)referent));
        } else {
            return nil;
        }
    }

    // now remember it and where it is being stored
    weak_entry_t *entry;
    if ((entry = weak_entry_for_referent(weak_table, referent))) {
        append_referrer(entry, referrer);
    } 
    else {
        weak_entry_t new_entry(referent, referrer);
        weak_grow_maybe(weak_table);
        weak_entry_insert(weak_table, &new_entry);
    }

    // Do not set *referrer. objc_storeWeak() requires that the 
    // value not change.

    return referent_id;
}
```

这里只能猜测 runtime 是通过引用计数是否为 0 来判断一个对象是否是处于 deallocing 状态的，因为 SEL_allowsWeakReference 这个函数的定义是找不到的！但是我们从源码上可以确切的了解到，如果对象正在 deallocing 不能让他使用 weak 修饰！否者就崩溃掉了！！

```
if (deallocating) {
    if (crashIfDeallocating) {
        _objc_fatal("Cannot form weak reference to instance (%p) of "
                    "class %s. It is possible that this object was "
                    "over-released, or is in the process of deallocation.",
                    (void*)referent, object_getClassName((id)referent));
    } else {
        return nil;
    }
}
```
objc 里封装了 _objc_fatal 这个函数用于停止程序，并且搞个遗言，内部则是调用了 _objc_fatalv

```objc
void _objc_fatal(const char *fmt, ...)
{
    va_list ap; 
    va_start(ap,fmt); 
    _objc_fatalv(OBJC_EXIT_REASON_UNSPECIFIED, 
                 OS_REASON_FLAG_ONE_TIME_FAILURE, 
                 fmt, ap);
}
```

_objc_fatalv 属于内部私有方法，可以正常 exit，也可以 abort，取决于 DebugDontCrash

```objc
void _objc_fatalv(uint64_t reason, uint64_t flags, const char *fmt, va_list ap)
{
    char *buf1;
    vasprintf(&buf1, fmt, ap);

    char *buf2;
    asprintf(&buf2, "objc[%d]: %s\n", getpid(), buf1);
    _objc_syslog(buf2);

    if (DebugDontCrash) {
        char *buf3;
        asprintf(&buf3, "objc[%d]: HALTED\n", getpid());
        _objc_syslog(buf3);
        _Exit(1);
    }
    else {
        abort_with_reason(OS_REASON_OBJC, reason, buf1, flags);
    }
}
```

上面的流程大致是将 weak 描述的变量存起来的过程，我们再挖掘下对象释放后，weak 变量自动置空的逻辑:

## dealloc 时清理掉 weak 变量

既然我们知道了结论，那么就直接从 dealloc 开始看方法调用吧:

```objc
- (void)dealloc {
    _objc_rootDealloc(self);
}

void _objc_rootDealloc(id obj)
{
    assert(obj);

    obj->rootDealloc();
}

inline void objc_object::rootDealloc()
{
    if (isTaggedPointer()) return;
    object_dispose((id)this);
}

id object_dispose(id obj) 
{
    return (*_dealloc)(obj); 
}

///注意 _dealloc 其实就是 _object_dispose
id (*_dealloc)(id) = _object_dispose;

static id _object_dispose(id anObject) 
{
    if (anObject==nil) return nil;

    objc_destructInstance(anObject);
    
    anObject->initIsa(_objc_getFreedObjectClass ()); 

    free(anObject);
    return nil;
}
```

看注释可以知道，这个方法是干清理的工作的，不释放对象的内存；具体是清理关联应用的对象和存储的 weak 指针 : 

```
/***********************************************************************
* objc_destructInstance
* Destroys an instance without freeing memory. 
* Calls C++ destructors.
* Removes associative references.
* Returns `obj`. Does nothing if `obj` is nil.
* CoreFoundation and other clients do call this under GC.
**********************************************************************/

void *objc_destructInstance(id obj) 
{
    if (obj) {
        Class isa = obj->getIsa();

        if (isa->hasCxxDtor()) {
            object_cxxDestruct(obj);
        }
		 ///之前看关联引用的时候，已经看过这个方法
        if (isa->instancesHaveAssociatedObjects()) {
            _object_remove_assocations(obj);
        }
		 ///今天来看下清理 weak 指针的方法吧
        objc_clear_deallocating(obj);
    }

    return obj;
}

void objc_clear_deallocating(id obj) 
{
    assert(obj);

    if (obj->isTaggedPointer()) return;
    obj->clearDeallocating();
}


inline void objc_object::clearDeallocating()
{
    sidetable_clearDeallocating();
}

void objc_object::sidetable_clearDeallocating()
{
    SideTable& table = SideTables()[this];

    // clear any weak table items
    // clear extra retain count and deallocating bit
    // (fixme warn or abort if extra retain count == 0 ?)
    table.lock();
    RefcountMap::iterator it = table.refcnts.find(this);
    if (it != table.refcnts.end()) {
        if (it->second & SIDE_TABLE_WEAKLY_REFERENCED) {
            weak_clear_no_lock(&table.weak_table, (id)this);
        }
        table.refcnts.erase(it);
    }
    table.unlock();
}

/** 
 * Called by dealloc; nils out all weak pointers that point to the 
 * provided object so that they can no longer be used.
 * 
 * @param weak_table 
 * @param referent The object being deallocated. 
 */
void 
weak_clear_no_lock(weak_table_t *weak_table, id referent_id) 
{
    objc_object *referent = (objc_object *)referent_id;

    weak_entry_t *entry = weak_entry_for_referent(weak_table, referent);
    if (entry == nil) {
        /// XXX shouldn't happen, but does with mismatched CF/objc
        //printf("XXX no entry for clear deallocating %p\n", referent);
        return;
    }

    // zero out references
    weak_referrer_t *referrers;
    size_t count;
    
    if (entry->out_of_line()) {
        referrers = entry->referrers;
        count = TABLE_SIZE(entry);
    } 
    else {
        referrers = entry->inline_referrers;
        count = WEAK_INLINE_COUNT;
    }
    
    for (size_t i = 0; i < count; ++i) {
        objc_object **referrer = referrers[i];
        if (referrer) {
            if (*referrer == referent) {
                *referrer = nil;
            }
            else if (*referrer) {
                _objc_inform("__weak variable at %p holds %p instead of %p. "
                             "This is probably incorrect use of "
                             "objc_storeWeak() and objc_loadWeak(). "
                             "Break on objc_weak_error to debug.\n", 
                             referrer, (void*)*referrer, (void*)referent);
                objc_weak_error();
            }
        }
    }
    
    weak_entry_remove(weak_table, entry);
}
```

找了半天，我们想看到的代码无非是在dealloc里执行置空和从table里移除：

```
if (*referrer == referent) {
    *referrer = nil;
}
weak_entry_remove(weak_table, entry);

```

截止到今日，了解了对象 dealloc 时系统框架到底做了什么，清楚的知道了关联引用对象的生命周期和 weak 变量置空的原理，对于日后修改一些问题，实现某些特性的逻辑(网络库里的自动取消就是通过关联引用做的，利用了对象释放时，自动释放关联对象这一特性)，就更加有把握了！

注：objc 的源码是一直在更新的，如果你看的不是 objc4-709.tar.gz 这个包的话，可能源码与我贴的有差异！