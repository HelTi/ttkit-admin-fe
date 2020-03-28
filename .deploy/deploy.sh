#!/bin/bash

echo "拉取代码..."
git reset --hard origin/master
git clean -f
git pull
git checkout master
echo "开始安装依赖..."
npm install
echo "依赖安装结束..."
echo "开始构建..."
npm run build
echo "构建结束 开始启动服务"
pm2 restart blog-admin
echo "admin服务重启完毕."