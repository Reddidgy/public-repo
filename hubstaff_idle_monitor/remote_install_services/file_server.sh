#!/bin/bash

python3 -m http.server 3001 --directory $(pwd)/../

# server for host install.sh for remote install with the command below
# script=/var/tmp/install.sh && wget -O $script http://192.168.100.9:3001/install.sh && chmod +x $script && $script