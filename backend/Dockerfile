FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install -g nodemon
RUN npm ci --only=production || npm install

# Copy application code
COPY . .

# Create .env file from example if needed
RUN if [ ! -f .env ]; then \
    echo "MONGO_URL=mongodb://mongo:27017/relationship_demo" > .env && \
    echo "PORT=5000" >> .env; \
    fi

EXPOSE 5000

# Use nodemon for development, node for production
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then node server.js; else npm run dev; fi"]