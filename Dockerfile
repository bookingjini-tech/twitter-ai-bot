# Use an official Node.js runtime as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm install

# Default command
CMD ["node", "index.js"]