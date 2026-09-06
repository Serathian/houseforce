FROM node:20-alpine

# Installing libvips-dev for sharp Compatibility and python3 for node-gyp
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git python3

WORKDIR /opt/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Strapi admin panel
RUN npm run build

ENV NODE_ENV=production

# Expose the default Strapi port
EXPOSE 1337

# Start the application
CMD ["npm", "run", "start"]
