#!/bin/bash

echo "Important, use this on OSX"

echo "Delete old build:"
rm -rf ../app-distribution
mkdir ../app-distribution

echo "Copy source files from server:"
rm -rf ../app-electron/source
mkdir ../app-electron/source
cp -r ../../server/public ../app-electron/source
rm -rf ../app-electron/source/public/exercicis

# echo "Get electron-packager:"
# npm install electron-packager

# echo "Build OSX app:"
# npx electron-packager ../app-electron/ webtool --platform=darwin --arch=arm64 --icon=../app-electron/source/public/favicon.icns
# mv webtool-darwin-arm64 ../app-distribution

echo "Build 'electron-builder' docker if necessary (15 minutes):"
if [[ "$(docker images -q electron-builder:latest 2> /dev/null)" == "" ]]; then
  docker build -t electron-builder --no-cache --platform linux/amd64 .
fi

echo "Build Linux and Windows apps using 'electron-builder' docker:"

cp docker-build.sh ../app-electron/
chmod +x ../app-electron/docker-build.sh
docker run -it --rm --platform=linux/amd64 -v ${PWD}/../app-electron:/project electron-builder /bin/bash -c "cd /project && ./docker-build.sh"

echo "Move builds to 'app-distribution':"
rm ../app-electron/docker-build.sh
mv ../app-electron/webtool-win32-x64/ ../app-distribution
mv ../app-electron/webtool-linux-x64/ ../app-distribution

echo "Compress builds into zip files:"
cd ../app-distribution/
zip -r webtool-win-x86.zip webtool-win32-x64/
rm -rf webtool-win32-x64/
zip -r webtool-linux-x86.zip webtool-linux-x64/
rm -rf webtool-linux-x64/
cd ../app-builder/
