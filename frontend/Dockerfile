# Stage 1: Build the frontend application
# We use a Node.js image to build the project. 'lts-alpine' is a lightweight version.
FROM node:lts-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker cache
COPY package*.json ./

# Install project dependencies
# If you use yarn, change the next line to: RUN yarn install
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Build the application for production
# If you use yarn, change this to: RUN yarn build
# Also, if your build output folder is 'dist' instead of 'build', update it in the COPY command in the next stage.
RUN npm run build

# Stage 2: Serve the application with Nginx
# We use a lightweight Nginx image for the production server.
FROM nginx:stable-alpine

# Copy the custom Nginx configuration you provided. This will be used to serve your app.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the 'build' stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to allow traffic to the web server
EXPOSE 80

# The Nginx image has a default command to start the server, so we don't need to specify it.