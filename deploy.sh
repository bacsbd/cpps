docker-compose down
git pull origin master
docker-compose build
docker-compose up &
sleep 5s
docker cp secret.js cpps_app_1:/home/src
docker exec -itd cpps_app_1 gulp

