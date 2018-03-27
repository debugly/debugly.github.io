---
layout: post
title: macOS Install Jenkins
date: 2018-03-07 00:05:31
tags: macOS
---


![](/images/201803/7.jpeg)

## 官网

[https://jenkins.io/download/](https://jenkins.io/download/)

## 下载 Jenkins

官网的 download 不好使，点击后没能开始下，估计是被墙了，所以找了个镜像:

[http://mirrors.jenkins-ci.org/osx/](http://mirrors.jenkins-ci.org/osx/?C=N;O=D)

也由 war 包的镜像:

[http://updates.jenkins-ci.org/download/war/](http://updates.jenkins-ci.org/download/war/)

## 启动 Jenkins 服务

```
java -jar /Applications/Jenkins/jenkins.war
```

需要 Java 环境，环境有问题的话，可以参考我的这篇[文章](/2018/03/06/Macos-JavaRuntime.html)

## 使用

默认端口是 8080，所以直接浏览器里输入 [localhost:8080](localhost:8080) 进行一次 admin 账户初始化就OK了！

## 内置变量

```
The following variables are available to shell scripts

BRANCH_NAME
For a multibranch project, this will be set to the name of the branch being built, for example in case you wish to deploy to production from master but not from feature branches; if corresponding to some kind of change request, the name is generally arbitrary (refer to CHANGE_ID and CHANGE_TARGET).
CHANGE_ID
For a multibranch project corresponding to some kind of change request, this will be set to the change ID, such as a pull request number, if supported; else unset.
CHANGE_URL
For a multibranch project corresponding to some kind of change request, this will be set to the change URL, if supported; else unset.
CHANGE_TITLE
For a multibranch project corresponding to some kind of change request, this will be set to the title of the change, if supported; else unset.
CHANGE_AUTHOR
For a multibranch project corresponding to some kind of change request, this will be set to the username of the author of the proposed change, if supported; else unset.
CHANGE_AUTHOR_DISPLAY_NAME
For a multibranch project corresponding to some kind of change request, this will be set to the human name of the author, if supported; else unset.
CHANGE_AUTHOR_EMAIL
For a multibranch project corresponding to some kind of change request, this will be set to the email address of the author, if supported; else unset.
CHANGE_TARGET
For a multibranch project corresponding to some kind of change request, this will be set to the target or base branch to which the change could be merged, if supported; else unset.
BUILD_NUMBER
The current build number, such as "153"
BUILD_ID
The current build ID, identical to BUILD_NUMBER for builds created in 1.597+, but a YYYY-MM-DD_hh-mm-ss timestamp for older builds
BUILD_DISPLAY_NAME
The display name of the current build, which is something like "#153" by default.
JOB_NAME
Name of the project of this build, such as "foo" or "foo/bar".
JOB_BASE_NAME
Short Name of the project of this build stripping off folder paths, such as "foo" for "bar/foo".
BUILD_TAG
String of "jenkins-${JOB_NAME}-${BUILD_NUMBER}". All forward slashes (/) in the JOB_NAME are replaced with dashes (-). Convenient to put into a resource file, a jar file, etc for easier identification.
EXECUTOR_NUMBER
The unique number that identifies the current executor (among executors of the same machine) that’s carrying out this build. This is the number you see in the "build executor status", except that the number starts from 0, not 1.
NODE_NAME
Name of the agent if the build is on an agent, or "master" if run on master
NODE_LABELS
Whitespace-separated list of labels that the node is assigned.
WORKSPACE
The absolute path of the directory assigned to the build as a workspace.
JENKINS_HOME
The absolute path of the directory assigned on the master node for Jenkins to store data.
JENKINS_URL
Full URL of Jenkins, like http://server:port/jenkins/ (note: only available if Jenkins URL set in system configuration)
BUILD_URL
Full URL of this build, like http://server:port/jenkins/job/foo/15/ (Jenkins URL must be set)
JOB_URL
Full URL of this job, like http://server:port/jenkins/job/foo/ (Jenkins URL must be set)
SVN_REVISION
Subversion revision number that's currently checked out to the workspace, such as "12345"
SVN_URL
Subversion URL that's currently checked out to the workspace.
```

中文对照：[https://www.cnblogs.com/EasonJim/p/6758382.html](https://www.cnblogs.com/EasonJim/p/6758382.html)

# 邮件配置

- [https://blog.csdn.net/fullbug/article/details/53024562](https://blog.csdn.net/fullbug/article/details/53024562)
- [https://blog.csdn.net/u013066244/article/details/78665075](https://blog.csdn.net/u013066244/article/details/78665075)
- [https://blog.csdn.net/chengtong_java/article/details/49815311](https://blog.csdn.net/chengtong_java/article/details/49815311)
- [https://stackoverflow.com/questions/13650860/jenkins-extended-e-mail-wont-print-git-branch-or-git-commit](https://stackoverflow.com/questions/13650860/jenkins-extended-e-mail-wont-print-git-branch-or-git-commit)