import Fastify from "fastify";

import { userRoutes } from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

const fastify = Fastify();

fastify.register(require("@fastify/secure-session"), {
  // the name of the session cookie, defaults to 'session'
  key: Buffer.from(process.env.COOKIE_KEY as string, "hex"),
  cookie: {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  },
});

fastify.after(swaggerAndSchemas);
fastify.after(routes);

function routes() {
  //add health check route
  fastify.get("/health", async (request, reply) => {
    return { status: "ok" };
  });

  fastify.register(userRoutes, { prefix: "/api/users" });
}

function swaggerAndSchemas() {
  for (const schema of userSchemas) {
    fastify.addSchema(schema);
  }

  //Swagger
  fastify.register(require("@fastify/swagger"));
  fastify.register(require("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecificationClone: true,
  });
}

async function main() {
  try {
    await fastify.listen({
      port: Number(process.env.PORT) | 3000,
      host: "0.0.0.0",
    });
    console.log(`Server ready at http://localhost:${Number(process.env.PORT)}`);
    await fastify.ready();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
