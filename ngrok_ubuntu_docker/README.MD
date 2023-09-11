# Application README

## Purpose
This application is designed to create a tunnel to expose a web service running in a Docker container to the public internet using Ngrok. It also includes TTYD for web-based terminal access to the container.

## Requirements
- Linux (ubuntu)
- Docker

## How to Use

- `sudo ./init.sh` to install ngrok for further use
- `./build.sh` to build an ubuntu docker image
  - This script uses `Dockerfile` to creat it
- `./run.sh` to run and expose container via ngrok tunnel
  - Wait till you will get ngrok public link where your host is located
- `./rebuild.sh` use it if you made some changes inside your Dockerfile
- `./stop.sh` to stop the container and kill ngrok process

Note: In the container we're using guest user for safe. If you need by some reason to use root - 
first of all - be careful to do this, especially for the long time, second delete `-u guest` in `run.sh`
docker run directive.

### Use Cases
Here are a few examples of how you can use this application:

- Exposing a local web server running on port 8888 to the internet for testing and sharing.
- Providing temporary access to a web application for a remote team member or client.
- Debugging a web service by exposing it to external tools like Ngrok.
- Offering web-based terminal access to a Docker container for remote administration.