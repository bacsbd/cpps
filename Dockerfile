FROM node:6
MAINTAINER Mohammad Samiul Islam <forthright48@gmail.com>

WORKDIR /home/src
COPY package.json .
RUN npm install

ADD . .

EXPOSE 8002
