#!/bin/bash -eu
f=js/common/env.js
cp -a $f $f.org
[ -f .env ] && . .env
for k in APP_KEY APP_NAME
do
  v=`eval echo '$'$k`
  sed -i -e "s|$k.*|$k = \"${v//&/\\&}\";|" $f
done
