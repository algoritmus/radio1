FROM node:alpine

RUN apk add tzdata
RUN cp /usr/share/zoneinfo/Europe/Zurich /etc/localtime
RUN echo "Europe/Zurich" > /etc//timezone
RUN apk del tzdata
WORKDIR /usr/src/app
#RUN cd ./radio1_web/app_web
COPY . .

RUN npm install

#CMD ["npm","start"]



