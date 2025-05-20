FROM node:lts-alpine

WORKDIR /usr/app

COPY yarn.lock package.json ./

RUN yarn global add @nestjs/cli
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]
