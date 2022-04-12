#!/bin/bash

echo "Install linux/amd64 dependencies:"
cd /project
rm -rf node_modules
npm install electron

cd /~
rm -rf node_ modules
npm install electron-packager

echo "Build linux app:"
npx electron-packager /project webtool --platform=linux --arch=x64

echo "Build windows app:"
npx electron-packager /project webtool --platform=win32 --arch=x64 --icon=/project/source/public/favicon.ico

echo "Move builds out of docker:"
rm webtool-linux-x64/resources/app/docker-build.sh
rm webtool-win32-x64/resources/app/docker-build.sh
mv webtool-linux-x64/ /project/
mv webtool-win32-x64/ /project/