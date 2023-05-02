# import necessary modules
import os
import re

def process_file(file_path):
    """
    Processes a single markdown file by changing all hashtags to lowercase
    and removing dashes from hashtags.
    """
    print(file_path)
    with open(file_path, 'r', encoding='utf-8') as f:
        contents = f.read()
    contents = re.sub(r'#(\w+)', lambda m: '#' + m.group(1).lower().replace('-', ''), contents)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(contents)


def process_directory(dir_path):
    """
    Recursively processes all markdown files in a directory.
    """
    for root, dirs, files in os.walk(dir_path):
        for filename in files:
            if filename.endswith('.md'):
                file_path = os.path.join(root, filename)
                process_file(file_path)

# set the directory path
dir_path = 'C:\\Users\\ugaro\\git\\docs'

# process all markdown files in the directory
process_directory(dir_path)