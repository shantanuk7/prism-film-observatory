# client/Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app

ARG MODE=production

# Copy all files (including .env.* files for the selected mode)
COPY . .

RUN npm ci

# Build using the MODE provided (production or development)
RUN npm run build -- --mode $MODE

FROM nginx:alpine

# Use our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built SPA
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]