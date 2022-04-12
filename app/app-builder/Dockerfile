From ubuntu:focal

ARG UBUNTU_VERSION=focal

WORKDIR ~

# Without interactive dialogue
ARG DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update
RUN apt-get install -y wget gnupg2 software-properties-common git apt-utils vim dirmngr apt-transport-https ca-certificates

# Installing NodeJS
RUN apt-get install -y npm
RUN npm cache clean -f
RUN npm install -g n
RUN n stable
RUN n latest

# Install Wine from WineHQ Repository
RUN dpkg --add-architecture i386
RUN wget -nc https://dl.winehq.org/wine-builds/winehq.key
RUN apt-key add winehq.key
RUN `echo "deb https://dl.winehq.org/wine-builds/ubuntu/ $UBUNTU_VERSION main" > /etc/apt/sources.list.d/wine-stable.list`
RUN apt-get update
RUN apt-get install -y --install-recommends winehq-stable

# Installing mono
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
RUN `echo "deb https://download.mono-project.com/repo/ubuntu stable-$UBUNTU_VERSION main" > /etc/apt/sources.list.d/mono-official-stable.list`
RUN apt-get update
RUN apt-get install -y mono-complete

RUN apt-get upgrade
RUN PROJECT_DIR=/root/project

WORKDIR $PROJECT_DIR