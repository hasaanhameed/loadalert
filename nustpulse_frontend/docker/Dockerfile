# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Pass the API URL at build time
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for the frontend service
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
