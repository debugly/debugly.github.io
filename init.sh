#!/bin/bash
rm -rf "node_modules"
rm -rf "themes"
npm install
mkdir -p "./themes/hexo-theme-yaris" && curl -L https://codeload.github.com/debugly/hexo-theme-yaris/zip/master | tar xj -C "./themes/hexo-theme-yaris" --strip-components 1
#git clone git@github.com:debugly/hexo-theme-yaris.git themes/hexo-theme-yaris
open http://localhost:4000/
hexo server

