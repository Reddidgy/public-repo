import telegram
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import os
from gtts import gTTS
from time import sleep
import pygame

# Variables
TOKEN = os.environ.get('TGBOT_TOKEN')
skobka_rychag = False
# Handling telegram bot chats and messages to play mp3 file created according to it
# PyGame is using because of breaks of playsound modules
def handle_message(update, context):
    global skobka_rychag
    prompt = update.message.text
    if prompt.startswith("."):
        print(f"Passed {prompt}")
        return False
    print(prompt)
    if "))))" in prompt:
        prompt = prompt.replace("))))", " много скобок")
        skobka_rychag = True
    if not skobka_rychag:
        prompt = prompt.replace(")))", " три скобки").replace("))", " две скобки").replace(")", " одна скобка")
    tts = gTTS(text=prompt, lang='ru', tld='ru', slow=False)
    mp3_file_path = f"output.mp3"
    tts.save(mp3_file_path)
    sleep(1)

    # Initialize Pygame
    pygame.init()

    # Set the mp3 file path

    # Set up the Pygame mixer
    pygame.mixer.init()

    # Load the mp3 file into Pygame
    pygame.mixer.music.load(mp3_file_path)

    # Play the mp3 file
    pygame.mixer.music.play()

    # Wait until the mp3 file is finished playing
    while pygame.mixer.music.get_busy():
        pass
    

    # Clean up Pygame and skobka
    pygame.quit()
    skobka_rychag = False


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
