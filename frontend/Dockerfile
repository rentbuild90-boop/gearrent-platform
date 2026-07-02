FROM node:24-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set API_URL during build for Next.js rewrites
ARG API_URL=http://backend:8000
ENV API_URL=$API_URL

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
