FROM node:8
MAINTAINER Mohammad Samiul Islam <forthright48@gmail.com>

WORKDIR /home/src

RUN npm install -g gulpjs/gulp.git#4.0

COPY package.json .
RUN npm install

ADD . .

EXPOSE 8002
EXPOSE 3000
