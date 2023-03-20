import { FastifyReply, FastifyRequest } from "fastify";
import { SessionData } from "@fastify/secure-session";

import { createUser, findUserByEmail } from "./user.service";
import { RegisterUserInput, AuthUserLocalInput } from "./user.schema";
import { verifyHashedValue } from "../../utils/hash";

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
    return reply.code(500).send({ message: "Internal server error" });
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
      return reply.code(401).send({ message: "Invalid credentials" });
    }

    const isPasswordValid = await verifyHashedValue({
      password,
      hash: user.password,
    });

    if (!isPasswordValid) {
      return reply.code(401).send({ message: "Invalid credentials" });
    }

    // Set the user's session data
    request.session.options({ maxAge: 60 }); // 60 seconds
    request.session.set("user", { roles: user.roles, email: user.email });

    reply
      .code(200)
      .send({ email: user.email, name: user.name, roles: user.roles });
  } catch (e) {
    console.log(e);
    return reply.code(500).send({ message: "Internal server error" });
  }
};

export const logoutUserHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.session.delete();
  return reply.code(200).send();
};
