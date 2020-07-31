---
layout: post
title: MySQL 常用语句
date: 2020-07-31 17:59:10
tags: [MySQL]
---

## 登录 MySQL

- mysql -u root -h localhost -P 3306 -p password
  - -u 用户名
  - -h 主机地址
  - -P 端口，默认3306
  - -p 密码，可以回车然后输入密码

<!--more-->

常用命令:

```
?         (\?) Synonym for `help'.
clear     (\c) Clear the current input statement.
connect   (\r) Reconnect to the server. Optional arguments are db and host.
delimiter (\d) Set statement delimiter.
edit      (\e) Edit command with $EDITOR.
ego       (\G) Send command to mysql server, display result vertically.
exit      (\q) Exit mysql. Same as quit.
go        (\g) Send command to mysql server.
help      (\h) Display this help.
nopager   (\n) Disable pager, print to stdout.
notee     (\t) Don't write into outfile.
pager     (\P) Set PAGER [to_pager]. Print the query results via PAGER.
print     (\p) Print current command.
prompt    (\R) Change your mysql prompt.
quit      (\q) Quit mysql.
rehash    (\#) Rebuild completion hash.
source    (\.) Execute an SQL script file. Takes a file name as an argument.
status    (\s) Get status information from the server.
system    (\!) Execute a system shell command.
tee       (\T) Set outfile [to_outfile]. Append everything into given outfile.
use       (\u) Use another database. Takes database name as argument.
charset   (\C) Switch to another charset. Might be needed for processing binlog with multi-byte charsets.
warnings  (\W) Show warnings after every statement.
nowarning (\w) Don't show warnings after every statement.
```

## 数据库相关信息查询

1、使用 root 账户登录

```
mysql> mysql -u root -p
```

2、查看版本

```
mysql> select version();
+-----------+
| version() |
+-----------+
| 5.1.73    |
+-----------+
```

3、查看数据库支持的字符集

```
mysql> show character set;
+----------+---------------------------------+---------------------+--------+
| Charset  | Description                     | Default collation   | Maxlen |
+----------+---------------------------------+---------------------+--------+
| armscii8 | ARMSCII-8 Armenian              | armscii8_general_ci |      1 |
| ascii    | US ASCII                        | ascii_general_ci    |      1 |
| big5     | Big5 Traditional Chinese        | big5_chinese_ci     |      2 |
| binary   | Binary pseudo charset           | binary              |      1 |
| cp1250   | Windows Central European        | cp1250_general_ci   |      1 |
| cp1251   | Windows Cyrillic                | cp1251_general_ci   |      1 |
| cp1256   | Windows Arabic                  | cp1256_general_ci   |      1 |
| cp1257   | Windows Baltic                  | cp1257_general_ci   |      1 |
| cp850    | DOS West European               | cp850_general_ci    |      1 |
| cp852    | DOS Central European            | cp852_general_ci    |      1 |
| cp866    | DOS Russian                     | cp866_general_ci    |      1 |
| cp932    | SJIS for Windows Japanese       | cp932_japanese_ci   |      2 |
| dec8     | DEC West European               | dec8_swedish_ci     |      1 |
| eucjpms  | UJIS for Windows Japanese       | eucjpms_japanese_ci |      3 |
| euckr    | EUC-KR Korean                   | euckr_korean_ci     |      2 |
| gb18030  | China National Standard GB18030 | gb18030_chinese_ci  |      4 |
| gb2312   | GB2312 Simplified Chinese       | gb2312_chinese_ci   |      2 |
| gbk      | GBK Simplified Chinese          | gbk_chinese_ci      |      2 |
| geostd8  | GEOSTD8 Georgian                | geostd8_general_ci  |      1 |
| greek    | ISO 8859-7 Greek                | greek_general_ci    |      1 |
| hebrew   | ISO 8859-8 Hebrew               | hebrew_general_ci   |      1 |
| hp8      | HP West European                | hp8_english_ci      |      1 |
| keybcs2  | DOS Kamenicky Czech-Slovak      | keybcs2_general_ci  |      1 |
| koi8r    | KOI8-R Relcom Russian           | koi8r_general_ci    |      1 |
| koi8u    | KOI8-U Ukrainian                | koi8u_general_ci    |      1 |
| latin1   | cp1252 West European            | latin1_swedish_ci   |      1 |
| latin2   | ISO 8859-2 Central European     | latin2_general_ci   |      1 |
| latin5   | ISO 8859-9 Turkish              | latin5_turkish_ci   |      1 |
| latin7   | ISO 8859-13 Baltic              | latin7_general_ci   |      1 |
| macce    | Mac Central European            | macce_general_ci    |      1 |
| macroman | Mac West European               | macroman_general_ci |      1 |
| sjis     | Shift-JIS Japanese              | sjis_japanese_ci    |      2 |
| swe7     | 7bit Swedish                    | swe7_swedish_ci     |      1 |
| tis620   | TIS620 Thai                     | tis620_thai_ci      |      1 |
| ucs2     | UCS-2 Unicode                   | ucs2_general_ci     |      2 |
| ujis     | EUC-JP Japanese                 | ujis_japanese_ci    |      3 |
| utf16    | UTF-16 Unicode                  | utf16_general_ci    |      4 |
| utf16le  | UTF-16LE Unicode                | utf16le_general_ci  |      4 |
| utf32    | UTF-32 Unicode                  | utf32_general_ci    |      4 |
| utf8     | UTF-8 Unicode                   | utf8_general_ci     |      3 |
| utf8mb4  | UTF-8 Unicode                   | utf8mb4_0900_ai_ci  |      4 |
+----------+---------------------------------+---------------------+--------+
41 rows in set (0.00 sec)
```

、查看数据库字符集

```
mysql> show variables like 'character%';
+--------------------------+-----------------------------------------------------------+
| Variable_name            | Value                                                     |
+--------------------------+-----------------------------------------------------------+
| character_set_client     | utf8mb4                                                   |
| character_set_connection | utf8mb4                                                   |
| character_set_database   | utf8mb4                                                   |
| character_set_filesystem | binary                                                    |
| character_set_results    | utf8mb4                                                   |
| character_set_server     | utf8mb4                                                   |
| character_set_system     | utf8                                                      |
| character_sets_dir       | /usr/local/mysql-8.0.19-macos10.15-x86_64/share/charsets/ |
+--------------------------+-----------------------------------------------------------+
8 rows in set (0.01 sec)
```

5、查看 mysql 状态

```
mysql> status
--------------
mysql  Ver 8.0.19 for macos10.15 on x86_64 (MySQL Community Server - GPL)

Connection id:		13
Current database:	mr_api
Current user:		root@localhost
SSL:			Not in use
Current pager:		less
Using outfile:		''
Using delimiter:	;
Server version:		8.0.19 MySQL Community Server - GPL
Protocol version:	10
Connection:		Localhost via UNIX socket
Server characterset:	utf8mb4
Db     characterset:	utf8mb4
Client characterset:	utf8mb4
Conn.  characterset:	utf8mb4
UNIX socket:		/tmp/mysql.sock
Binary data as:		Hexadecimal
Uptime:			2 days 29 min 29 sec

Threads: 2  Questions: 24  Slow queries: 0  Opens: 144  Flush tables: 3  Open tables: 66  Queries per second avg: 0.000
--------------
```

6、查询最大连接数

```
mysql> show variables like '%max_connections%';
+------------------------+-------+
| Variable_name          | Value |
+------------------------+-------+
| max_connections        | 151   |
| mysqlx_max_connections | 100   |
+------------------------+-------+
2 rows in set (0.00 sec)
```

7、查询线程数

```
mysql> show status like 'Threads%';
+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| Threads_cached    | 1     |
| Threads_connected | 1     |
| Threads_created   | 2     |
| Threads_running   | 2     |
+-------------------+-------+
4 rows in set (0.01 sec)
```

8、查询 db 存储位置

```
mysql> show variables like '%datadir%';
+---------------+------------------------+
| Variable_name | Value                  |
+---------------+------------------------+
| datadir       | /usr/local/mysql/data/ |
+---------------+------------------------+
1 row in set (0.00 sec)
```

9、查看所有数据库

```
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| test               |
+--------------------+
```

10、选择数据库

选择之后，以后的操作就意味着是针对这个库的。

```
mysql> use mysql;
```

11、查看库里包含了哪些表

```
mysql> show tables;
+---------------------------+
| Tables_in_mysql           |
+---------------------------+
| columns_priv              |
| db                        |
| event                     |
| func                      |
| general_log               |
| help_category             |
| help_keyword              |
| help_relation             |
| help_topic                |
| host                      |
| ndb_binlog_index          |
| plugin                    |
| proc                      |
| procs_priv                |
| servers                   |
| slow_log                  |
| tables_priv               |
| time_zone                 |
| time_zone_leap_second     |
| time_zone_name            |
| time_zone_transition      |
| time_zone_transition_type |
| user                      |
+---------------------------+
```

## 基础演练

1、创建一个名为 xqlDb 的数据库

```
mysql> create database xqlDB;
mysql> use xqlDb;
```

2、创建一张名为 car 的表

```
mysql> create table car ( id int unsigned not null auto_increment primary key, name char(255) not null, price text not null );
```

3、查看表字段信息

```
mysql> desc car;
mysql> show columns from car;
+-------+------------------+------+-----+---------+----------------+
| Field | Type             | Null | Key | Default | Extra          |
+-------+------------------+------+-----+---------+----------------+
| id    | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
| name  | char(255)        | NO   |     | NULL    |                |
| price | text             | NO   |     | NULL    |                |
+-------+------------------+------+-----+---------+----------------+
```

4、查看表 DDL 语句

```
mysql> show create table mr_build;
+----------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table    | Create Table                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
+----------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| mr_build | CREATE TABLE `mr_build` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `appid` varchar(255) NOT NULL,
  `build_no` varchar(255) NOT NULL,
  `platform` varchar(255) NOT NULL,
  `env` varchar(255) NOT NULL,
  `client_version` varchar(255) DEFAULT NULL,
  `server_version` varchar(255) DEFAULT NULL,
  `real_h5_url` varchar(255) NOT NULL,
  `backup_url` varchar(255) DEFAULT NULL,
  `build_info` varchar(1024) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 |
+----------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

5、向 car 表插入几条数据

```
mysql> insert into car (name,price) values ('yaris','90000');

mysql> insert into car (name,price) values ('camry','270000');

mysql> insert into car (name,price) values ('levin','110000');

mysql> insert into car (name,price) values ('highlander','240000');

mysql> insert into car (name,price) values ('alphard','770000');

mysql> insert into car (name,price) values ('ix4','210000');
```

6、查询 car 表里的数据

```
mysql> select * from car;
+----+------------+--------+
| id | name       | price  |
+----+------------+--------+
|  1 | yaris      |  90000 |
|  2 | camry      | 270000 |
|  3 | levin      | 110000 |
|  4 | highlander | 240000 |
|  5 | alphard    | 770000 |
|  6 | ix4        | 210000 |
+----+------------+--------+
```

7、按价格排序，注意这里价格是文本格式！

```
mysql> select * from car order by price;
+----+------------+--------+
| id | name       | price  |
+----+------------+--------+
|  3 | levin      | 110000 |
|  6 | ix4        | 210000 |
|  4 | highlander | 240000 |
|  2 | camry      | 270000 |
|  5 | alphard    | 770000 |
|  1 | yaris      |  90000 |
+----+------------+--------+
```

8、将列类型修改为 double

```
mysql> alter table car modify column price double;

mysql> select * from car order by price DESC;
+----+------------+--------+
| id | name       | price  |
+----+------------+--------+
|  5 | alphard    | 770000 |
|  2 | camry      | 270000 |
|  4 | highlander | 240000 |
|  6 | ix4        | 210000 |
|  3 | levin      | 110000 |
|  1 | yaris      |  90000 |
+----+------------+--------+
```

9、添加 cname，test 字段

```
mysql> alter table car add column cname varchar(1024);
mysql> alter table car add column test text not null;

mysql> desc car;
+-------+------------------+------+-----+---------+----------------+
| Field | Type             | Null | Key | Default | Extra          |
+-------+------------------+------+-----+---------+----------------+
| id    | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
| name  | char(255)        | NO   |     | NULL    |                |
| price | double           | YES  |     | NULL    |                |
| cname | varchar(1024)    | YES  |     | NULL    |                |
| test  | text             | NO   |     | NULL    |                |
+-------+------------------+------+-----+---------+----------------+

```

10、更新表，为他们增加中文名字

```
mysql> update car set cname='埃尔法' where id=5;
mysql> update car set cname='凯美瑞' where id=2;
mysql> update car set cname='ix4' where id=6;
mysql> update car set cname='雷凌' where id=3;
mysql> update car set cname='致炫' where id=1;
mysql> update car set cname='致炫', price=87800.5  where id=1;
mysql> select * from car order by price DESC;
+----+------------+---------+-----------+------+
| id | name       | price   | cname     | test |
+----+------------+---------+-----------+------+
|  5 | alphard    |  770000 | 埃尔法 |      |
|  2 | camry      |  270000 | 凯美瑞 |      |
|  4 | highlander |  240000 | 汉兰达 |      |
|  6 | ix4        |  210000 | ix4   |      |
|  3 | levin      |  110000 | 雷凌   |      |
|  1 | yaris      | 87800.5 | 致炫   |      |
+----+------------+---------+-----------+------+
```

11、 删除 test 字段

```
mysql> alter table car drop column test;
mysql> select * from car order by price DESC;
+----+------------+---------+-----------+
| id | name       | price   | cname     |
+----+------------+---------+-----------+
|  5 | alphard    |  770000 | 埃尔法 |
|  2 | camry      |  270000 | 凯美瑞 |
|  4 | highlander |  240000 | 汉兰达 |
|  6 | ix4        |  210000 | ix4       |
|  3 | levin      |  110000 | 雷凌    |
|  1 | yaris      | 87800.5 | 致炫    |
+----+------------+---------+-----------+
```

12、修改表名

```
mysql> alter table car rename to Car;
Query OK, 0 rows affected (0.00 sec)

mysql> show tables;
+-----------------+
| Tables_in_xqlDB |
+-----------------+
| Car             |
+-----------------+
```

13、修改字段和数据类型

```
mysql> alter table Car add column test text;
mysql> alter table Car change test tt int;
Query OK, 6 rows affected (0.01 sec)
Records: 6  Duplicates: 0  Warnings: 0

mysql> desc Car;
+-------+------------------+------+-----+---------+----------------+
| Field | Type             | Null | Key | Default | Extra          |
+-------+------------------+------+-----+---------+----------------+
| id    | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
| name  | char(255)        | NO   |     | NULL    |                |
| price | double           | YES  |     | NULL    |                |
| cname | varchar(1024)    | YES  |     | NULL    |                |
| tt    | int(11)          | YES  |     | NULL    |                |
+-------+------------------+------+-----+---------+----------------+
```

14、仅仅修改字段的数据类型

```
mysql> alter table Car modify tt varchar(20);
mysql> desc Car;
+-------+------------------+------+-----+---------+----------------+
| Field | Type             | Null | Key | Default | Extra          |
+-------+------------------+------+-----+---------+----------------+
| id    | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
| name  | char(255)        | NO   |     | NULL    |                |
| price | double           | YES  |     | NULL    |                |
| cname | varchar(1024)    | YES  |     | NULL    |                |
| tt    | varchar(20)      | YES  |     | NULL    |                |
+-------+------------------+------+-----+---------+----------------+
```

15、条件删除，删掉 cname 为 Null 的元组

```
mysql> insert into Car (name,price,cname) values ('highlander','240000','');
mysql> insert into Car (name,price,cname) values ('highlander','240000','');
mysql> insert into Car (name,price,cname) values ('highlander','240000','');

mysql> select * from Car;
+----+------------+---------+-----------+------+
| id | name       | price   | cname     | tt   |
+----+------------+---------+-----------+------+
|  1 | yaris      | 87800.5 | 致炫    | NULL |
|  2 | camry      |  270000 | 凯美瑞 | NULL |
|  3 | levin      |  110000 | 雷凌    | NULL |
|  4 | highlander |  240000 | 汉兰达 | NULL |
|  5 | alphard    |  770000 | 埃尔法 | NULL |
|  6 | ix4        |  210000 | ix4       | NULL |
|  7 | highlander |  240000 | NULL      | NULL |
|  8 | highlander |  240000 | NULL      | NULL |
|  9 | highlander |  240000 | NULL      | NULL |
| 10 | highlander |  240000 |           | NULL |
+----+------------+---------+-----------+------+

mysql> delete from Car where name='highlander' and cname is Null;
Query OK, 3 rows affected (0.00 sec)

mysql> select * from Car;
+----+------------+---------+-----------+------+
| id | name       | price   | cname     | tt   |
+----+------------+---------+-----------+------+
|  1 | yaris      | 87800.5 | 致炫    | NULL |
|  2 | camry      |  270000 | 凯美瑞 | NULL |
|  3 | levin      |  110000 | 雷凌    | NULL |
|  4 | highlander |  240000 | 汉兰达 | NULL |
|  5 | alphard    |  770000 | 埃尔法 | NULL |
|  6 | ix4        |  210000 | ix4       | NULL |
| 10 | highlander |  240000 |           | NULL |
+----+------------+---------+-----------+------+
7 rows in set (0.00 sec)

mysql> delete from Car where name='highlander' and cname='';
Query OK, 1 row affected (0.00 sec)

mysql> select * from Car;
+----+------------+---------+-----------+------+
| id | name       | price   | cname     | tt   |
+----+------------+---------+-----------+------+
|  1 | yaris      | 87800.5 | 致炫    | NULL |
|  2 | camry      |  270000 | 凯美瑞 | NULL |
|  3 | levin      |  110000 | 雷凌    | NULL |
|  4 | highlander |  240000 | 汉兰达 | NULL |
|  5 | alphard    |  770000 | 埃尔法 | NULL |
|  6 | ix4        |  210000 | ix4       | NULL |
+----+------------+---------+-----------+------+
```

16、删除表

```
mysql> drop table Car;
```

17、删除数据库

```
mysql> drop database xqlDB;
```

18、退出

```
mysql> exit
Bye
```



## 用户管理

1、查询 mysql 数据库 的 user 表

```
mysql> select host,user from mysql.user;
+-----------+------------------+
| host      | user             |
+-----------+------------------+
| localhost | mysql.infoschema |
| localhost | mysql.session    |
| localhost | mysql.sys        |
| localhost | root             |
+-----------+------------------+
4 rows in set (0.00 sec)
//格式化下
mysql> select concat('user: ''',user,'''@''',host,''';') as UserInfo from mysql.user;
+---------------------------------------+
| UserInfo                              |
+---------------------------------------+
| user: 'mysql.infoschema'@'localhost'; |
| user: 'mysql.session'@'localhost';    |
| user: 'mysql.sys'@'localhost';        |
| user: 'root'@'localhost';             |
+---------------------------------------+
4 rows in set (0.00 sec)
```

2、添加新账户

```
mysql> create user test@localhost identified by '123456';
mysql> create user any@'%' identified by '123456';
mysql> create user xql@10.7.36.118 identified by '123456';
//老版本可以这么操作
mysql> insert into mysql.user(Host,User,Password) 
mysql> flush privileges;
##添加用户，或者更改用户权限后，记得刷新下，否者重启前不生效。
```

3、退出 root 用户，登录 test@localhost 用户，然后操作 xqlDB

```
mysql> \q
[@10.16.89.67 ~]# mysql -u test -h localhost -p
Enter password:
mysql> use xqlDB;
ERROR 1044 (42000): Access denied for user 'localhost'@'localhost' to database 'xqlDB'
```

3、 查看当前用户的授权情况

```
mysql> SHOW GRANTS FOR CURRENT_USER;
+------------------------------------------------------------------------------------------------------------------+
| Grants for test@localhost                                                                                   |
+------------------------------------------------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO 'test'@'localhost' IDENTIFIED BY PASSWORD '*6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9' |
+------------------------------------------------------------------------------------------------------------------+
```

4、切换到 root 用户进行授权

```
mysql> mysql -u root
mysql> grant select,insert,update,delete on xqlDB.* to test@localhost;
mysql> show grants for test@'localhost' ;
+------------------------------------------------------------------------------------------------------------------+
| Grants for test@localhost                                                                                   |
+------------------------------------------------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO 'test'@'localhost' IDENTIFIED BY PASSWORD '*6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9' |
| GRANT SELECT, INSERT, UPDATE, DELETE ON `xqlDB`.* TO 'test'@'localhost'                                     |
+------------------------------------------------------------------------------------------------------------------+
```



## 数据类型 

1、整形

|   类型    | 字节 |                 有符号范围                 |        无符号范围        |
| :-------: | :--: | :----------------------------------------: | :----------------------: |
|  TINYINT  |  1   |                 -128 ~ 127                 |         0 ~ 255          |
| SMALLINT  |  2   |               -32768 ~ 32767               |        0 ~ 65535         |
| MEDIUMINT |  3   |             -8388608 ~ 8388607             |       0 ~ 16777215       |
|    INT    |  4   |          -2147483648 ~ 2147483647          |      0 ~ 4294967295      |
|  BIGINT   |  8   | -9223372036854775808 ~ 9223372036854775807 | 0 ~ 18446744073709551615 |

2、浮点型

|  类型  | 字节 |                      有符号范围                       |          无符号范围          |
| :----: | :--: | :---------------------------------------------------: | :--------------------------: |
| FLOAT  |  4   |          -1.175494351E-38 ~  1.175494351E-38          |     0 ~ 3.402823466E+38      |
| DOUBLE |  8   | -1.7976931348623157E+ 308 ~ -2.2250738585072014E- 308 | 0 ~ 1.7976931348623157E+ 308 |

3、字符型

|    类型    |       长度       |              特性               |
| :--------: | :--------------: | :-----------------------------: |
|    CHAR    |    0-255字节     |           定长字符串            |
|  VARCHAR   |   0-65535 字节   |           变长字符串            |
|  TINYBLOB  |    0-255字节     | 不超过 255 个字符的二进制字符串 |
|  TINYTEXT  |    0-255字节     |          短文本字符串           |
|    BLOB    |   0-65 535字节   |     二进制形式的长文本数据      |
|    TEXT    |   0-65 535字节   |           长文本数据            |
| MEDIUMBLOB |  0-16777215字节  |  二进制形式的中等长度文本数据   |
| MEDIUMTEXT |  0-16777215字节  |        中等长度文本数据         |
|  LONGBLOB  | 0-4294967295字节 |    二进制形式的极大文本数据     |
|  LONGTEXT  | 0-4294967295字节 |          极大文本数据           |

 4、日期类型

|   类型    | 字节 |                             范围                             |        格式         |           特性           |
| :-------: | :--: | :----------------------------------------------------------: | :-----------------: | :----------------------: |
|   DATE    |  3   |                    1000-01-01/9999-12-31                     |     YYYY-MM-DD      |          日期值          |
|   TIME    |  3   |                   '-838:59:59'/'838:59:59'                   |      HH:MM:SS       |     时间值或持续时间     |
|   YEAR    |  1   |                          1901/2155                           |        YYYY         |          年份值          |
| DATETIME  |  8   |           1000-01-01 00:00:00/9999-12-31 23:59:59            | YYYY-MM-DD HH:MM:SS |     混合日期和时间值     |
| TIMESTAMP |  4   | 1970-01-01 00:00:00/2038 结束时间是第 2147483647 秒，北京时间 2038-1-19 11:14:07，格林尼治时间 2038年1月19日 凌晨 03:14:07 |   YYYYMMDD HHMMSS   | 混合日期和时间值，时间戳 |

## SQL 语句注释

```
#我是单行注释
-- 我是单行注释，前面有个空格哦
/*
我是多行注释哦；
*/
```

## 图像化工具

- http://dev.mysql.com/downloads/tools/workbench/
- http://www.sequelpro.com 
- http://dbeaver.jkiss.org/download/#macos 
- http://www.navicat.com/download 

## 参考

- https://www.w3resource.com/mysql/mysql-data-types.php
- https://www.tutorialspoint.com/mysql/mysql-data-types.htm
- http://www.runoob.com/mysql/mysql-data-types.html
- http://www.cnblogs.com/zbseoag/archive/2013/03/19/2970004.html
- https://www.cnblogs.com/mr-wid/archive/2013/05/09/3068229.html#d8