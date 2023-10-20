---
layout: post
title: "学习多线程需要明白的概念"
date: 2015-07-20 10:20:11 +0800
comments: true
tags: ["Other"]
---

> 学习多线程开发前，我们需要知道很多的概念，这也是我曾经比较困惑的，至少别人问我的时候，我说不清楚，下面就针对这些概念总结下：

* 进程

    操作系统早已经是多任务的了，早期她还有个名字叫多道程序；正是这个伟大的发明，我们才能享受一边听歌，一边写文档，一边聊天的乐趣；其实我们运行的程序都是来回切换的，只不过速度过快，我们无法感知而已，如何切换是由操作体统调度的，有相应的调度算法。我们只需要明白应用程序开启后，操作系统会为之开辟一个进程，她拥有地址空间，数据，以及各种资源等，当进程终止时，这些创建的资源被销毁，系统的资源被释放或者关闭。进程（程序）每隔一段时间就会暂停，保存下他的工作环境，然后开始运行另外一个进程，恢复他的现场，执行这个进程的任务，就这样循环的暂停，恢复，暂停，恢复...很多系统使用的是时间片轮转调度，也就是说每个进程（程序）运行的时间是平均分配的；

    作业调度算法补充：
    先进先出（FIFO）,最短作业优先法（SJF）,最高响应比优先法（HRN）,定时轮转法,优先数法,事件驱动法,各种不同类型作业搭配调度算法等.

* 线程

    我们已经知道了进程是被操作系统调度的单位，是一个应用的象征，而线程时操作系统能够调度的最小单位，他被包含在进程之中，是进程的实际运作单位；一个进程中可以并发多个线程，每条线程并行执行不同的任务，Unix System中称为轻量级进程；也就是说线程是属于进程的，同一个进程中的线程共享进程中的全部系统资源，如虚拟地址空间，IO，信号等；但同一和进程中的多个线程有各自的调用栈，自己的寄存器环境等；

    多线程:程序启动后，系统为程序创建了一个进程，每一个进程都会有一个主执行线程，且被默认创建，为了充分利用CPU，我们也会创建线程，做一些想做的事情，这样就会出现一个进程包含多个线程的情况；

> 在多核或多CPU，或支持Hyper-threading的CPU上使用多线程程序设计的好处是显而易见，即提高了程序的执行吞吐率。在单CPU单核的计算机上，使用多线程技术，也可以把进程中负责IO处理、人机交互而常备阻塞的部分与密集计算的部分分开来执行，编写专门的workhorse线程执行密集计算，从而提高了程序的执行效率。

* 并发

    对于单核CPU来说的，操作系统会按照一定的调度算法切换线程，让各个线程都能执行的方式叫做并发。描述的是任务之间的关系。

* 并行

    对于多核的CPU来说，可以同时让两个以上的线程同时运行，这种执行方式叫做并行。

* 同步、异步

    他们是描述任务何时返回（完成）和派发任务所在线程之间的关系问题的；
    比如在主线程使用xx()函数派发了一个新任务，如果只有当xx()函数执行完才能返回到主线程，那么这个函数xx就是同步的，特点是阻塞线程；
    如果，在主线程派发了之后，立马返回了，无需等待任务的完成，那么这个函数就是异步的；

* 临界区

    多线程环境下，可能会有资源被多个线程访问的情况，这样一来二去，这个资源就变得不可信了，变了质了，不再是准确的了；这当然也不是我们想要的；后续博客会解决这个不可信问题，也就是多线程同步问题！(ps :这里说的同步跟上面提到的同步，异步不是一个概念哦！)

参考的文档：

* [https://zh.wikipedia.org/wiki/多任务处理](https://zh.wikipedia.org/wiki/多任务处理)
* [https://zh.wikipedia.org/wiki/线程](https://zh.wikipedia.org/wiki/线程)
* [https://books.google.co.jp/books?id=qjNUgoRkXLMC&pg=PA57&lpg=PA57&dq=多任务+操作系统+出现&source=bl&ots=AKZJIbR047&sig=BkOHhV_ZEAZx2p0LjyCS3FcJWfc&hl=zh-CN&sa=X&ved=0CEoQ6AEwCWoVChMI79yjtt3oxgIVgxmUCh3vcgnL#v=onepage&q=多任务%20操作系统%20出现&f=false](https://books.google.co.jp/books?id=qjNUgoRkXLMC&pg=PA57&lpg=PA57&dq=多任务+操作系统+出现&source=bl&ots=AKZJIbR047&sig=BkOHhV_ZEAZx2p0LjyCS3FcJWfc&hl=zh-CN&sa=X&ved=0CEoQ6AEwCWoVChMI79yjtt3oxgIVgxmUCh3vcgnL#v=onepage&q=多任务%20操作系统%20出现&f=false)
* [https://www.freebsd.org/doc/zh_CN.UTF-8/books/handbook/basics-processes.html](https://www.freebsd.org/doc/zh_CN.UTF-8/books/handbook/basics-processes.html)
* [https://github.com/nixzhu/dev-blog/blob/master/2014-04-19-grand-central-dispatch-in-depth-part-1.md](https://github.com/nixzhu/dev-blog/blob/master/2014-04-19-grand-central-dispatch-in-depth-part-1.md)
* [http://www.zhihu.com/question/19901763](http://www.zhihu.com/question/19901763)
* [http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html](http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)
