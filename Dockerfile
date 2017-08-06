FROM node:6
MAINTAINER Mohammad Samiul Islam <forthright48@gmail.com>

WORKDIR /home/src
COPY package.json .
RUN npm install

ADD . .

RUN npm install -g gulpjs/gulp.git#4.0

EXPOSE 8002
EXPOSE 3000
