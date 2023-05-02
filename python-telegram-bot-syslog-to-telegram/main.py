import os
import json
from telethon import TelegramClient
from time import sleep


def SendMessage(who, message):
    with TelegramClient('anon', api_id, api_hash) as client:
        client.parse_mode = 'html'
        message = f"<code>{message}</code>"
        client.loop.run_until_complete(client.send_message(who, message))


# RENAME TO YOUR JSON FILE WITH TELEGRAM KEYS
filename = '/home/rodion_ugarov/creds/tg.json'
filename_opened = open(filename, mode='r')
j = json.load(filename_opened)
filename_opened.close()

api_id = j["api_id"]
api_hash = j["api_hash"]


PATH = "/home/rodion_ugarov/git/private-repo/python/python2022/test/"
CURRENT_FILE = f"{PATH}current"
NEXT_FILE = f"{PATH}next"

cp_command = f'cp /var/log/syslog {CURRENT_FILE}'
cp_command_next = f'cp /var/log/syslog {NEXT_FILE}'
diff_command = f"diff {CURRENT_FILE} {NEXT_FILE}"
os.system(cp_command)
log = ""
log_to_send = ""

# SendMessage("@reddidgy", "<code>asdadasd</code>")

########### MAIN LOOP ##############
while 1 == 1:
    os.system(cp_command_next)
    # print(diff_command)
    log = os.popen(diff_command).read()
    if log != "":
        log = log.replace("> Dec 13 ", "")
        for string in log.split("\n")[1:]:
            log_to_send = log_to_send + string
        print(log_to_send)
        SendMessage("@lilinDDos", log_to_send)
        os.system(cp_command_next)
        os.system(cp_command)
        log = ""
        log_to_send = ""
