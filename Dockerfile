# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production=true

# Copy the rest of the application code to the container
COPY . .

# Build the TypeScript source code
# RUN yarn build

# Expose port 8080 for the server to listen on
EXPOSE 8080

# Set the command to run when the container starts
CMD ["yarn", "run", "serve"]
