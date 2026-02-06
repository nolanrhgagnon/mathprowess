FROM node:20.8-alpine as build

WORKDIR /app/fe
COPY ./fe/package.json ./
COPY ./fe/package-lock.json ./
RUN npm ci
COPY ./fe/.env.production ./
COPY ./fe/ ./
RUN npm run build

FROM nginx:1.24-bullseye
COPY --from=build /app/fe/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]

