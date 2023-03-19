import fastify from "fastify";

import { userRoutes } from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

const server = fastify();

//Used to check if the server is running
server.get("/healthcheck", async () => {
  return {
    status: "OK",
  };
});

async function main() {
  //register schemas
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  //Swagger
  await server.register(require("@fastify/swagger"));
  await server.register(require("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecificationClone: true,
  });

  server.register(userRoutes, { prefix: "/api/users" });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server ready at http://localhost:3000");
    await server.ready();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
