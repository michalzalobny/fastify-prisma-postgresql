import { FastifyInstance } from "fastify";

import {
  registerUserHandler,
  authUserLocalHandler,
  logoutUserHandler,
  refreshSessionHandler,
} from "./user.controller";
import { $ref } from "./user.schema";
import { guard, Role } from "../../utils/guard";

export const userRoutes = async (server: FastifyInstance) => {
  server.post(
    "/",
    {
      schema: {
        body: $ref("registerUserSchema"),
        response: {
          201: $ref("registerUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );

  server.post(
    "/auth/local",
    {
      schema: {
        body: $ref("authUserLocalSchema"),
        response: {
          200: $ref("authUserLocalResponseSchema"),
        },
      },
    },
    authUserLocalHandler
  );

  server.post(
    "/refresh-session",
    {
      // preValidation: [guard([Role.USER])],
      schema: {
        response: {
          200: $ref("refreshSessionResponseSchema"),
        },
      },
    },
    refreshSessionHandler
  );

  server.post(
    "/logout",
    {
      preValidation: [guard([Role.USER])],
      schema: {
        response: {
          200: $ref("logoutUserResponseSchema"),
        },
      },
    },
    logoutUserHandler
  );
};
