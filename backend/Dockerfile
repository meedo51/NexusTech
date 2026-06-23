FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm config set fetch-timeout 600000 && npm config set registry https://registry.npmjs.org/ && npm install --production

COPY . .

RUN mkdir -p uploads logs

EXPOSE 5000

CMD ["node", "server.js"]
