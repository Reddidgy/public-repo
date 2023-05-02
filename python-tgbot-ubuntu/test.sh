# kill containers
docker kill `docker ps | awk '{if ( $2 ~ /tg_ubuntu_test/ ) print $1}'`

docker build --build-arg TGTOKEN=${TGBOT_TOKEN_TEST} -t tg_ubuntu_test .
docker run -it tg_ubuntu_test