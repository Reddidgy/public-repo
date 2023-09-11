#!/bin/bash

my_ubuntu_container=$(docker ps | grep -i ngrok_ubuntu | awk '{print $1}')

if [ -n "$my_ubuntu_container" ]; then
    docker kill "$my_ubuntu_container"
else
    echo "No containers to kill!"
fi

ngrok_process_string=$(ps aux | grep ngrok | grep http)

if [ -n "$ngrok_process_string" ]; then
  echo "No processes to kill"
else
  kill $(echo $ngrok_process_string | awk '{print $2}')
fi


