#!/bin/sh

minify () {
  srcpath="src/main/webapp/"
  java -jar yuicompressor-2.4.8.jar $srcpath/$1 -o $srcpath/$1
}

minify js/bootstrap.js
minify js/suggestor.js
minify js/box2dweb.js
minify js/neko.js

minify css/style-base.css
minify css/style.css
