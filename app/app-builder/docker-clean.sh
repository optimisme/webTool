#!/bin/bash

read -r -p "Are you sure? [y/N] " response
case $response in
    [yY][eE][sS]|[yY]) 
        echo "Burning the world...."
        docker rm $(docker ps -a -q)
        docker rmi -f $(docker images -q)
        rm -rf ~/Library/Containers/com.docker.docker/Data/*
        ;;
    *)
        echo "Stand down, gentlemen"
        ;;
esac
