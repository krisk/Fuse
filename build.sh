#!/bin/sh

node_modules/uglify-js/bin/uglifyjs src/fuse.js -c -m --comments -o src/fuse.min.js
zip latest.zip src/*