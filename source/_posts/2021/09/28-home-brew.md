---
layout: post
title: Mac 包管理工具 Homebrew
date: 2021-09-28 15:00:06
tags: macOS
---



> The missing package manager for macOS (or Linux)

Homebrew 是 Mac 上不可或缺的提升效率的工具之一，安装管理三方库非常方便，称之为神器一点也不违和。

<!--more-->

## 安装

命令行安装 

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 常规使用

- 查看帮助，通过帮助命令可以快速的了解工具

  ```bash
  Example usage:
    brew search TEXT|/REGEX/
    brew info [FORMULA|CASK...]
    brew install FORMULA|CASK...
    brew update
    brew upgrade [FORMULA|CASK...]
    brew uninstall FORMULA|CASK...
    brew list [FORMULA|CASK...]
  
  Troubleshooting:
    brew config
    brew doctor
    brew install --verbose --debug FORMULA|CASK
  
  Contributing:
    brew create URL [--no-fetch]
    brew edit [FORMULA|CASK...]
  
  Further help:
    brew commands
    brew help [COMMAND]
    man brew
    https://docs.brew.s
  ```
  
- 查看版本 

  ```bash
  brew --version
  Homebrew 3.2.13
  Homebrew/homebrew-core (git revision 8c2de31c095; last commit 2021-09-23)
  Homebrew/homebrew-cask (git revision fc44a06e1b; last commit 2021-09-23)
  ```

- 查看配置信息

  ```bash
  brew config
  HOMEBREW_VERSION: 3.2.13
  ORIGIN: git://mirrors.ustc.edu.cn/brew.git
  HEAD: 109f24fd601177dea4a754b43efe684903db2a83
  Last commit: 8 days ago
  Core tap ORIGIN: git://mirrors.ustc.edu.cn/homebrew-core.git
  Core tap HEAD: 8c2de31c095c0025f447dd39f978a8506ed86bad
  Core tap last commit: 5 days ago
  Core tap branch: master
  HOMEBREW_PREFIX: /usr/local
  HOMEBREW_BOTTLE_DOMAIN: https://mirrors.ustc.edu.cn/homebrew-bottles
  HOMEBREW_CASK_OPTS: []
  HOMEBREW_MAKE_JOBS: 8
  Homebrew Ruby: 2.6.3 => /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/bin/ruby
  CPU: octa-core 64-bit haswell
  Clang: 13.0.0 build 1300
  Git: 2.30.1 => /Applications/Xcode.app/Contents/Developer/usr/bin/git
  Curl: 7.64.1 => /usr/bin/curl
  macOS: 11.5.2-x86_64
  CLT: 13.0.0.0.1.1630607135
  Xcode: 13.0
  ```
  
- 安装

  ```bash
  brew install tree  
  ==> Downloading https://mirrors.ustc.edu.cn/homebrew-bottles/tree-1.8.0.big_sur.
  ######################################################################## 100.0%
  ==> Pouring tree-1.8.0.big_sur.bottle.tar.gz
  🍺  /usr/local/Cellar/tree/1.8.0: 8 files, 157.7KB
  
  如果已经安装可以使用 reinstall 再次安装
  brew install tree  
  Warning: tree 1.8.0 is already installed and up-to-date.
  To reinstall 1.8.0, run:
    brew reinstall tree
  ```
  
- 卸载

  ```bash
  brew uninstall tree  
  Uninstalling /usr/local/Cellar/tree/1.8.0... (8 files, 117KB)
  ```

- 搜索库

  ```bash
  brew search tree 
  ==> Formulae
  as-tree         datree          tree ✔          treecc          tre
  cherrytree      pstree          tree-sitter     treefrog
  ==> Casks
  figtree                    sourcetree                 treesheets
  ```
  
