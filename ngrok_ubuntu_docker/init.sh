#!/bin/bash

ngrok_location=$(whereis ngrok)
if [ "$ngrok_location" == "ngrok:" ]; then
  echo Ngrok install
  curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update && sudo apt install ngrok
  echo jq install
  sudo apt install jq
else
  echo Ngrok is installed
  echo Run \"./build.sh\" and \"./run.sh\" to start tunneled container
fi