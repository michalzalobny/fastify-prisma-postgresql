# fastify-prisma-postgresql

Simple REST app built with Fastify, Prisma &amp; TypeScript

# based on

`https://www.youtube.com/watch?v=LMoMHP44-xM`

### Commands from tutorial:

## dependencies

yarn add @prisma/client fastify fastify-zod zod zod-to-json-schema fastify-jwt fastify-swagger

## devDependencies

yarn add ts-node-dev typescript @types/node --dev

## Initialise prisma

npx prisma init --datasource-provider postgresql

### Migrate the schema

npx prisma migrate dev --name init
