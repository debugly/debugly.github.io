---
layout: post
title: HTTP/1.1 协议简介
date: 2018-04-09 14:05:31
tags: HTTP
keyworkds: HTTP,HTTP/1.1 协议简介
---

## 简介

HTTP 是一种传输协议，全称（HyperText Transfer Protocol，超文本传输协议）。
HTTP 是一个基于 TCP/IP 通信协议来传递数据（HTML 文件, 图片文件, 查询结果等）的应用层协议，早在 1990 年万维网兴起的时候，就得到了应用，截至目前可谓是使用最为广泛的协议了，因此掌握这个协议是很有必要。

该协议的具体内容可参考 [RFC2616](https://tools.ietf.org/html/rfc2616).

## 请求

协议里规定的请求方法有: OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT 这几种，客户端开发以 GET、POST 最为常见。

<!--more-->

HTTP 协议将报文分为三个部分，分别是：请求行，请求头，请求体。一起来看一个完整的 POST 请求：

```
POST /video/v2/goodsList.ios?sysver=11.3 HTTP/1.1
Host: cc.debugly.com
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Cookie: member_id=sh-upeadqawgz%4056.com; pass_hex=0045c47e0fecd654a387457
Connection: keep-alive
Accept: */*
User-Agent: SohuLiveDemo/6.8.8 (iPhone; iOS 11.1; Scale/3.00)
Content-Length: 114
Accept-Language: en-us
Accept-Encoding: gzip, deflate

ts=1521518926&plat=iPhone&uid=sh-upeadqawgz&signature=3de948ae93767a2382c6a3a4f389ca9b&bundleId=com.sohu.live.demo
```

针对这个请求拆分为三个部分：

- 请求行

    ```
    POST /video/v2/goodsList.ios?sysver=11.3 HTTP/1.1
    ```
    
    使用空格分割，分别是：`请求方法 请求PATH 协议版本\r\n`，注意最后的'\r\n'是必须的。
    
- 请求头

    
    ```
    Host: cc.debugly.com
    Content-Type: application/x-www-form-urlencoded; charset=utf-8
    Cookie: member_id=sh-upeadqawgz%4056.com; pass_hex=0045c47e0fecd654a387457
    Connection: keep-alive
    Accept: */*
    User-Agent: SohuLiveDemo/6.8.8 (iPhone; iOS 11.1; Scale/3.00)
    Content-Length: 114
    Accept-Language: en-us
    Accept-Encoding: gzip, deflate
    ```
| 请求头字段名 |字段取值|说明|
|:----:|:----:|:----:|
|Host| cc.debugly.com|服务器主机地址，可以使用IP:端口号|
|Content-Type| application/x-www-form-urlencoded; charset=utf-8|告诉服务器实体消息的编码方式，使用语言|
|Cookie| member_id=sh-upeadqawgz%4056.com; pass_hex=0045c47e0fecd654a387457|把 Cookie 带给服务端，通过cookie里的字段可以标识客户端身份|
|Connection| keep-alive|指定连接相关的属性|
|Accept| \*/\*| 告诉服务器客户端接受的信息类型，比如：text/html|
|User-Agent| SohuLiveDemo/6.8.8 (iPhone; iOS 11.1; Scale/3.00)|俗称 UA，用来标识客户端类型|
|Content-Length| 114|实体消息内容长度，这个一定要准确无误！|
|Accept-Language| en-us|告诉服务器客户端接受的语言|
|Accept-Encoding| gzip, deflate|告诉服务器客户端接受的数据压缩格式|
    
    注意每个值的后面都带有 '\r\n'。

- 请求体

    ```
    ts=1521518926&plat=iPhone&uid=sh-upeadqawgz&signature=3de948ae93767a2382c6a3a4f389ca9b&bundleId=com.sohu.live.demo
    ```

    请求体和请求头之间必须使用 '\r\n' 分割，这个例子是个POST请求，带有请求体，针对 GET 请求一般用于检索信息，因此通常是没有请求体的，不过也是要有 '\r\n' 的！

这是一个完整的 Get 请求，比 POST 请求简单，不再分析：

    ```
    GET /userinfo?k=2E0Jd HTTP/1.1
    Host: cc.debugly.com
    Accept: */*
    User-Agent: SohuLiveDemo/6.8.8 (iPhone; iOS 11.1; Scale/3.00)
    Accept-Language: zh-cn
    Accept-Encoding: gzip, deflate
    Connection: keep-alive
    
    ```

## 响应

客户端发起请求之后，服务器要给予响应，响应报文同样的也分为三个部分，分别是：响应行，响应头，响应体。

找了两个响应结构，主要区别在于响应头的信息量：

```
HTTP/1.1 200 OK
X-Powered-By: Express
content-type: application/json
Date: Thu, 19 Apr 2018 14:16:12 GMT
Transfer-Encoding: chunked
Proxy-Connection: Keep-alive

{"status":200,"ps":{"ts":["1521518926"],"plat":["iPhone"],"uid":["sh-upeadqawgz"],"signature":["3de948ae93767a2382c6a3a4f389ca9b"],"bundleId":["com.sohu.live.demo\r\n"]},"files":{}}
```

```
HTTP/1.1 200 OK
Server: GitHub.com
Content-Type: application/json; charset=utf-8
Last-Modified: Thu, 30 Nov 2017 02:54:54 GMT
Access-Control-Allow-Origin: *
Expires: Thu, 19 Apr 2018 14:33:46 GMT
Cache-Control: max-age=600
Content-Encoding: gzip
X-GitHub-Request-Id: 876E:73ED:86D043:904E2B:5AD8A66E
Content-Length: 1014
Accept-Ranges: bytes
Date: Thu, 19 Apr 2018 14:23:58 GMT
Via: 1.1 varnish
Age: 13
X-Served-By: cache-hnd18735-HND
X-Cache: HIT
X-Cache-Hits: 1
X-Timer: S1524147839.820919,VS0,VE0
Vary: Accept-Encoding
X-Fastly-Request-ID: 672fd09797649bf3c76f5bc7407272ef0b2c803d
Proxy-Connection: Keep-alive

{
    "code": "0",
    "content": {
        "gallery": [
                    {
                    "isFlagship": "0",
                    "name": "白色情人节 与浪漫牵手",
                    "pic": "http://pic16.shangpin.com/e/s/15/03/06/20150306174649601525-10-10.jpg",
                    "refContent": "http://m.shangpin.com/meet/189",
                    "type": "5"
                    },
                    {
                    "isFlagship": "0",
                    "name": "【早春新品预售】",
                    "pic": "http://pic11.shangpin.com/e/s/15/03/13/20150313101837452024-10-10.jpg",
                    "refContent": "50310992",
                    "type": "1"
                    }
          ]
      }
}
```

- 响应行

    ```
    HTTP/1.1 200 OK
    ```
    使用空格分割，分别是：`协议版本 状态码 状态码描述\r\n`，注意最后的'\r\n'是必须的。状态代码为3位数字，200~299的状态码表示成功，300~399的状态码指资源重定向，400~499的状态码指客户端请求出错，500~599的状态码指服务端出错（HTTP/1.1向协议中引入了信息性状态码，范围为100~199）

- 响应头

    ```
    Server: GitHub.com
    Content-Type: application/json; charset=utf-8
    Last-Modified: Thu, 30 Nov 2017 02:54:54 GMT
    Access-Control-Allow-Origin: *
    Expires: Thu, 19 Apr 2018 14:33:46 GMT
    Cache-Control: max-age=600
    Content-Encoding: gzip
    X-GitHub-Request-Id: 876E:73ED:86D043:904E2B:5AD8A66E
    Content-Length: 1014
    Accept-Ranges: bytes
    Date: Thu, 19 Apr 2018 14:23:58 GMT
    Via: 1.1 varnish
    Age: 13
    X-Served-By: cache-hnd18735-HND
    X-Cache: HIT
    X-Cache-Hits: 1
    X-Timer: S1524147839.820919,VS0,VE0
    Vary: Accept-Encoding
    X-Fastly-Request-ID: 672fd09797649bf3c76f5bc7407272ef0b2c803d
    Proxy-Connection: Keep-alive
    ```
| 响应头字段名 |字段取值|说明|
|:----:|:----:|:----:|
| Server | GitHub.com |服务器主机地址|
|Content-Type| application/json; charset=utf-8|告诉客户端实体消息的编码方式，使用语言|
|Last-Modified| Thu, 30 Nov 2017 02:54:54 GMT|最后一次修改时间|
|Access-Control-Allow-Origin| * |允许所有域名的脚本访问该资源|
|Expires| Thu, 19 Apr 2018 14:33:46 GMT|过期时间，客户端做缓存的时候才用到|
|Cache-Control| max-age=600|缓存控制|
|Content-Encoding| gzip|告诉客户端响应体采用了何种编码格式|
|X-GitHub-Request-Id| 876E:73ED:86D043:904E2B:5AD8A66E|Github特有的rid|
|Content-Length| 1014|响应体长度|
|Accept-Ranges| bytes|可以请求网页实体的一个或者多个子范围字段|
|Date| Thu, 19 Apr 2018 14:23:58 GMT|请求发送的日期和时间|
|Via| 1.1 varnish|Varnish 加速器的 |
|Age| 13|该实体从产生到现在经过多长时间了，服务器端缓存时间|
|X-Served-By| cache-hnd18735-HND|服务器信息|
|X-Cache| HIT|Squid 加速器的|
|X-Cache-Hits| 1|代理服务器相关|
|X-Timer| S1524147839.820919,VS0,VE0|代理服务器相关|
|Vary| Accept-Encoding|告诉下游代理是使用缓存响应还是从原始服务器请求|
|X-Fastly-Request-ID|672fd09797649bf3c76f5bc7407272ef0b2c803d|Fastly CDN 的 HTTP 头|
|Proxy-Connection| Keep-alive|代理连接控制|
    
- 响应体

```
{
    "code": "0",
    "content": {
        "gallery": [
                    {
                    "isFlagship": "0",
                    "name": "白色情人节 与浪漫牵手",
                    "pic": "http://pic16.shangpin.com/e/s/15/03/06/20150306174649601525-10-10.jpg",
                    "refContent": "http://m.shangpin.com/meet/189",
                    "type": "5"
                    },
                    {
                    "isFlagship": "0",
                    "name": "【早春新品预售】",
                    "pic": "http://pic11.shangpin.com/e/s/15/03/13/20150313101837452024-10-10.jpg",
                    "refContent": "50310992",
                    "type": "1"
                    }
          ]
      }
}
```
