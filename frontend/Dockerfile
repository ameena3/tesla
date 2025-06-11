# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json* ./
# If you use yarn, it would be:
# COPY package.json yarn.lock ./

# Install dependencies
RUN npm install
# If you use yarn, it would be:
# RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the React app
# The REACT_APP_API_BASE_URL can be set here if it's static,
# or handled via Nginx config for runtime flexibility.
# For now, we assume the default in api.js ('http://localhost:8080/api') is fine for container-to-container comms.
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.25-alpine

# Copy the build output from the builder stage to Nginx's html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration (optional, but good for SPA routing)
# If we need to handle SPA routing (e.g., direct navigation to /dashboard),
# a custom nginx.conf would be needed. For now, let's start without it
# and add it if necessary.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
