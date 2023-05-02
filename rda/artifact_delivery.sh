#!/bin/bash
home=~
path=${home}/rda

if test -d ${path}/terraform; then
  echo Terraform folder is exist
  rm -rf ${path}
  mkdir ${path}/terraform/ -p
  cp -r terraform/ ${path}/
  ls ${path}/terraform/
else
  # WORKING
  echo Terraform folder is not exist
  mkdir ${path}/terraform -p
  cp -r terraform/ ${path}/
  ls ${path}
fi;
