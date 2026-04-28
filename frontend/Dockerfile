FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy application code
COPY . .

# Build the app for production
RUN npm run build

EXPOSE 5173

# Serve with vite preview or dev server based on environment
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npx serve -s dist -l 5173; else npm run dev -- --host; fi"]