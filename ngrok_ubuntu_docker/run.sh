#!/bin/bash

docker run -p 8888:7681 -u guest --rm -dt ngrok_ubuntu
ngrok http 8888 >/var/tmp/output.log 2>&1 &
while [ 1 -eq 1 ]; do
	response=$(curl localhost:4040/api/tunnels)
	sleep 1
	if [[ $response == *"Failed"* ]]; then
    echo "The response contains 'Failed'"
  else
    public_url=$(echo "$response" | jq -r '.tunnels[0].public_url')
    echo "$public_url"
    if [[ $public_url == *"http"* ]]; then
      exit
    fi
  fi
done