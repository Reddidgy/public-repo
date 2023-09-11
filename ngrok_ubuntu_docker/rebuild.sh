#!/bin/bash

echo "Stop current ngrok tunnel and container"
./stop.sh
echo "Rebuild docker ubuntu image"
./build.sh
echo "Run container and expose to ngrok"
./run.sh

