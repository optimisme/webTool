# webTool

This is a tool to prototype and develop web sites easily. At the begining it was developed for teaching purposes, nowadays it surpasses this function with a complete set of features. 

The project is server agnostic, despite it uses NodeJS as a web server. You can move the "tool" folder to any other kind of server.

There is an online (and slow to load) version where you can test this tool at:

[https://optimisme.github.io/webTool/server/public/tool/](https://optimisme.github.io/webTool/server/public/tool/)

Obviously, with the online version, all the paths and URLs must be from Internet. 

# screenCaptures

![webTool](https://optimisme.github.io/webTool/screenCapture0.png)
![webTool mobile](https://optimisme.github.io/webTool/screenCapture1.png)

# webTool from an Electron App

You can use this tool as an app:

#### Windows: [webtool-win-x86.zip](https://mega.nz/file/MiJ3wYAa#frCVXsdptUQKpHpECzeoBCKcHriwOSZQz74i5tvjbfc)

#### Linux: [webtool-linux-x86.zip](https://mega.nz/file/pqJ0EQJa#vcaNQ_dLx7fN54ky1yG5V2Viac8N-ds-sze6HKc83JI)

Download and run it, remember that the server files are located at:

```
...resources/app/public/
```

# webTool from a server

This tool can be used from any server, for example the nodejs one provided at the 'server' folder. 

The tool itself is at '...server/public/tool' and can be moved to any other server

Download from this repo: 

[https://github.com/optimisme/webTool](https://github.com/optimisme/webTool)

```
git clone https://github.com/optimisme/webTool.git
```

Get into the server
```
cd server
```

Install project's dependencies:

```
npm install
```

When done, run the included web server with:

```
npm start
```

Or with an observer:

```
npm run app
```

When running, to use the tool, navigate to: 

[http://localhost:3002/tool](http://localhost:3002/tool)

Place your public files at "public" folder (like ".css", ".js" and images), and reference them with its base path from the tool. For example: 

```
"/file.png" is located at "./public/file.png"
```

Also, test the files generated by the tool, moving these files to the "public" folder.

# npm and nodejs installation on Ubuntu

```
sudo apt install npm
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo n latest
```

