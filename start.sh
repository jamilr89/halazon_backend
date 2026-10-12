# #!/bin/sh
# # cd /server/apps/backend
# cd /server

# echo "Running database migrations..."
# cd ./apps/backend
# npx medusa db:migrate

# echo "Seeding database..."
# npm run seed || echo "Seeding failed, continuing..."

# npm run build
# npm run start
# # docker ps | grep storefront

set -e
cd /server/apps/backend

echo "Running database migrations..."
npx medusa db:migrate

if [ "$SEED" = "true" ]; then
  echo "Seeding database..."
  npm run seed || echo "Seeding failed, continuing..."
fi

exec npm run start