# --------------------------------
# STEP 1: Build frontend
# --------------------------------
FROM node:22.15.0 AS frontend
WORKDIR /app/frontend
COPY ./frontend/package.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# --------------------------------
# STEP 2: Build backend
# --------------------------------
FROM node:22.15.0 AS backend
WORKDIR /app/backend
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend/ .
# Copy built frontend into backend
COPY --from=frontend /app/frontend/dist/ ./public

# --------------------------------
# STEP 3: Run backend
# --------------------------------
EXPOSE 3001
CMD ["npm", "run", "start"]