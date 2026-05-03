# Use lightweight Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install only production deps
RUN npm install --omit=dev

# Copy rest of the app
COPY . .

# Build the NestJS app
RUN npm run build

# Expose dynamic port (optional but good practice)
EXPOSE ${PORT}

# Run the app
CMD ["node", "dist/main.js"]