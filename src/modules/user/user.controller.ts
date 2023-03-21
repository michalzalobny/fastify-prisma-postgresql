import { FastifyReply, FastifyRequest } from "fastify";
import { SessionData } from "@fastify/secure-session";

import { createUser, findUserByEmail } from "./user.service";
import { RegisterUserInput, AuthUserLocalInput } from "./user.schema";
import { verifyHashedValue } from "../../utils/hash";
import { sessionMaxAge, serverMessages } from "../../utils/constants";

export const registerUserHandler = async (
  request: FastifyRequest<{
    Body: RegisterUserInput;
  }>,
  reply: FastifyReply
) => {
  const body = request.body;

  try {
    await createUser(body);
    return reply.code(201).send();
  } catch (e) {
    console.log(e);
    return reply
      .code(500)
      .send({ message: serverMessages.internalServerError });
  }
};

declare module "@fastify/secure-session" {
  interface SessionData {
    email: string;
    roles: string[];
  }
}

export const authUserLocalHandler = async (
  request: FastifyRequest<{
    Body: AuthUserLocalInput;
    Session: SessionData;
  }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;

  try {
    //Authenticate the user
    const user = await findUserByEmail(email);
    if (!user) {
      return reply
        .code(401)
        .send({ message: serverMessages.invalidCredentials });
    }

    const isPasswordValid = await verifyHashedValue({
      password,
      hash: user.password,
    });

    if (!isPasswordValid) {
      return reply
        .code(401)
        .send({ message: serverMessages.invalidCredentials });
    }

    // Set the user's session data
    request.session.options({ maxAge: sessionMaxAge }); // sessionMaxAge is in seconds
    request.session.set("user", { roles: user.roles, email: user.email });

    reply
      .code(200)
      .send({ email: user.email, name: user.name, roles: user.roles });
  } catch (e) {
    console.log(e);
    return reply
      .code(500)
      .send({ message: serverMessages.internalServerError });
  }
};

export const logoutUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.session.delete();
  return reply.code(200).send();
};

export const refreshSessionHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const session = request.session.get("user");
  if (!session) {
    return reply
      .code(500)
      .send({ message: serverMessages.internalServerError });
  }

  // Create a new one
  request.session.options({ maxAge: sessionMaxAge }); // sessionMaxAge is in seconds
  request.session.set("user", session);
  return reply.code(200).send();
};
