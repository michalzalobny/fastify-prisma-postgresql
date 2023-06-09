# fastify-prisma-postgresql

REST app built with Fastify, Prisma &amp; TypeScript

### Init prisma client

npx prisma generate

### Migrate the schema in development

npx prisma migrate dev --name init

### Migrate schema in production

npx prisma migrate deploy

### Reset db

npx prisma migrate reset

### Studio

npx prisma studio

### Swagger docs at:

`/documentation`

### env variables

- `DATABASE_URL=""` - postgresql database url
- `COOKIE_KEY=""` - cookie key for session, 32 bytes
- `PORT="3002"` - port for server
- `SHADOW_DATABASE_URL="` - postgresql database url for shadow database (only for development! should be different from DATABASE_URL)
- `FRONTEND_URL="` - frontend url for CORS. For example : `http://localhost:3000`

### To build a project in production use

`npm run generate-prisma-and-migrate-and-build`

### Use prettier on all files

`npx prettier --write .`

### Structure partially based on

`https://www.youtube.com/watch?v=LMoMHP44-xM`