- 查看包信息

  ```bash
  brew info ffmpeg
  ffmpeg: stable 4.4 (bottled), HEAD
  Play, record, convert, and stream audio and video
  https://ffmpeg.org/
  Not installed
  From: git://mirrors.ustc.edu.cn/homebrew-core.git/Formula/ffmpeg.rb
  License: GPL-2.0-or-later
  ==> Dependencies
  Build: nasm ✔, pkg-config ✔
  Required: aom ✔, dav1d ✔, fontconfig ✔, freetype ✔, frei0r ✔, gnutls ✔, lame ✔, libass ✔, libbluray ✔, libsoxr ✔, libvidstab ✔, libvorbis ✔, libvpx ✔, opencore-amr ✔, openjpeg ✔, opus ✔, rav1e ✔, rubberband ✔, sdl2 ✔, snappy ✔, speex ✔, srt ✔, tesseract ✔, theora ✔, webp ✔, x264 ✔, x265 ✔, xvid ✔, xz ✔, zeromq ✔, zimg ✔
  ==> Options
  --HEAD
  	Install HEAD version
  ==> Analytics
  install: 72,815 (30 days), 244,572 (90 days), 1,621,840 (365 days)
  install-on-request: 57,454 (30 days), 195,761 (90 days), 1,340,918 (365 days)
  build-error: 0 (30 days)
  ```
  
- 全面更新

  ```bash
  ➜  ~ brew update     
  Updated 2 taps (homebrew/core and homebrew/cask).
  ==> New Formulae
  cyral-gimme-db-token       lastz                      neovim-qt
  ==> Updated Formulae
  coreutils ✔         feh                 literate-git        rover
  fribidi ✔           flow                lmod                ruby-build
  leptonica ✔         fonttools           localstack          ruby-install
  aliyun-cli          fpart               logstash            rust-analyzer
  angular-cli         functionalplus      mandoc              s2n
  aravis              gd                  marp-cli            salt
  arb                 gdu                 maxwell             seal
  awscli              geckodriver         micronaut           semgrep
  baobab              geph4               minio               serverless
  bbtools             ghz                 minio-mc            simple-scan
  bear                ghz-web             mint                smimesign
  bgpq3               git-series          mockolo             snakemake
  bison               gitfs               moto                snort
  capnp               gitless             mydumper            solidity
  cargo-c             glooctl             nativefier          sourcery
  cargo-edit          gomodifytags        nats-server         spack
  cargo-llvm-lines    gomplate            ncspot              sqlite-utils
  cargo-outdated      goreleaser          neo4j               step
  cargo-watch         gostatic            neovim              stgit
  cdktf               gpsd                netlify-cli         structurizr-cli
  cfn-lint            graphviz            newrelic-cli        subfinder
  chapel              homeassistant-cli   no-more-secrets     svgo
  checkov             immudb              node                swift-format
  chezmoi             influxdb-cli        node-build          swift-protobuf
  cilium-cli          infracost           ola                 terragrunt
  circleci            ioctl               onnxruntime         tfsec
  citus               ipopt               openalpr            thors-serializer
  clarinet            ipython             opencv@3            tile38
  cmark               istioctl            openssh             toast
  commitizen          itstool             orientdb            torchvision
  conmon              jc                  ormolu              truffle
  consul-template     jruby               osm                 twarc
  cpm                 jsonrpc-glib        parallel            uftrace
  cppad               julia               pass-git-helper     urlview
  cppzmq              kafka               php                 vala
  cubejs-cli          kcgi                php@7.3             viddy
  dar                 kcptun              php@7.4             vips
  datalad             keptn               phpunit             virtualenv
  datree              kn                  picat               vulkan-headers
  delve               ko                  pmd                 webpack
  devspace            kube-linter         pnpm                when
  digdag              kubeconform         prestodb            whistle
  doc8                lean-cli            psqlodbc            xcodegen
  docker-slim         libcouchbase        pygitup             xmrig
  dolt                libexif             pyright             xray
  dotnet              libgit2             questdb             xterm
  dprint              libgit2-glib        rabbitmq            yosys
  druid               libmtp              radare2             yt-dlp
  dvc                 libphonenumber      rancher-cli         zeek
  esbuild             libplctag           red-tldr            zim
  exploitdb           libtorch            rfcmarkup
  fastlane            libvmaf             richmd
  fava                libzip              riemann-client
  ==> New Casks
  cloudash                   jupyterlab                 thetimemachinemechanic
  dropbox-capture            rancher                    tidelift
  firmaec                    remarkable
  ==> Updated Casks
  010-editor                               keeper-password-manager
  3dgenceslicer                            keyman
  ableton-live-suite                       kotlin-native
  ajour                                    kstars
  almighty                                 kubenav
  altair-graphql-client                    kui
  anka-virtualization                      leapp
  anydesk                                  lens
  atlauncher                               librewolf
  avocode                                  linear-linear
  backblaze                                loaf
  balenaetcher                             lofi
  bibdesk                                  logisim-evolution
  blitz                                    logseq
  bunch                                    loom
  cakebrewjs                               lrtimelapse
  calibre                                  lunar-client
  canva                                    macvim
  chirp                                    mambaforge
  chromedriver                             metasploit
  chromium                                 microsoft-azure-storage-explorer
  chronicle                                microsoft-edge
  clamxav                                  microsoft-teams
  clash-for-windows                        miro
  clay                                     monitorcontrol
  cocktail                                 mtgaprotracker
  cog                                      mudlet
  coolterm                                 mweb-pro
  cozy-drive                               netron
  crystalmaker                             ocenaudio
  cutter                                   onionshare
  dash                                     opencore-configurator
  datweatherdoe                            operator
  deepl                                    paw
  deltachat                                plex
  dingtalk                                 pop
  dmenu-mac                                portfolioperformance
  drawio                                   porting-kit
  dwarf-fortress                           qqmusic
  dwarf-fortress-lmp                       quaternion
  electron                                 raycast
  element                                  rocket-chat
  eloston-chromium                         royal-tsx
  enclave                                  sabnzbd
  evernote                                 sapmachine-jdk
  expressvpn                               session
  fantastical                              sharemouse
  far2l                                    signet
  feishu                                   siyuan
  figma                                    sparrow
  firecamp                                 stats
  firefox                                  tableau
  flipper                                  telegram
  flotato                                  telegram-desktop
  foobar2000                               tempo
  fork                                     temurin
  free-download-manager                    termius
  freedom                                  texstudio
  freeplane                                thunderbird
  futubull                                 tradingview
  fvim                                     trezor-suite
  geph                                     tutanota
  ghost-browser                            unity
  gns3                                     unity-android-support-for-editor
  google-chrome                            unity-ios-support-for-editor
  google-cloud-sdk                         unity-linux-support-for-editor
  grammarly                                unity-lumin-support-for-editor
  hstracker                                unity-webgl-support-for-editor
  imazing                                  unity-windows-support-for-editor
  invoker                                  videofusion
  isubtitle                                webcatalog
  isyncr                                   webex
  ivideonserver                            xattred
  jamf-migrator                            ximalaya
  jamovi                                   yesplaymusic
  jaxx-liberty                             yinxiangbiji
  jprofiler                                yuque
  julia                                    zerotier-one
  jumpshare                                zoom-for-it-admins
  keep-it
  ==> Deleted Casks
  microsoft-lync                           microsoft-r-open
  
  You have 25 outdated formulae and 1 outdated cask installed.
  You can upgrade them with brew upgrade
  or list them with brew outdated.
  ```
  
