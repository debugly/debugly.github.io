---
layout: post
title: MySQL 学习笔记
date: 2018-10-26 18:09:10
tags: [CentOS]
---

> 以下命令如有权限问题请自行使用 sudo 或者切换到 root 账户，我的这台主机是公司分配的，通过 ssh 直接登录的 root 账户，所以就没有带 sudo.该笔记可能不适用于 CentOS 7.

## 查看系统版本

- uname

	`Linux`

- uname -a

	`Linux 10.16.89.67 3.10.0-327.el7.x86_64 #1 SMP Thu Oct 29 17:29:29 EDT 2015 x86_64 x86_64 x86_64 GNU/Linux`
- rpm -q centos-release

	`centos-release-6-10.el6.centos.12.3.x86_64`

## 安装 MySQL

- yum update
- yum install mysql-server
- /sbin/chkconfig --levels 235 mysqld on

## 启动 MySQL 服务

- service mysqld status
- service mysqld start
- service mysqld restart
- service mysqld stop

## 登录 MySQL

- mysql -u root //使用root账户登录
- mysql -u root -p xx -h localhost

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

## 实战演练

1、使用 root 账户登录

```
mysql> mysql -u root
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

3、查看数据库

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
4、选择数据库

选择之后，以后的操作就意味着是针对这个库的。

```
mysql> use mysql;
```

4、查看库里的表

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

5、添加新账户

用户都存储在 user 这张表里。

```
mysql> insert into mysql.user(Host,User,Password) values("localhost","test",password("123456"));
mysql> insert into mysql.user(Host,User,Password) values("%","any",password("123456"));
mysql> insert into mysql.user(Host,User,Password) values("10.7.36.118","xql",password("123456"));

##添加用户，或者更改用户权限后，记得刷新下，否者重启前不生效。
mysql> flush privileges;
```

6、修改 xql 用户远程登录 host

```
mysql> update user set host='10.7.36.117' where user='xql';
mysql> flush privileges;
```

7、创建一个名为 xqlDb 的数据库

```
mysql> create database xqlDB;
mysql> use xqlDb;
```

8、创建一张名为 car 的表

```
mysql> create table car ( id int unsigned not null auto_increment primary key, name char(255) not null, price text not null );
show columns from car;
+-------+------------------+------+-----+---------+----------------+
| Field | Type             | Null | Key | Default | Extra          |
+-------+------------------+------+-----+---------+----------------+
| id    | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
| name  | char(255)        | NO   |     | NULL    |                |
| price | text             | NO   |     | NULL    |                |
+-------+------------------+------+-----+---------+----------------+
```

9、向 car 表插入几条数据

```
mysql> insert into car (name,price) values ('yaris','90000');

mysql> insert into car (name,price) values ('camry','270000');

mysql> insert into car (name,price) values ('levin','110000');

mysql> insert into car (name,price) values ('highlander','240000');

mysql> insert into car (name,price) values ('alphard','770000');

mysql> insert into car (name,price) values ('ix4','210000');
```

10、查询 car 表里的数据

```
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

11、查询 car 表里的数据

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

按价格排序，这里是当做字符串排序的！

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

12、将列类型修改为 double

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

13、添加 cname，test 字段

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

14、更新表，为他们增加中文名字

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
15、 删除 test 字段

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

16、修改表名

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

17、修改字段和数据类型

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

18、仅仅修改字段的数据类型

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

19、条件删除，删掉 cname 为 Null 的元组

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

20、查看用户

user 字段为空的为匿名用户。

```
 select user,host from user;
+-----------+-------------+
| user      | host        |
+-----------+-------------+
| any       | %           |
|           | 10.16.89.67 |
| root      | 10.16.89.67 |
| xql       | 10.7.36.117 |
| root      | 127.0.0.1   |
|           | localhost   |
| localhost | localhost   |
| root      | localhost   |
+-----------+-------------+
```

21、退出 root 用户，登录 localhost@localhost 用户，然后操作 xqlDB

```
mysql> \q
[@10.16.89.67 ~]# mysql -u localhost -h localhost -p
Enter password:
mysql> use xqlDB;
ERROR 1044 (42000): Access denied for user 'localhost'@'localhost' to database 'xqlDB'
```

22、 查看当前用户的授权情况

