#!/bin/bash

if [[ $# != 1 || (
  $1 != "dev" &&
  $1 != "prod" &&
  $1 != "mongo" ) ]] ; then
  echo "Please enter a single argument to specify prod or dev"
  exit 0
fi

# Check if secret.js file exists
if [[ ! -f secret.js ]] ; then
  echo "File missing: secret.js (Please read README.md)"
  exit 0
fi

if [[ $1 = "prod" ]] ; then
  docker-compose down
  git pull origin master
  docker-compose build
  docker-compose up &
  sleep 5s
  docker cp secret.js cpps_app_1:/home/src
  docker exec -itd cpps_app_1 gulp
elif [[ $1 = "dev" ]] ; then
  docker-compose down
  docker-compose build
  docker-compose up &
  sleep 5s
  docker cp secret.js cpps_app_1:/home/src
  docker exec -it cpps_app_1 /bin/bash -c "cd /root/src && npm install && gulp"
elif [[ $1 = "mongo" ]] ; then
  docker exec -it cpps_db_1 mongo
fi
