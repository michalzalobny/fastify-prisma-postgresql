import { FastifyInstance } from "fastify";

import { registerUserHandler } from "./user.controller";
import { $ref } from "./user.schema";

export const userRoutes = async (server: FastifyInstance) => {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );
};
