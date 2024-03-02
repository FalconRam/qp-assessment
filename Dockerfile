# Use official Node.js image as base
FROM node:latest

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
