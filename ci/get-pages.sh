#!/bin/sh

set -eu

mkdir pages

git remote update

git show gh-pages:titles.json > pages/titles.json
cp -a index.html search-titles.js pages
