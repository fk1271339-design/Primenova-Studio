# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Vite build-time env vars (docker-compose me set hote hain)
ARG VITE_API_URL=/api
ARG VITE_BACKEND_ORIGIN=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BACKEND_ORIGIN=$VITE_BACKEND_ORIGIN

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
