---
layout: post
title: "使用 Jekyll 搭建博客"
date: 2016-11-27 16:21:35 +0800
tags: Script
---

博客大改版
========

在此之前使用的是 [Octopress](http://octopress.org/) 博客系统，或许是厌倦了吧，因此改为直接使用 [Jekyll](http://jekyllrb.com/) 来搭建,花了几个晚上的时间，一步步摸索着做了个 Jekyll 的主题出来，毕竟 Jekyll 的主题不是一个 Geek 想要的，我前端能力有限，所以目前这个主题只是能用而已，so 就没不做主题包（丢人现眼）了，如果有需要的请联系我，我（厚着脸皮）做一个。

亲身感受
=======

如果你看到了我的博客，那么我的建议是去折腾一下自己吧，不要直接使用这些已经做好的系统，如果你有时间和兴趣的话，因为你会从中学到很多东西，你可能要学习这些：

- DIV + CSS （[SASS](http://sass-lang.com/)）
- [Pygments](http://pygments.org/)
- [Jekyll](http://jekyllrb.com/)
- [Liquid](https://shopify.github.io/liquid/)
- Ruby 's Task

`DIV + CSS`: 排版很大程度上是个体力活，我更多的是在纠结何时应该使用 id 还是 class !还有一些我们需要知道的小技巧，比如我们知道一个 class 类型的样式，可供多个 HTML 元素使用，但有的时候你想对某一种使用了改class的元素额外加样式应该怎么写？这个其实很简单，但对于非前端工程师而言，你不得不去 Google 度娘了吧：

```css
///只有使用 highlight 样式的 pre 标签背景设置为 #dedede.
pre.highlight{
	background:#dedede;
}
```

`Pygments` : 是用来做代码高亮使用的，你需要做的很简单，就是选个模板而已，你可以在线选择，这是我创建的一个 OC demo: [oc method](http://pygments.org/demo/6324467/)，使用如下命令生成一个样式，然后你放进你的网站里，在HTML里引入就可以了：

```shell
pygmentize -S xcode -f html > pygments.css
```

`Jekyll` : 即使你什么都不去了解，这个博客系统也是完整的，可以生成一个网站哦！自有像我一样，想自己写主题，你才需要学习这么多，比如需要了解内置变量，因为你肯定需要获取博客的日期、标题、内容等，这些是有对应的内置变量的去查文档就好了；还有一些命令，我的自动化部署其实也是封装的这些命令和 Git 操作的命令而已。

`Liquid` : 他的作用是帮助你实现动态化，你就只管写布局好了，生成的时候，会把你写的博客内容替换为对应的模板标签；作为一个模板引擎，我觉得很赞的是他内置的很多 Filters，以及这种编程范式，比如：

```html
{% raw %}
{{ article.published_at | date: "%Y" }}
//2016
{% endraw %}
```

`Ruby`: 这门语言我并没有系统的学习过，都是用到哪去查哪，所以不敢多说，觉得他的 block 也是很赞的， Liquid 的 Filter 跟这个类似，比如：

```
(Dir["#{deploy_dir}/*"]).each { |f| rm_rf(f) }
//each后面的括号就是block体
```

一般我们写 Task 都是用于完成一些流程化的工作，从而节省时间和体力，今天下午借鉴了 Octopress 的 Rakefile，借鉴的前提是要理解，所以经过这么一折腾，对于 Octopress 的理解也加深了不少，然后我自己也为我的博客系统写了一个，保持相同的命名，毕竟我已经习惯了使用 `rake deploy`，`rake preview` 等命令。下面是一个最简单的 Rake Task ：

```ruby
desc "Task description"
task :printit, [:msg] do |t, args|
  puts args[:msg]
end

//execute
rake printit['Hello.']
//result
Hello.
```

怎么样？基本了解了自建主题需要的知识后，对你而言有困难吗？是让你更加畏惧了，还是立马有兴趣要开搞了？

> 这些网站也许对你有些帮助：

- [http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)
- [http://www.ruanyifeng.com/blog/2012/06/sass.html](http://www.ruanyifeng.com/blog/2012/06/sass.html)
- [http://havee.me/internet/2013-08/support-pygments-in-jekyll.html](http://havee.me/internet/2013-08/support-pygments-in-jekyll.html)
- [http://9leg.com/other/2015/01/11/create-jekyll-markdown-by-java.html](http://9leg.com/other/2015/01/11/create-jekyll-markdown-by-java.html)
- [http://www.sassmeister.com/](http://www.sassmeister.com/)
- [http://xh.5156edu.com/page/z1015m9220j18754.html](http://xh.5156edu.com/page/z1015m9220j18754.html)
- [http://cobwwweb.com/4-ways-to-pass-arguments-to-a-rake-task](http://cobwwweb.com/4-ways-to-pass-arguments-to-a-rake-task)
- [https://docs.ruby-lang.org/en/2.1.0/Rake/FileList.html](https://docs.ruby-lang.org/en/2.1.0/Rake/FileList.html)
- [http://suanfazu.com/t/copy-a-file-creating-directories-as-necessary-in-ruby/12396](http://suanfazu.com/t/copy-a-file-creating-directories-as-necessary-in-ruby/12396)
- [http://zhaoyuxiang.cn/bohu-jekyll-theme/index](http://zhaoyuxiang.cn/bohu-jekyll-theme/index)
- [http://yongyuan.name/blog/collect-jekyll-theme.html](http://yongyuan.name/blog/collect-jekyll-theme.html)
- [https://liungkejin.github.io/about.html](https://liungkejin.github.io/about.html)
