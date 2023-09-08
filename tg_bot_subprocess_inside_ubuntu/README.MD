
## Purpose
The purpose of this project is for entertainment. We are creating a Docker container that works with a Python program and subprocesses. The bot will send all output and errors to your group, where the bot should be an administrator.

## To start

`pip3 install -r requirements.txt`

## Build

To build the project, use the following command along with your `TGBOT_TOKEN`:

```bash
docker build --build-arg TGTOKEN=${TGBOT_TOKEN} -t tg_ubuntu .
```

## Run

To run the project, execute the following command:

```bash
docker run -it tg_ubuntu
```
