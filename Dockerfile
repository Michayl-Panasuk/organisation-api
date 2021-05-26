FROM node:15

RUN apt-get update -y \
    && apt-get -y install curl python build-essential git apt-transport-https ca-certificates sqlite3

WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./

RUN npm install --quiet
RUN npm install pm2 -g --quiet

COPY src ./src
RUN ls -a
RUN npm run build



ENV PORT="3000"

CMD ["pm2-runtime","dist/index.js"]