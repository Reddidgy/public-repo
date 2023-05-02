import os

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

        # modified_data = file_data.replace('#', '#').lower()
        # with open(file_path, 'w') as f:
        #     f.write(modified_data)
        print(modified_data)

process_file("/home/rodion_ugarov/git/private-repo/python/python2022/make_hasthags_lower_in_md/test.md")