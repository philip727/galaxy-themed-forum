FROM node

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm i ts-node

COPY . . 

CMD ["npm", "start"]
