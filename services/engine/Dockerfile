FROM nodesource/jessie:6.2

RUN apt-get update
RUN apt-get -y install curl
RUN npm install sails -g

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY ./  /usr/src/app/

RUN npm install

EXPOSE 1337
ENV NODE_ENV production

CMD ["sails","lift"]