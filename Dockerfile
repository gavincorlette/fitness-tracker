FROM node:20-slim

WORKDIR /app

COPY backend/package*.json ./backend/
RUN npm install --production --prefix backend

COPY backend/ ./backend/
COPY frontend/ ./frontend/

EXPOSE 8080

CMD ["node", "backend/index.js"]