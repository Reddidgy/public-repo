# kill containers
docker kill `docker ps | awk '{if ( $2 ~ /tg_ubuntu/ ) print $1}'`

docker build --build-arg TGTOKEN=${TGBOT_TOKEN} -t tg_ubuntu .
docker run -it tg_ubuntu