- 查看已经安装的包

  ```bash
  brew list
  ==> Formulae
  aom			libev			ninja
  autoconf		libevent		oniguruma
  autojump		libffi			opencore-amr
  automake		libgpg-error		openjpeg
  bdw-gc			libidn2			openssl@1.1
  brotli			libksba			opus
  c-ares			libogg			p11-kit
  cairo			libpng			pcre
  carthage		libpthread-stubs	pixman
  cmake			libsamplerate		pkg-config
  cocoapods		libsndfile		python@3.9
  coreutils		libsodium		rav1e
  curl			libsoxr			readline
  dav1d			libtasn1		rubberband
  fdk-aac			libtiff			sdl2
  flac			libtool			snappy
  fontconfig		libunistring		speex
  freetype		libuv			sphinx-doc
  frei0r			libvidstab		sqlite
  fribidi			libvorbis		srt
  gdbm			libvpx			tesseract
  gettext			libx11			thefuck
  giflib			libxau			theora
  glib			libxcb			tree
  gmp			libxdmcp		uchardet
  gnutls			libxext			unbound
  go			libxrender		watchman
  gobject-introspection	libyaml			webp
  graphite2		little-cms2		wget
  guile			luajit			wrk
  harfbuzz		lzo			x264
  icu4c			m4			x265
  jansson			mono			xctool
  jemalloc		mpdecimal		xorgproto
  jpeg			mrffmpeg		xvid
  jq			mujs			xz
  lame			nasm			yasm
  leptonica		nettle			zeromq
  libass			nghttp2			zimg
  libbluray		nginx			zlib
  
  ==> Casks
  provisionql
  ```
  
- 自我检查与修复

  ```bash
  brew doctor
  ```
  
## 开发相关

