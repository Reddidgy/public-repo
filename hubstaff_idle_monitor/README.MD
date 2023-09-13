## What is it
This is an auxiliary script for HubStaff (a time tracker) on **Linux (Debian/Ubuntu)**. Its purpose is to assist you in remembering to activate the HubStaff time tracker during your work hours. This script periodically checks if HubStaff is active and sends a reminder if it's not.

It operates in conjunction with cron and verifies the following:
- Is it a working day?
- Are the working hours defined (you can set them inside `install.sh`)?
- It checks every 10 minutes whether time tracking is in progress or not.

## Requirements
- Linux (Ubuntu/Debian)
- HubStaff installed
- Python (for auxiliary scripts)
- Telegram bot + token

## Install
- Open `install.sh` via any editor and change variables

If you're plan to use telegram token gathering via api server for some reason
  - token_api_server/port - to yours
  - tgchat_id - should contain private chat id of your Telegram Bot
  - tg_token:
    - You can use `./scripts/api_token_server.py` script to provide your token from your .env to any remote machine
If you're planning just to install for yourself
    - You can simply add your token as variable if it's okay for you

General things in `install.sh`
- change start/end hours where is your working time (default 10am and 8pm(20))
- `run_script_every_minutes` is a cron scheduler time how often to run the main script


- to start install `./install.sh` (without sudo)

Sample of auto-install remotely from another machine
```bash
`curl -sfL http://192.168.100.9:3001/install.sh | sh -`
```
