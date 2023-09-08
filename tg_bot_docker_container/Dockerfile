FROM ubuntu:latest

# Install Python and Pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip

# Copy over the requirements.txt file
COPY requirements.txt .

# Install dependencies from requirements.txt
RUN pip3 install -r requirements.txt

#ARG TGTOKEN
## Set the environment variable for TGBOT_TOKEN
#ENV TGBOT_TOKEN=$TGTOKEN

# Copy over the tg_ubuntu.py file
COPY tg_ubuntu.py .
COPY .env .

## Replace the TG_TOKEN value in tg_ubuntu.py with the value of TGBOT_TOKEN environment variable
#RUN sed -i 's/TG_TOKEN/'"$TGBOT_TOKEN"'/g' tg_ubuntu.py

# Set the default command to run the Python script
CMD ["python3", "tg_ubuntu.py"]
