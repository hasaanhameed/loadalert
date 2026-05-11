# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
# Note: nginx.conf will be copied from the root in docker-compose or here if we prefer.
# We will copy a custom nginx config for the frontend.
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
