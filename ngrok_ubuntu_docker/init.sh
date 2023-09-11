#!/bin/bash

ngrok_location=$(whereis ngrok)
if [ "$ngrok_location" == "ngrok:" ]; then
  echo Ngrok install
  wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-s390x.tgz
  tar xvzf ./ngrok-v3-stable-linux-s390x.tgz -C /usr/local/bin

else
  echo Ngrok is installed
  echo Run \"./build.sh\" and \"./run.sh\" to start tunneled container
fi