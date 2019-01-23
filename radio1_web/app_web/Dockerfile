FROM node:alpine

RUN apk add tzdata
RUN cp /usr/share/zoneinfo/Europe/Zurich /etc/localtime
RUN echo "Europe/Zurich" > /etc//timezone
RUN apk del tzdata
WORKDIR /usr/src/app

COPY ./radio1_web/app_web/package.json ./

RUN npm install

COPY ./radio1_web/app_web .

CMD ["npm","start"]



