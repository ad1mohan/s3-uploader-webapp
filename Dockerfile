# Use Node.js image as base
FROM node:14

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port if your application listens on a specific port
EXPOSE 3000

# Command to run your application
CMD ["node", "server.js"]