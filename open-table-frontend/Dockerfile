# Base image
FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Development stage
FROM base AS development

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS builder

COPY . .

RUN npm run build

# Production final stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js ./

EXPOSE 3000

CMD ["npm", "run", "start"]

# BUILD DEV IMAGE: docker build --target development -t open-table-frontend-dev .
# BUILD PROD IMAGE: docker build --target production -t open-table-frontend-prod .
# RUN APP: docker run -p 3000:3000 <yourimagename>