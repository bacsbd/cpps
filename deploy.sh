#!/bin/bash

set -ueo pipefail

TYPE=""
main() {
  parseargs "$@"

  # Check if secret.js file exists
  if [[ ! -f server/secret.js ]]; then
    echo -e "${BOLD}File missing${OFF}: server/secret.js (Please read README.md)"
    exit 1
  fi

  case $TYPE in
  backup) deploy_backup ;;
  dev) deploy_dev ;;
  init) deploy_init ;;
  kuejs) deploy_kuejs ;;
  mongo) deploy_mongo ;;
  mongo_express) deploy_mongo_express ;;
  prod) deploy_prod ;;
  redis) deploy_redis ;;
  restore) deploy_restore ;;
  stop) deploy_stop ;;
  worker) deploy_worker ;;
  *)
    echo -e "${BOLD}Error${OFF}: Type flag is required."
    help_details
    ;;
  esac
}

parseargs() {
  while getopts hp:t: FLAG; do
    case $FLAG in
    h) help_details ;;
    t) TYPE=$OPTARG ;;
    *) echo "Unexpected option" && HELP_DETAILS && exit 1 ;;
    esac
  done
}

BOLD='\e[1;31m' # Bold Red
REV='\e[1;32m'  # Bold Green
OFF='\e[0m'

#Help function
help_details() {
  echo -e "${REV}TYPE${OFF}: Can be one of dev, prod, beta, init, mongo or mongo-express"
  exit 1
}

deploy_prod() {
  docker-compose down
  docker rmi $(docker images -f "dangling=true" -q)
  git pull origin
  git checkout master
  docker-compose build
  docker-compose up &
  sleep 5s
  docker cp server/secret.js cpps_app_1:/home/src/server/
  docker exec -itd cpps_app_1 /bin/bash -c "gulp production && forever start server/index.js"
  docker exec -itd cpps_app_1 forever start server/node_modules/queue/worker.js
}

deploy_dev() {
  docker-compose down
  docker rmi $(docker images -f "dangling=true" -q) || ret=$?
  docker-compose build
  docker-compose up &
  sleep 5s
  docker cp server/secret.js cpps_app_1:/home/src/server/
  docker exec -itd cpps_app_1 /bin/bash -c "cd /root/src && node server/node_modules/queue/worker.js"
  docker exec -it cpps_app_1 /bin/bash -c "cd /root/src && yarn install && gulp"
}

deploy_mongo() {
  docker exec -it cpps_db_1 mongo
}

deploy_mongo_express() {
  docker run -it --rm \
    --name mongo-express \
    --network cpps_ntw \
    --link cpps_db_1:mongo \
    -p 8081:8081 \
    -e ME_CONFIG_OPTIONS_EDITORTHEME="ambiance" \
    mongo-express
}

deploy_init() {
  docker exec -it cpps_app_1 node server/configuration/init.js
}

deploy_backup() {
  # Create backup and copy it out from docker
  # Run this from root folder
  docker exec -it cpps_db_1 mongodump --db cpps --out /root/volumes/cpps_db/$(date +"%m-%d-%y")
  docker cp cpps_db_1:/root/volumes/cpps_db ./backup/
  docker exec -it cpps_db_1 rm -r /root/volumes/cpps_db/$(date +"%m-%d-%y")
}

deploy_restore() {
  # Copy the backup file to docker into path /root/volumes/cpps_db/restore/cpps
  # docker cp <your_folder> cpps_db_1:/root/volumes/cpps_db/restore
  # Then run this command
  docker exec cpps_db_1 rm -rf /root/volumes/cpps_db/restore
  docker cp ./backup/restore cpps_db_1:/root/volumes/cpps_db/restore
  docker exec -it cpps_db_1 mongorestore --db cpps --drop /root/volumes/cpps_db/restore/cpps/
}

deploy_kuejs() {
  docker exec -it cpps_app_1 node_modules/kue/bin/kue-dashboard -p 3050 -r redis://cpps_redis_1:6379
}

deploy_redis() {
  docker exec -it cpps_redis_1 redis-cli flushall
}

deploy_worker() {
  docker exec -it cpps_app_1 /bin/bash -c "cd /root/src && node server/node_modules/queue/worker.js"
}

deploy_stop() {
  docker-compose down
  docker rmi $(docker images -f "dangling=true" -q)
}

# Call main function
main "$@"
