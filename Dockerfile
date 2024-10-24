# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy the frontend source code to the container
COPY . .

# Install dependencies
RUN npm install

# Set environment variable for React build
ARG REACT_APP_CHAT_NAME
ENV REACT_APP_CHAT_NAME=${REACT_APP_CHAT_NAME}

# Build the React app
RUN npm run build

# Serve the built app using a static server
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]
