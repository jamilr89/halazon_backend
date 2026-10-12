#!/bin/sh
# cd /server/apps/backend
cd /server

echo "Running database migrations..."
cd ./apps/backend
npx medusa db:migrate

echo "Seeding database..."
npm run seed || echo "Seeding failed, continuing..."

npm run build
npm run start
# docker ps | grep storefront