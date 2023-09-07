## INFO
## ==========================================
## The program encrypts text using dictionary file "LanguageDictionary.json"
## EncrypterDecrypter doesn't use Space like separate symbol to complicate manual decrypt master :)
## Instead of this we're using common characters with space like separate dictionary items
##
## "a" : "value"
## "a " : "differentValue"
import os
import sys

try:
    import json
except:
    print("Use pip install json")               # Trying to import json
    quit()

try:
    filename = "LanguageDictionary.json"        # Trying to get dictionary file and write to variable
    filename_opened = open(filename, mode='r')
    j = {}
    j = json.load(filename_opened)
    filename_opened.close()
except:
    print("Dictionary file for encrypt/decrypt doesn't exist!")
    print("Filename: " + filename)
    print("Put your dictionary file to folder with py files or create it using DictCreator.py")
    quit()

# dictionary preparing
chars = ""              # Creates String with all chars for encrypt or decrypt
for i in j.keys():          # (it's just for comfortable use in some methods)
    chars += i

# def Menu():                             # simple menu func in console
#     print("1. Decrypt the text")
#     print("2. Encrypt the text")
#     print("----------------------------")
#     opt = input(": ")
#     if opt == "1":
#         DecryptText()
#     elif opt == "2":
#         EncryptText()
#     else:
#         print("Wrong command")
#         return

def EncryptText(text):            # EncryptFunc
    print("Note: The encrypter can can use RU/EN language and some special symbols.")
    print("If symbols doesn't using here the crypter will miss it.")
    normalText = text
    cryptedText = ""
    for i in range(0, len(normalText)):
        if normalText[i] != " " and normalText[i] in chars:  # if current char is not space
            if normalText[i] in chars:                       # if we have char in chars string
                if i != len(normalText) - 1:                 # rechecking for last symbol
                    if normalText[i + 1] == " ":  # If we have " " after symbol we'll assign other dict key
                        char = normalText[i] + " "
                        if char not in j.keys():            # If we have symbol with space but we don't have that symbol in our dict
                            char = normalText[i]                # than we're just using normal symbol w/o space
                    else:
                        char = normalText[i]
                else:
                    char = normalText[i]
                cryptedText = cryptedText + j[char]
    print("=====")
    print("Text to crypt: ")
    print(normalText)
    print("Crypted text: ")
    print(cryptedText)
    os.system(f"printf \"{cryptedText}\" | xclip -i -selection clipboard")
    print("Your crypted text is already in you clipboard!")
    return

def DecryptText(text):
    cryptedText = text
    decryptedText = ""
    indexCount = -1
    if (len(cryptedText) % 4) == 0:
        for i in cryptedText:
            #print(j.values())
            indexCount = indexCount + 1
            if (indexCount % 4) == 0:
                cryptedValue = cryptedText[indexCount] + cryptedText[indexCount + 1] + cryptedText[indexCount + 2] + \
                               cryptedText[indexCount + 3]
                if cryptedValue not in j.values():
                    print(f"Invalid value for symbol {cryptedValue}")
                else:
                    for key, value in j.items():
                        if value == cryptedValue:
                            decryptedText += key
    else:
        print(f"Invalid crypted value!")
    print("=====")
    print("Text to decrypt: ")
    print(text)
    print("Decrypted text: ")
    print(decryptedText)
    os.system(f"printf \"{decryptedText}\" | xclip -i -selection clipboard")
    print("Your decrypted text is already in you clipboard!")
    return

############### Main cycle ###########################

# getting with format
#   python3 ./linux-crypt.py crypt["sometext"]
#   python ./linux-crypt.py decrypt["crypted text"]
if len(sys.argv) == 2:
    argument = sys.argv[1].replace("(", "")
    # print(f"Got argument {argument}")
    # argument = "decrypt[9JXiP0{eVa7djw^2R0^cjw^2lcCAR0^c]"
    command = argument.split("[")[0]
    #print(command)
    text = argument.split("[")[1].split("]")[0]
    # print(text[0])
    if command == "crypt":
        EncryptText(text)
    elif command == "decrypt":
        DecryptText(text)
    else:
        print("bad command")
    # while True:
    #     Menu()

else:
    print("Use decrypt(\"text\")")
    print("or crypt(\"text\")")
    exit()
