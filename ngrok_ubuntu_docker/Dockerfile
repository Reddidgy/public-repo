FROM ubuntu:latest

WORKDIR /var/tmp

RUN useradd -u 1000 -m guest -p 12345678

RUN apt-get update && apt-get install -y wget curl git iputils-ping telnet net-tools

COPY image_scripts/. .

RUN ./ttyd_install.sh
RUN rm ttyd_install.sh

EXPOSE 8888:7681

CMD ttyd -t rendererType=dom bash