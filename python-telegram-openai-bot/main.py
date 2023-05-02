import telegram
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import os
import openai

# To run on container just run with docker run -dt myubuntu python3 open_ai.py

# Variables
openai.api_key = os.environ.get('OPENAI_TOKEN')
TOKEN = os.environ.get('TGBOT_TOKEN')
# Use the OpenAI API to generate text
model_engine = "text-davinci-002"


def handle_message(update, context):
    prompt = update.message.text[5:]
    completions = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )
    # Get the first message generated by the API
    message = completions.choices[0].text
    context.bot.send_message(chat_id=update.effective_chat.id,
                             text=message, reply_to_message_id=update.message.message_id)


def main():
    bot = telegram.Bot(token=TOKEN)
    updater = Updater(bot=bot)
    dp = updater.dispatcher
    dp.add_handler(MessageHandler(
        Filters.text & Filters.command("bot"), handle_message))
    updater.start_polling()
    updater.idle()


if __name__ == '__main__':
    main()
