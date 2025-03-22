#!/bin/sh

cd /app

if [ ! -f package.json ]
then
	npm create vite@latest tmp -- --template vanilla
	cd tmp && npm install && npm install --save tree
	cp -r package.json package-lock.json node_modules ../
	cd ..
	rm -rf tmp
fi

exec npm run dev
