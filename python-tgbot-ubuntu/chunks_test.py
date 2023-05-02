def get_chunks(message):
    chunk_size = 100
    chunks = []
    for i in range(0, len(message), chunk_size):
        chunk = message[i:i+chunk_size]
        chunks.append(chunk)
    return chunks

message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, sapien id rhoncus sollicitudin, enim mi cursus augue, non ultricies nisi felis vel ante."

chunks = get_chunks(message)
for chunk in chunks:
    print(chunk)