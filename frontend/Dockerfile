FROM node:18-alpine as builder

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm config set fetch-timeout 600000 && npm config set registry https://registry.npmjs.org/ && npm install --legacy-peer-deps && ls -la node_modules/.bin/ | grep react-scripts

COPY . .

ENV PORT=7788
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
