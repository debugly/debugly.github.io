#!/bin/bash

if [[ ! -d themes/landscape ]]; then
    git clone --depth 1 https://github.com/debugly/hexo-theme-landscape.git themes/landscape
fi