```
mysql> SHOW GRANTS FOR CURRENT_USER;
+------------------------------------------------------------------------------------------------------------------+
| Grants for localhost@localhost                                                                                   |
+------------------------------------------------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO 'localhost'@'localhost' IDENTIFIED BY PASSWORD '*6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9' |
+------------------------------------------------------------------------------------------------------------------+
```

23、切换到 root 用户进行授权

```
mysql> mysql -u root
mysql> grant select,insert,update,delete on xqlDB.* to localhost@localhost identified by '123456';
mysql> show grants for localhost@'localhost' ;
+------------------------------------------------------------------------------------------------------------------+
| Grants for localhost@localhost                                                                                   |
+------------------------------------------------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO 'localhost'@'localhost' IDENTIFIED BY PASSWORD '*6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9' |
| GRANT SELECT, INSERT, UPDATE, DELETE ON `xqlDB`.* TO 'localhost'@'localhost'                                     |
+------------------------------------------------------------------------------------------------------------------+
```

24、删除表

```
mysql> drop table Car;
```

25、删除数据库

```
mysql> drop database xqlDB;
```

## 数据类型 

### 1、整形

|类型|字节	|有符号范围|无符号范围|
|:-----:|:-----:|:------:|:--------:|
|TINYINT	 | 1	| -128 ~ 127  | 0 ~ 255|
|SMALLINT | 2  |-32768 ~ 32767 | 0 ~ 65535|
|MEDIUMINT	| 3	| -8388608 ~ 8388607 |0 ~ 16777215|
|INT   	| 4	| -2147483648 ~ 2147483647 | 0 ~ 4294967295|
|BIGINT	| 8	| -9223372036854775808 ~ 9223372036854775807 |0 ~ 18446744073709551615|

### 2、浮点型

|类型|字节	|有符号范围|无符号范围|
|:-----:|:-----:|:------:|:--------:|
|FLOAT	 | 4	| -1.175494351E-38 ~  1.175494351E-38  | 0 ~ 3.402823466E+38|
|DOUBLE | 8  | -1.7976931348623157E+ 308 ~ -2.2250738585072014E- 308 | 0 ~ 1.7976931348623157E+ 308|

### 3、字符型

|类型| 长度	|特性|
|:-----:|:-----:|:------:|
|CHAR	|0-255字节|	定长字符串|
|VARCHAR	|0-65535 字节|	变长字符串|
|TINYBLOB|	0-255字节|	不超过 255 个字符的二进制字符串|
|TINYTEXT|	0-255字节|	短文本字符串|
|BLOB	|0-65 535字节|	二进制形式的长文本数据|
|TEXT	|0-65 535字节|	长文本数据|
|MEDIUMBLOB|	0-16777215字节|二进制形式的中等长度文本数据|
|MEDIUMTEXT|	0-16777215字节|中等长度文本数据|
|LONGBLOB	|0-4294967295字节|二进制形式的极大文本数据|
|LONGTEXT	|0-4294967295字节|极大文本数据|

### 4、日期类型

|类型|  字节	|范围|格式|特性|
|:-----:|:-----:|:------:|:-----:|:------:|
|DATE	|3|	1000-01-01/9999-12-31|	YYYY-MM-DD|	日期值|
|TIME	|3|	'-838:59:59'/'838:59:59'|	HH:MM:SS|	时间值或持续时间|
|YEAR	|1|	1901/2155|	YYYY	|年份值|
|DATETIME	|8|	1000-01-01 00:00:00/9999-12-31 23:59:59|	YYYY-MM-DD HH:MM:SS	|混合日期和时间值|
|TIMESTAMP	|4|	1970-01-01 00:00:00/2038 结束时间是第 2147483647 秒，北京时间 2038-1-19 11:14:07，格林尼治时间 2038年1月19日 凌晨 03:14:07 |YYYYMMDD HHMMSS	|混合日期和时间值，时间戳|

## 图像化工具

- http://dev.mysql.com/downloads/tools/workbench/
- http://www.sequelpro.com 
- http://dbeaver.jkiss.org/download/#macos 
- http://www.navicat.com/download 

## 参考

- https://www.linode.com/docs/databases/mysql/how-to-install-mysql-on-centos-6/
- https://www.w3resource.com/mysql/mysql-data-types.php
- https://www.tutorialspoint.com/mysql/mysql-data-types.htm
- http://www.runoob.com/mysql/mysql-data-types.html
- http://www.cnblogs.com/zbseoag/archive/2013/03/19/2970004.html
- https://www.cnblogs.com/mr-wid/archive/2013/05/09/3068229.html#d8