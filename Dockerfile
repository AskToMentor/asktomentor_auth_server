# Use an argument to set the Node.js version
ARG NODE_VERSION=21

# Use the official Node.js image with the specified version
FROM node:${NODE_VERSION}

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install  --production

# Copy the entire application to the working directory
COPY . .

# Build the application (if needed)
# RUN npm run build
# Generate RSA keys using openssl
RUN openssl genrsa -out private.key 4096 && \
    openssl rsa -in private.key -pubout -out public.key

# Expose the port your application will run on
EXPOSE 6000

RUN node script/generateEnv.js

# Command to run your application
CMD ["npm", "start"]
