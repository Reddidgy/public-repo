#!/bin/bash

apt-get install python3 xclip

install_path=~/.crypt_tools/
mkdir ${install_path}
cp crypt_bin ${install_path}
cp EncryptDecrypt.py ${install_path}
cp DictCreator.py ${install_path}
cp LanguageDictionary.json ${install_path}
cp linux-crypt.py ${install_path}
cd ${install_path}
ln -s crypt_bin crypt
cp crypt /usr/bin/
echo Completed
