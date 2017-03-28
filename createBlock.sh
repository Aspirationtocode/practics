#!/bin/bash
mkdir src/blocks/$1
touch src/blocks/$1/$1.styl
touch src/blocks/$1/$1.pug

echo -e "mixin $1()\n\t.$1" >> src/blocks/$1/$1.pug
