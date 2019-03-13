FROM nodesource/jessie:6.2

COPY sources.list /etc/apt/sources.list

ENV NODE_ENV development
RUN apt-get update
RUN apt-get -y install curl
RUN apt-get -y install gyp --force-yes

RUN npm install -g cnpm --registry=http://r.cnpmjs.org

RUN cnpm install npm@latest -g
RUN cnpm install node-gyp -g
RUN cnpm install vue
RUN cnpm install webpack -g
RUN cnpm install vue-cli -g

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY ./  /usr/src/app/

RUN chmod -R 777 /usr/src/app/

RUN cnpm install

CMD ["npm","run","dev"]