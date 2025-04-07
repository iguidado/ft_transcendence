#!/bin/sh

DIR=$(dirname -- $0)
PWD=$(pwd)

FULL_DIR=${PWD}/${DIR}

SRC=${FULL_DIR}/../frontend/src/

find ${SRC} -name "*.js" -exec sed -i 's:\(from[[:space:]]\+"[./]\+[_/a-zA-Z0-9\-]\+\)":\1.js":' "{}" \;
find ${SRC} -name "*.js" -exec sed -i "s:\(from[[:space:]]\+'[./]\+[_/a-zA-Z1-9\-]\+\)':\1.js':" "{}" \;
