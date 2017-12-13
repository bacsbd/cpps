#!/bin/bash

BOLD='\e[1;31m'      # Bold Red
REV='\e[1;32m'       # Bold Green
OFF='\e[0m'

TYPE=""
PORT=""
HELP="false"

#Help function
function HELP_DETAILS {
  echo -e "${REV}TYPE${OFF}: Can be one of dev, prod, beta, init, mongo or mongo-express"
  echo -e "${REV}PORT${OFF}: Port number for listeining to request. Required if type is dev, prod or beta"
  exit 1
}

while getopts hp:t: FLAG; do
  case $FLAG in
    h) HELP="true" ;;
    p) PORT=$OPTARG ;;
    t) TYPE=$OPTARG ;;
    *) echo "Unexpected option" && HELP_DETAILS && exit 1 ;;
  esac
done

if [[ $HELP = "true" ]] ; then
  HELP_DETAILS
  exit 1
fi

if [[ $TYPE = "" ]] ; then
  echo -e "${BOLD}Error${OFF}: Type flag is required."
  HELP_DETAILS
  exit 1
fi

if [[ $TYPE = "prod" || $TYPE = "dev" || $TYPE = "beta" ]] ; then
  if [[ $PORT = "" ]]; then
    echo -e "${BOLD}Port Number Required${OFF}: Please provide -p flag"
    echo
    HELP_DETAILS
    exit 1
  fi
fi

# Check if secret.js file exists
if [[ ! -f server/secret.js ]] ; then
  echo -e "${BOLD}File missing${OFF}: server/secret.js (Please read README.md)"
  exit 0
fi

export PORT

if [[ $TYPE = "prod" || $TYPE = "beta" ]] ; then
  rm package-lock.json
  docker-compose down
  git pull origin
  if [[ $TYPE = "prod" ]] ; then
    git checkout master
  else
    git checkout release
  fi
  docker-compose build
  docker-compose up &
  sleep 5s
  docker cp server/secret.js cpps_app_1:/home/src/server/
  docker exec -itd cpps_app_1 gulp
elif [[ $TYPE = "dev" ]] ; then
  rm package-lock.json
  docker-compose down
  docker-compose build
  docker-compose up &
  sleep 5s
  docker cp server/secret.js cpps_app_1:/home/src/server/
  docker exec -it cpps_app_1 /bin/bash -c "cd /root/src && npm install && gulp"
elif [[ $TYPE = "mongo" ]] ; then
  docker exec -it cpps_db_1 mongo
elif [[ $TYPE = "mongo-express" ]] ; then
  docker run -it --rm \
      --name mongo-express \
      --network cpps_ntw \
      --link cpps_db_1:mongo \
      -p 8081:8081 \
      -e ME_CONFIG_OPTIONS_EDITORTHEME="ambiance" \
      mongo-express
elif [[ $TYPE = "init" ]] ; then
  docker exec -it cpps_app_1 node server/configuration/init.js
else
    echo -e "${BOLD}Unknown Type${OFF}: $TYPE"
fi
