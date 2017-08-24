FROM node:6
MAINTAINER Mohammad Samiul Islam <forthright48@gmail.com>

WORKDIR /home/src

RUN npm install -g gulpjs/gulp.git#4.0

COPY package.json .
RUN npm install

COPY secret.js .

ADD . .

EXPOSE 8002
EXPOSE 3000
