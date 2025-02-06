FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80


HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:80/health || exit 1


CMD ["node", "src/index.js"]