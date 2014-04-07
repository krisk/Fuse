#!/bin/sh

uglifyjs src/fuse.js -c -m --comments -o src/fuse.min.js
zip latest.zip src/*