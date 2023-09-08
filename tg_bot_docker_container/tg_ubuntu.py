import telegram
from telegram.ext import CommandHandler, Updater, MessageHandler, Filters
import subprocess
import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env file

TGBOT_TOKEN = os.environ.get("TGBOT_TOKEN")


def ubuntu_command(update, context):
    command = update.message.text
    print(f"Command: {command}")
    # output = subprocess.check_output(command, shell=True)

    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    output, error = process.communicate()

    if error:
        update.message.reply_text(f'```\n{error.decode()}\n```', parse_mode=telegram.ParseMode.MARKDOWN)
        print(f"ERROR: {error.decode()}")
    else:
        if TGBOT_TOKEN in output.decode():
            update.message.reply_text(f'Forbidennicht!11 Sensitive information!',
                                      parse_mode=telegram.ParseMode.MARKDOWN)
        elif command.startswith('cd '):
            new_dir = command.split(' ')[1]
            os.chdir(new_dir)
            update.message.reply_text(f"Changed directory to: {os.getcwd()}")
        else:
            print(f"OUTPUT: {output.decode()}")
            print(f"LEN: {len(output.decode())}")
            output = subprocess.check_output(command, shell=True)
            update.message.reply_text(f'```\n{output.decode()}\n```', parse_mode=telegram.ParseMode.MARKDOWN)


def main():
    updater = Updater(TGBOT_TOKEN, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(MessageHandler(Filters.text, ubuntu_command))
    updater.start_polling()
    updater.idle()


while True:
    if __name__ == '__main__':
        try:
            main()
        except:
            print("Broken, ressurecting!")
