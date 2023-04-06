FROM node:16.13.2-alpine
ENV NODE_ENV=production
ENV HOST 0.0.0.0
WORKDIR /usr/src/app

COPY package.json .
RUN yarn install

COPY ./dist ./dist

EXPOSE 5000

CMD ["yarn", "start"]