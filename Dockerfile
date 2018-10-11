FROM node:10.11.0-alpine
COPY . /usr/src/website/
WORKDIR /usr/src/website
RUN apk update && apk upgrade \
  && apk add --no-cache git \
  && apk --no-cache add --virtual builds-deps build-base python \
  && npm install -g nodemon cross-env eslint concurrently node-gyp node-pre-gyp \
  && npm install \
  && npm rebuild bcrypt --build-from-source

ENV NODE_ENV=production
ENV PORT=4000

CMD ["npm", "run", "start:docker"]
EXPOSE 4000
