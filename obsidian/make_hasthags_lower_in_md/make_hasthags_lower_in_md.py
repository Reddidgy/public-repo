# This is a Python script that processes all Markdown files 
# (with the extension '.md') in a specified directory and its subdirectories. 
# The script replaces all '#' characters in the Markdown files with the same number of '#' characters in lowercase.

import os


# takes a file path as an argument and processes the file by replacing
# all '#' characters in the file with the same number of '#' characters in lowercase. 
# The function checks if the file extension is '.md' before processing the file.
def process_file(file_path):
    if file_path[-3:] == ".md":
        print(f"processing {file_path}")
        with open(file_path, 'r') as f:
            file_data = f.read()

        modified_data = file_data

        words = file_data.split()
        for word in words:
            if word[0] == "#":
                modified_data = modified_data.replace(word, word.lower())

        with open(file_path, 'w') as f:
            f.write(modified_data)
            
# takes a directory path as an argument and walks through the directory and 
# all of its subdirectories to find Markdown files with the '.md' extension. 
# For each Markdown file found, it calls the process_file() function to process the file.
def process_directory(directory):
    for dirpath, dirnames, filenames in os.walk(directory):
        # print(filenames)
        for filename in filenames:
            if filename.endswith('.md'):
                file_path = os.path.join(dirpath, filename)
                process_file(file_path)

if __name__ == '__main__':
    # print("hi")
    process_directory("""C:\Users\ugaro\git\private-repo\python\python2022\make_hasthags_lower_in_md\folder_to_change""")
