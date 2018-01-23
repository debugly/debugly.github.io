---
layout: post
title: "初识 Liquid 模板语言"
date: 2017-05-21 16:37:51 +0800
comments: true
tags: Script
keywords: Liquid
---

> 去年 11 月，我开始使用 Jekyll 搭建静态博客系统，由于默认的主题过于简陋，因此我为自己定制了主题，Jekyll 使用 Liquid 模板标记语言作为模板引擎，所以要定制主题，就不得不去学习下 [Liquid](https://shopify.github.io/liquid/tags/variable/) 这个标记语言，如果你点进去看的话，你会发现我的主题跟这个惊人的相似...

我没有足够的时间去学习，或者说我觉得也不需要去系统的掌握，简单入门后，用到哪里查哪里就行了，写这篇博客的目的是记录下我用过的语法，方便以后查阅。


Liquid 是一门标记语言，所以不要跟 C，Java 这些高级语言相比，她的功能是比较简单的，不过她也有自己的特色，是 C，Java 这些高级语言所不具备的，往下看吧，你会见识到的！

## 基础语法

Liquid 代码可以分为三类：对象，标记，过滤器；

#### 1、对象 Object

取出对象的值:

```
{{ page.title }}
```

比如，我们现在有一个模板页面，需要把博客标题当做 HTML 页面的 title，也就是说这块需要动态替换，只需这么写：

```html
<title>{{ page.title }}</title>
```

当生成 HTML 静态页面时，就会取出博客里定义的 title 值，然后放到 &lt;title&gt; 标签里，这就是一个最简单的模板！

标记用来处理逻辑，经常用的有声明变量，包含文件，if else 分支语句，for 循环等；比如：

```html
<title>
 {% if page.title %}
	{{ page.title }}
 {% else %}
	{{ site.title }}
 {% endif %}
</title>
```

这些逻辑代码是不会显示到页面上的，最后得到就是取出的对象值。下面是我首页的代码，意思是取最近发布的 5 篇博文：

```html
{% for post in site.posts limit:5 %}

    <div id="post-li">
      <div class="cardheader"> ///文章标题
        <a href="{{ post.url }}#0"> {{ post.title }} </a>
      </div>
      <div class="cardcontent">
        <span>///文章简介，最多120字
          {% if post.excerpt %}{{ post.excerpt | strip_html | strip_newlines | truncate: 120 }}{% endif %}
        </span>
      </div>
      <div class="cardfooter">///发布日期
        <span> {{ post.date | date: "%m月%d日 %y年" }} </span>
      </div>
    </div>

{% endfor %}
```

可以将相同的页面抽取出来，然后使用 include 标记包含，比如首页包含了导航：

```html
{% include navigation.html %}
```

有的时候，确实是要按照你写的原封不动的输出，而不是让 Liquid 去处理，怎么办？可以使用 **raw** 标签解决，其实上面这个 inlcude 例子的代码就是通过 raw 标签实现了，否则 Liquid 就真的会将这个页面导入了！我是这么写的：

```html
<div class="language-html highlighter-rouge">
<pre class="highlight">
<code>&#123;&#23;&#37; raw &#37;&#125; &#123;&#37; include navigation.html &#37;&#125; &#123;&#37; endraw &#37;&#125;
</code></pre>
</div>
```

如果除去样式的话，这就是首页博客列表的全部核心代码了，怎么样简单吧！

#### 3、过滤器 Filter

其实上面已经用到了过滤器了，不得不说确实很强大，有点 Shell 管道的意思，连符号也和管道一样 "\|" ，其作用是将对象的值在输出之前做个处理，并且可以连续使用多个过滤器，从左到右一个个的处理！比如：

```html
//将日期对象进行格式化后再输出：05月21日 17年
{{ post.date | date: "%m月%d日 %y年" }}
```

这就是最基础的语法了，所以接下来就可以开始写模板了，现在看下我的归档页面核心代码吧：

```html
//使用 assign 标记，给变量赋值，变量没有具体类型，跟js一个样
{% assign year = false %}
//遍历所有文章
{% for post in site.posts %}
	//取出这篇文章的发表时间，使用过滤器获得年份，比如：2017
	{% assign pyear = post.date | date:'%Y' %}
	//如果和外面那个year变量不相等，则将改年份显示为标题，并且重新记录该年份，直到出现别的年份时再次显示为标题，重新赋值，一直重复这个逻辑
	{% if pyear != year %}
	 {% assign year = pyear %}
	 <h1 class="year p-header"> {{year}} 年</h1>
	{% endif %}
	 <ul class="post-list">
		<li>
		  <div class="row" >
		     //显示该文章的标题和时间
			 <div class="col-md-2">
				<span class="meta-date">{{ post.date | date:"%m月%d日"}}</span>
			 </div>
			 <div class="col-md-10">
				<a class="meta-title" href="{{ post.url }}#1">{{ post.title }}</a>
				//遍历该文章的所属的分类，一一显示出来
				{% for category in post.categories %}
				    //点击分类进入该类的列表页面，url_encode作用是进行url编码这个地址
					<a class="meta-category" href="/categories/{{ category | url_encode }}/index.html">[{{ category }}]</a>
				{% endfor %}
			 </div>
			</div>
		 </li>
		</ul>
{% endfor %}
```

**常用过滤器汇总：**

- date : 格式化日期
- first : 取数组第一个元素
- last : 取数组最后一个元素
- sort : 对数组元素排序
- size : 字符串、数组的长度
- url_encode : url 编码字符串
- minus : 做减法运算，在计算两个日期间隔时，我使用过
- strip : 去掉前后空格，tabs，换行
- [more filters](https://shopify.github.io/liquid/filters/abs/)

## Jekyll 内置对象

学习了这几个案例之后，是不是就可以开始写自己的模板了，按理来说是的，因为你已经入门了，但是现在还有个问题，如何知道可使用哪些 Liquid 对象呢？以上案例中的 post.title , site.posts , post.categories 对象都是哪里来的？

这个问题可以在 Jekyll 的官网找到答案：[Liquid Variables](https://jekyllrb.com/docs/variables/)，Jekyll 已经为你内置了很多对象了，你可以去查询。我列举下我的博客用到的对象，方便读者快速的上手：

- site 对象 : 整个站点抽象出来的对象
	- categories 属性，整个站点的所有分类[category]
		- 每个分类category是个数组[name,posts]，第一个元素是该分类的名称，第二个元素是所有属于该分类的文章，可以通过 first、last 过滤器快速的取出来
	- posts 属性，整个站点的所有文章[post]
		- post 对象 : 对应一篇博客
			- date : 发布日期，常用过滤器 : date:"%y年%m月%d日"
			- title : 博客标题
			- excerpt : 简介
- page 对象 : 代表当前页面
	- date : 页面对应博客的发布日期
	- previous : 该篇文章的上一篇博客
		- title : 标题
		- url : 地址
	- next :
		- title : 标题
		- url : 地址
- content 对象 : 文章的内容，解析后的HTML，并非 Markdown 哦

#### 问：post 和 page 对象的属性差不多，该如何选择 ？

我最初也有些糊涂，已经有 post 对象了，干嘛还搞个 page 对像呢？其实是这样的，post 是 site 的属性，想要获取 post 必须要通过 site 对象！当写一个归档页面，或者分类页面模板时非常有用！但是当你写博客正文的模板时，还使用post对象的话，就显得很费劲了，你可能都不知道该怎么从 posts 数组里获取到当前博客对应的 ‘post’ ！因此，这时就是 page 对象展现魅力的大好时刻，page 对象就是当前页面的抽象，你可以轻松地获取到标题，时间等，除此之外还能获取到前一页和后一页呢！

## 学习地址:

- [shopify.github.io](https://shopify.github.io/liquid/tags/variable/)
- [liquid.bootcss.com](https://liquid.bootcss.com/)

## 完

Liquid 标记语言的使用方法，Jekyll 内置对象就先介绍到这里，接下来你可以尝试去写属于自己的博客模板了，有问题的话，可以留言交流！
