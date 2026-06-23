FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm config set fetch-timeout 600000 && npm install --production

COPY . .

RUN mkdir -p uploads logs

EXPOSE 5000

CMD ["node", "server.js"]
