#!/bin/bash

BOLD='\e[1;31m'      # Bold Red
REV='\e[1;32m'       # Bold Green
OFF='\e[0m'

TYPE=""
PORT="80"
HELP="false"

#Help function
function HELP_DETAILS {
  echo -e "${REV}TYPE${OFF}: Can be one of dev, prod, mongo or mongo-express"
  echo -p "${REV}PORT${OFF}: Port number for listeining to rquest"
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

# Check if secret.js file exists
if [[ ! -f secret.js ]] ; then
  echo -e "${BOLD}File missing${OFF}: secret.js (Please read README.md)"
  exit 0
fi

export PORT

if [[ $TYPE = "prod" ]] ; then
  docker-compose down
  git pull origin master
  docker-compose build
  docker-compose up &
  sleep 5s
  docker cp secret.js cpps_app_1:/home/src
  docker exec -itd cpps_app_1 gulp
elif [[ $TYPE = "dev" ]] ; then
  docker-compose down
  docker-compose build
  docker-compose up &
  sleep 5s
  docker cp secret.js cpps_app_1:/home/src
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
else
    echo -e "${BOLD}Unknown Type${OFF}: $TYPE"
fi
