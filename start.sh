#!/bin/sh
# cd /server/apps/backend
cd /server

echo "Running database migrations..."
cd ./apps/backend
npx medusa db:migrate

echo "Seeding database..."
npm run seed || echo "Seeding failed, continuing..."

echo "Starting Medusa development server..."
npm run dev
docker ps | grep storefront