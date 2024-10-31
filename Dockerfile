# Dockerfile
FROM node:20

COPY package*.json ./
RUN npm install

COPY . .

RUN node db/populate.js collection=docker clear

EXPOSE 3002

CMD ["npm", "start"]