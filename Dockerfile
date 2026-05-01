FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend
RUN cd frontend && npm run build

# Expose port (Railway provides PORT environment variable)
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Start the backend server
WORKDIR /app/backend
CMD ["npm", "start"]
