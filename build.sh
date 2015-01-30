#!/bin/sh

node_modules/uglify-js/bin/uglifyjs src/fuse.js -c drop_console=true -m --comments -o src/fuse.min.js
zip latest.zip src/*