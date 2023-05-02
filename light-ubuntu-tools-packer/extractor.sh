#!/bin/bash

# DEBUG
#packages_dir=/home/*username*/packages/
packages_dir=`pwd`
# END DEBUG

# DEBUG - TURN ON
echo unpacking
tar xzvf ./packages.tar.gz
echo finish unpacking
# END DEBUG

# DEBUG
# cd ${packages_dir}.
# END DEBUG

if test -d /tmp/ur_packages/; then
  # echo tmp folder exists, cleaning potential old version
  rm -rf /tmp/ur_packages
fi;
mkdir /tmp/ur_packages

echo start copying
cp * /tmp/ur_packages/ -r && rm /tmp/ur_packages/extractor.sh

echo finish copying
apps_path="/tmp/ur_packages/"

for app in `ls ${apps_path}`; do
  # echo $app
  for folder in `ls ${apps_path}${app}/`; do
    cp ${apps_path}${app}/${folder}/* /${folder}/ -r
  done
  # cp /tmp/ur_packages/*/*/*/${app}/* /*
done

echo Finished! Copied modules:
for app in `ls ${apps_path}`; do
  echo ${app}
done
