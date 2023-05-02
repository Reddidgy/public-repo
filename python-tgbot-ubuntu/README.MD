## Purpose
For fun. Creating docker container which working with python program and subprocess.]
Bot will send all output and errors to your group where bot should be an admin

## Build

Build with the command below and with your TGBOT_TOKEN
```bash
docker build --build-arg TGTOKEN=${TGBOT_TOKEN} -t tg_ubuntu .
```

## Run

```bash
docker run -it tg_ubuntu
```
