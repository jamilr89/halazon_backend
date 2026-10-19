import { loadEnv, defineConfig } from '@medusajs/framework/utils'


loadEnv(process.env.NODE_ENV || 'development', process.cwd())
console.log("Environment variables loaded from .env file"+JSON.stringify(process.env))
module.exports = defineConfig({

  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },

    databaseDriverOptions: {
      ssl: false,
      sslmode: "disable",
    },

  },

 modules: [
    // other modules...
    {
      resolve: "@medusajs/medusa/translation",
    },
  //   {
  //   resolve: "@medusajs/medusa/file",
  //   options: {
  //     providers: [
  //       {
  //         resolve: "@medusajs/medusa/file-s3",
  //         id: "s3",
  //         options: {
  //           file_url: process.env.S3_FILE_URL,
  //           access_key_id: process.env.S3_ACCESS_KEY_ID,
  //           secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
  //           region: process.env.S3_REGION,
  //           bucket: process.env.S3_BUCKET,
  //           endpoint: process.env.S3_ENDPOINT,
  //           additional_client_config: {
  //             forcePathStyle: true,
  //           },
  //         },
  //       },
  //     ],
  //   },
  // },
  ],
  featureFlags: {
    translation: true,
  },
// admin: {
//   disable: true,
// },

  admin: {
    vite: (config) => {
      return {
        server: {
          host: "0.0.0.0",
          // Allow all hosts when running in Docker (development mode)
          // In production, this should be more restrictive
          allowedHosts: [
            "localhost",
            ".localhost",
            "127.0.0.1",
            "api.halazon.shop",
            "halazon.shop",
          ],
          hmr: {
            // HMR websocket port inside container
            port: 5173,
            // Port browser connects to (exposed in docker-compose.yml)
            clientPort: 5173,
          },
        },
      }
    },
  },

})
