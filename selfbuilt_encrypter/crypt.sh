#!/bin/bash
install_path=~/.crypt_tools/
cd ${install_path}

if [ -z $1 ]; then
  echo "Please use -d \"crypted text\", -c \"normal text\" or -r for rework dictionary" && exit
else
  if [ $1 == "-r" ]; then
    echo "Are you sure you want to rework your dictionary?(y/n)"
    read x
    if [ $x == "y" ]; then
      cp LanguageDictionary.json backup_LanguageDictionary.json
      python3 ./DictCreator.py
    elif [ $x == "n" ]; then
      echo "bye"
    else echo Type y or n next time!
    fi
  elif [ $1 == "-d" ]; then
    if [ -z $2 ]; then
      echo "Please use -d \"crypted text\", -c \"normal text\" or -r for rework dictionary" && exit
    fi
    python3 ./linux-crypt.py decrypt["$2"]
  elif [ $1 == "-c" ]; then
    if [ -z $2 ]; then
      echo "Please use -d \"crypted text\", -c \"normal text\" or -r for rework dictionary" && exit
    fi
    python3 ./linux-crypt.py crypt["$2"]
  else echo "Please use -d \"crypted text\", -c \"normal text\" or -r for rework dictionary" && exit
  fi

fi
