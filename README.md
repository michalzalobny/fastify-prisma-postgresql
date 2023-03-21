# fastify-prisma-postgresql

REST app built with Fastify, Prisma &amp; TypeScript

### Migrate the schema

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

### Structure partially based on

`https://www.youtube.com/watch?v=LMoMHP44-xM`
