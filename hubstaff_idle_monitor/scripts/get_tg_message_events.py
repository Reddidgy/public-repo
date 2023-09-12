import telegram
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env file

TOKEN = os.environ.get("tg_token")


def handle_message(update, context):
    """
    To get event after message to bot
    :param update: json
    :param context: idr
    :return:
    """
    print(update)
    print(context)


def main():
    bot = telegram.Bot(token=TOKEN)
    updater = Updater(bot=bot)
    dp = updater.dispatcher
    dp.add_handler(MessageHandler(Filters.all, handle_message))
    updater.start_polling()
    updater.idle()


if __name__ == '__main__':
    try:
        main()
    except:
        print("broken! Resurrecting...")
