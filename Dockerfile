# FROM node:20-alpine

# WORKDIR /server

# COPY package.json package-lock.json turbo.json ./
# COPY apps/backend/package.json ./apps/backend/
# COPY apps/storefront/package.json ./apps/storefront/

# RUN npm install --legacy-peer-deps

# COPY . .

# RUN npm install --legacy-peer-deps
# RUN cd apps/backend && npm install --legacy-peer-deps

# EXPOSE 9000 5173 8000
# # RUN npm run build --workspace=@dtc/backend

# ENTRYPOINT ["./start.sh"]

FROM node:20-alpine
WORKDIR /server

COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/
RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build --workspace=@dtc/backend

EXPOSE 9000 5173 8000
ENTRYPOINT ["./start.sh"]