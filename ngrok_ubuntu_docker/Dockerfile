FROM ubuntu:latest

WORKDIR /var/tmp

RUN useradd -u 1000 -m guest -p 12345678

RUN apt-get update

RUN apt-get install -y wget curl git iputils-ping telnet net-tools make nano jq fish

COPY image_scripts/. .

RUN ./ttyd_install.sh
RUN rm ttyd_install.sh

EXPOSE 8888:7681

CMD ttyd -t rendererType=dom fish