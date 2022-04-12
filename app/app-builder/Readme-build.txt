TODO:
    Posar els icones de l'app (windows, linux, osx)



Build for OSX:

    npx electron-packager ../app-electron/ webtool --platform=darwin --arch=arm64
    mv webtool-darwin-arm64 ../app-distribution

Build for Windows and Linux:

    If not installed, load the needed docker:
    
        docker build -t electron-builder --platform linux/amd64 . < Dockerfile

    Then update and compile the apps inside the docker:

        sudo rm -r ../app-dist*
        mkdir ../app-dist

        docker run -it --rm -v ${PWD}:/project electron-builder
        apt update
        apt upgrade
        npm install
        npx electron-packager . webtool --platform=linux --arch=x64
        mv webtool-linux-x64 ./dist/
        npx electron-packager . webtool --platform=win32 --arch=x64
        mv webtool-win32-x64 ./dist/