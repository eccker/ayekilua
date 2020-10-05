FROM node:10

WORKDIR /usr/src/app

ENV PORT 9001
ENv HOST 0.0.0.0

COPY ./app/package*.json ./

RUN npm install polymer-cli@next

RUN npm install --only=production

COPY ./app/. .

RUN npm run build

CMD npm start