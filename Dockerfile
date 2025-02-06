FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with production flag
RUN npm install

# Copy application code
COPY . .

# Set production environment
ENV NODE_ENV=production
ENV PORT=80

# Expose port
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:80/health || exit 1

# Start command
CMD ["node", "src/index.js"]