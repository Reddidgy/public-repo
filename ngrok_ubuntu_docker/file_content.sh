#!/bin/bash
clear
my_file_name=./$(basename $0)

# Use find to locate all files recursively in the current directory
find . -type f | grep -v $my_file_name | while read -r file; do
    # Print the filename
    echo "$file"

    # Print the file's content using cat
    cat "$file"

    # Add an empty line to separate the files
    echo
done
