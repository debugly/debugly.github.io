#!/bin/bash

rm -rf "node_modules"
rm -rf "themes"
npm install
git clone git@github.com:debugly/hexo-theme-yaris.git themes/hexo-theme-yaris
open http://localhost:4000/
hexo server