Formula: brew 是一个通用的工具，理论上可以管理任意包，为了达到通用，brew 就为包安装定义了一套固定流程，所有的包安装步骤都是一样的，把不同的地方，当到包的配置文件里，brew 通过配置文件得知如何安装这个包，这个包依赖了哪些包，从哪里下载这个包，这个包是否提供预编译的二进制等信息，这个配置文件称为 Formula。

### tap

存放 Formula 文件的 Git 仓库称为 tap。

- 查看当前 taps

  ```bash
  brew tap          
  homebrew/cask
  homebrew/core
  homebrew/services
  iina/mpv-iina
  matt/core
  ```

- 创建 tap 

创建一个 Git 仓库，创建名为 Formula 的文件夹，然后在里面创建你包的 Formula 文件，
这是一个仓库，所以可以存放很多包，Formula 文件。

第一次写不知道如何写，可以去 homebrew-core 随便找个看下 [[Homebrew Formulae](https://formulae.brew.sh/)](https://formulae.brew.sh/)，比如这个是 [ffmeg](https://github.com/Homebrew/homebrew-core/blob/HEAD/Formula/ffmpeg.rb) 的 Formula 文件，类名要和包名要一样，否则会报错，不要和已经存在的包同名。

包的 Formula 文件写好后，推送到 Git 服务器，然后让 brew 管理这个仓库，这样 brew 就能找到你这个 tap 里的包了，后续就可以 brew install 了。

```bash
# tap 路径自己命名，然后跟上 git 仓库地址
brew tap matt/core https://github.com/debugly/BrewFormula.git
# 安装 tap 里包含的库
brew install mrffmpeg
```

- 编辑 Formula 文件

```bash
brew edit mrffmpeg
Warning: edit is a developer command, so
Homebrew's developer mode has been automatically turned on.
To turn developer mode off, run brew developer off

Editing /usr/local/Homebrew/Library/Taps/matt/homebrew-core/Formula/mrffmpeg.rb
Warning: Using vim because no editor was set in the environment.
This may change in the future, so we recommend setting EDITOR,
or HOMEBREW_EDITOR to your preferred text editor.
```

- 测试 Formula 文件

  开发包的  Formula 文件可能存在不合适的地方，需要多次编辑后，然后 install 库测试无误后，把最终的 Formula 文件复制出来，然后放到 git 仓库里提交。

- 对于其他用户，重新安装 tap 就会更新 Formula 文件

### untap

移除使用 tap 安装的仓库。

```bash
brew untap matt/core                      

Error: Refusing to untap matt/core because it contains the following installed formulae or casks:

mrffmpeg
```

因为 mrffmpeg 库是通过 matt/core 这个 tap 安装的，因此不能移除这个 tap，需要先卸载 mrffmpeg 这个库才行。

```bash
brew uninstall mrffmpeg

Uninstalling /usr/local/Cellar/mrffmpeg/4.4_2... (245 files, 234MB)

brew untap matt/core  

Untapping matt/core...

Untapped 1 formula (33 files, 28.4KB).
```



## 小贴士

1、为了提升安装速度，一定要安装镜像 [[homebrew | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)

2、Homebrew 经常会在执行命令的时候触发更新，如果你的确不想让他更新，可以 Ctrl+c 打断，原本的命令就会继续执行了，因为更新通常会稍微耗点时间如果长时间没有更新的话；建议几个月来一次 brew update ，确保使用的库都是最新最稳定的。

3、遇到问题可以追加 --verbose 查看详细日志

4、通过 brew 安装的包，如果有 lib 或者 dylib 生成，默认会放到 /usr/local/lib/ 下，头文件放在 /usr/local/include 下（里面都是软连接），实际包放在  /usr/local/Cellar/包名/版本 目录下

5、同一个 tap 不可以使用不同的仓库，否则报错：

```bash
brew tap matt/core https://github/debugly/FFmpeg.git
Updating Homebrew...
==> Auto-updated Homebrew!
Updated 1 tap (homebrew/services).
No changes to formulae.

Error: Tap matt/core remote mismatch.
https://github.com/debugly/BrewFormula.git != https://github/debugly/FFmpeg.git
```




## 参考

[官网](https://brew.sh/)

[全部文档](https://docs.brew.sh/)

[Taps (Third-Party Repositories)](https://docs.brew.sh/Taps)

[[程序员 Homebrew 使用指北 - 少数派 (sspai.com)](https://sspai.com/post/56009)](https://sspai.com/post/56009)
