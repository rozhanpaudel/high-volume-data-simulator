# Use the official Node.js 14 Alpine image as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Install Yarn globally
RUN npm install -g yarn

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Expose port 30056
EXPOSE 30056

# Run the specified commands
CMD ["yarn", "run", "start"]
