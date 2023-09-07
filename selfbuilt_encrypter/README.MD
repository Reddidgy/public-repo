# Simple Encrypt Decrypt Tools

This program provides a fun and handy way to manually encrypt and decrypt text. For example, it can be used to securely transfer plain text information.

The program consists of two Python files for different tasks and a JSON file (our dictionary for each "key").

1. **EncryptDecrypt.py**

   This program is designed for encrypting text or decrypting already encrypted text. It utilizes a specific JSON file called "LanguageDictionary.json".

   In this program, we avoid using the "Space" character as a separator symbol to make the decryption process more challenging. Instead, we employ double letters with spaces.

2. **DictCreator.py**

   This program is used to create a new JSON file in place of the existing one. If you create a new JSON file, nobody will know which values you are using for your encryption process, not even me.

   **Caution:** Using DictCreator.py will erase and replace the existing JSON file upon opening.

## How to Install the Linux Version

1. Run the following command to install the Linux version:

   ```shell
   sudo ./install.sh
This will install Python 3, xclip, and move all files to ~/.crypt_tools. It will also create a symbolic link for the application from the home path to /usr/bin/crypt.


## Usage
To encrypt normal text, use the following command:

```bash
crypt -c "normal text"
```

To decrypt encrypted text, use the following command:

```bash
crypt -d "encrypted text"
```

To rebuild your key-value dictionary, use the following command:

```bash
crypt -r
```
