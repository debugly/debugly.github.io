---
layout: post
title: 常见的 POST 请求体编码方式
date: 2018-04-10 15:05:31
tags: HTTP
keywords: HTTP,POST,4 种编码方式
---

> 前面介绍过了 HTTP 请求，现在看下 POST 这种请求方式，根据 HTTP 协议的规定，通过 POST 方式提交的数据必须放在请求体中，但协议没有规定数据采用什么编码方式，所以请求体的消息格式其实可以自动决定，但要让服务器能够解析才有意义。

# 请求体编码方式

一般情况下主流的有以下 4 种编码方式，编码方式通过 **Content-Type** 告知服务器 :

- application/x-www-form-urlencoded

    如果是 HTML 里的 form 表单的话，在不设置 enctype 时，也是采用这种编码格式，key 和 value 都进行了 URL 转码，然后按照 k=v&k1=v1 的形式拼接。

    ```
    ts=1521518926&plat=iPhone&uid=sh-upeadqawgz&signature=3de948ae93767a2382c6a3a4f389ca9b&bundleId=com.sohu.live.demo
    ```
    
- application/json
    
    有个别情况，服务器要求我们给他 POST 过去一个 json 格式的参数，这时这种编码格式就排上用场了！还是刚才那些参数，使用这种方式编码结果如下：
    
    ```
    {"ts":1521518926,"plat":"iPhone","uid":"sh-upeadqawgz","signature":"3de948ae93767a2382c6a3a4f389ca9b","bundleId":"com.sohu.live.demo"}
    ```

- application/x-plist

  这种编码其实就是按xml格式编码，特别少见，工作好几年了一次也没用过。还是刚才那些参数，使用这种方式编码结果如下：
  
  ```
  <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
    	<key>bundleId</key>
    	<string>com.sohu.live.demo</string>
    	<key>plat</key>
    	<string>iPhone</string>
    	<key>signature</key>
    	<string>3de948ae93767a2382c6a3a4f389ca9b</string>
    	<key>ts</key>
    	<integer>1521518926</integer>
    	<key>uid</key>
    	<string>sh-upeadqawgz</string>
    </dict>
    </plist>
  ```
  
- application/form-data

    还是刚才那些参数，使用这种方式编码结果如下：

    ```
    POST /upload-file HTTP/1.1
    Host: localhost:3000
    Content-Type: multipart/form-data; charset=utf-8; boundary=0xKhTmLbOuNdArY
    Connection: keep-alive
    Accept: */*
    User-Agent: SCNDemo/1.0 (iPhone; iOS 11.3; Scale/3.00)
    Content-Length: 448
    Accept-Language: en-us
    Accept-Encoding: gzip, deflate
    
    --0xKhTmLbOuNdArY
    Content-Disposition: form-data; name="ts"
    
    1521518926
    --0xKhTmLbOuNdArY
    Content-Disposition: form-data; name="plat"
    
    iPhone
    --0xKhTmLbOuNdArY
    Content-Disposition: form-data; name="uid"
    
    sh-upeadqawgz
    --0xKhTmLbOuNdArY
    Content-Disposition: form-data; name="signature"
    
    3de948ae93767a2382c6a3a4f389ca9b
    --0xKhTmLbOuNdArY
    Content-Disposition: form-data; name="bundleId"
    
    com.sohu.live.demo
    --0xKhTmLbOuNdArY--
    ```
    
需要提下的是 **Content-Type** 的值多了一个 boundary ，这个是边界的意思，用来分割参数用的，服务器端也根据这个去解析数据！
    
再看一个上传文件的 POST 请求:
    
    ```
    POST /upload-file HTTP/1.1
    Host: localhost:3000
    Content-Type: multipart/form-data; charset=utf-8; boundary=0xKhTmLbOuNdArY
    Connection: keep-alive
    Accept: */*
    User-Agent: SCNDemo/1.0 (iPhone; iOS 11.3; Scale/3.00)
    Content-Length: 50311
    Accept-Language: en-us
    Accept-Encoding: gzip, deflate
    
    --0xKhTmLbOuNdArY
    Content-Disposition: form-data; name="k1"
    
    v1
    --0xKhTmLbOuNdArY
    Content-Disposition: form-data; name="name"
    
    Matt Reach
    --0xKhTmLbOuNdArY
    Content-Disposition: form-data; name="k2"
    
    v2
    --0xKhTmLbOuNdArY
    Content-Disposition: form-data; name="date"
    
    2018-04-19 15:13:40 +0000
    --0xKhTmLbOuNdArY
    Content-Disposition: form-data; name="test.jpg"; filename="node.jpg"
    Content-Type: image/jpeg
    
    图片内容.....
    --0xKhTmLbOuNdArY--
    ```
  
文件那块可以指定 filename 和 Content-Type ！filename 指的是上传文件的原始名称，name 是告诉服务器当做新的文件名。