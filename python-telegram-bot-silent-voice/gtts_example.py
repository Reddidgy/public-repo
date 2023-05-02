from gtts import gTTS

tts = gTTS(text='Всем привет, это пример использования библиотеки gTTS на русском языке.', lang='ru', tld='ru', slow=False)
tts.save('output.mp3')



from gtts import gTTS

tts = gTTS(text='Всем привет, это пример использования библиотеки gTTS на русском языке.', lang='ru', tld='ru', slow=False)
tts.save('output.mp3')

# Close the file explicitly
with open('output.mp3', 'rb') as file:
    file.close()
