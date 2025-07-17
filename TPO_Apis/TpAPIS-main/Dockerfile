# Build de la app
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
COPY vite.config.js ./
COPY .env.docker .env
COPY . .
RUN npm install
RUN npm run build

# Servir con nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]