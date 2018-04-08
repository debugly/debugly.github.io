---
layout: post
title: Post请求
date: 2018-03-20 15:05:31
tags: macOS
---

- application/x-www-form-urlencoded形式

```
POST /video/v2/getGoodsList.ios?sysver=11.1&product=ios&unid=f1e7ae3c768741053f4a0e5c5e7c7b15&ts=1521518935690&partner=10051&poid=3&signature=4f4f027f188d0fca38f11b5b3e4380f8&sver=6.8.8 HTTP/1.1
Host: pay.56.com
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Cookie: member_id=sh-upeadqawgz%4056.com; pass_hex=0045c47e0fecd654a3874574f7f081b321c7db31; qfInfo=%7B%22typePatriarch%22%3A%22%22%2C%22qfLogin%22%3A1%7D; fuid=15215183874287666626; 56authcode=7f9079b514c5d61edd0adc76f68def24; avatar=https%3A%2F%2Ffile.qf.56.com%2Fp%2Fgroup3%2FM01%2F4B%2F78%2FMTAuMTAuODguODQ%3D%2FMTAwMTA2XzE0ODM0MzU4Njc4MDY%3D%2Fcut%40m%3Dcrop%2Cx%3D0%2Cy%3D0%2Cw%3D640%2Ch%3D640_cut%40m%3Dresize%2Cw%3D100%2Ch%3D100.png; token=eyJleHAiOjE1MjkyOTM5MzQyMjUsImlhdCI6MTUyMTUxNzkzNDIyNSwicHAiOiJ3YW5ncm9uZ2h1aTIwMTJAaG90bWFpbC5jb20iLCJ0ayI6ImdFWXNNbmZKM2VqdnYzN0E3bXVXSXlMUlJTcWdwYTNKIiwidiI6MH0.uq0pwZoO6wLGNP-fEHp-mKLgWiinxF4dyhVUbzj9J80; user_nickname_js=%E7%8B%90%E7%8B%90%E8%A7%86%E9%A2%91NeO; user_nickname_js_qf=%25E7%258B%2590%25E7%258B%2590%25E8%25A7%2586%25E9%25A2%2591NeO; user_nickname_qf=%E7%8B%90%E7%8B%90%E8%A7%86%E9%A2%91NeO
Connection: keep-alive
Accept: */*
User-Agent: SohuLiveDemo/6.8.8 (iPhone; iOS 11.1; Scale/3.00)
Content-Length: 114
Accept-Language: en-us
Accept-Encoding: gzip, deflate

ts=1521518926&plat=iPhone&uid=sh-upeadqawgz&signature=3de948ae93767a2382c6a3a4f389ca9b&bundleId=com.sohu.live.demo
```

- application/form-data 形式
- 
```
POST /test/pp/trade/iap/receipt HTTP/1.1
Host: api.store.sohu.com
Content-Type: multipart/form-data; charset=utf-8; boundary=0xKhTmLbOuNdArY
Connection: keep-alive
plat: 3
Accept: */*
User-Agent: game56hall/1.0.0 (iPhone; iOS 10.2.1; Scale/3.00)
Content-Length: 7741
Accept-Language: zh-cn
Accept-Encoding: gzip, deflate

--0xKhTmLbOuNdArY
Content-Disposition: form-data; name="trade_sn"

K118031376VCPAXVRCMSGJ
--0xKhTmLbOuNdArY
Content-Disposition: form-data; name="receipt_data"

MIIVBAYJKojdDi1Mg0zjEsb%252B

--0xKhTmLbOuNdArY--
```

```
{
	"status": 200,
	"message": [{
		"goldnum": 100,
		"bundleid": "com.sohu.live.demo",
		"desc": "1元购买100帆币",
		"price": 1,
		"goodsid": "qf1rmb200",
		"name": "100帆币",
		"activity": 1
	}, {
		"goldnum": 840,
		"bundleid": "com.sohu.live.demo",
		"desc": "12元购买840帆币",
		"price": 12,
		"goodsid": "qf12rmb",
		"name": "840帆币",
		"activity": 0
	}, {
		"goldnum": 3500,
		"bundleid": "com.sohu.live.demo",
		"desc": "50元购买3500帆币",
		"price": 50,
		"goodsid": "qf50rmb",
		"name": "3500帆币",
		"activity": 0
	}, {
		"goldnum": 6860,
		"bundleid": "com.sohu.live.demo",
		"desc": "98元购买6860帆币",
		"price": 98,
		"goodsid": "qf98rmb",
		"name": "6860帆币",
		"activity": 0
	}, {
		"goldnum": 13860,
		"bundleid": "com.sohu.live.demo",
		"desc": "198元购买13860帆币",
		"price": 198,
		"goodsid": "qf198rmb",
		"name": "13860帆币",
		"activity": 0
	}, {
		"goldnum": 20860,
		"bundleid": "com.sohu.live.demo",
		"desc": "298元购买20860帆币",
		"price": 298,
		"goodsid": "qf298rmb",
		"name": "20860帆币",
		"activity": 0
	}, {
		"goldnum": 27160,
		"bundleid": "com.sohu.live.demo",
		"desc": "388元购买27160帆币",
		"price": 388,
		"goodsid": "qf388rmb",
		"name": "27160帆币",
		"activity": 0
	}, {
		"goldnum": 41160,
		"bundleid": "com.sohu.live.demo",
		"desc": "588元购买41160帆币",
		"price": 588,
		"goodsid": "qf588rmb",
		"name": "41160帆币",
		"activity": 0
	}]
}
```