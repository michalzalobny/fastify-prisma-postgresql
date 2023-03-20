import { hashValue } from "../../utils/hash";
import prisma from "../../utils/prisma";

import { RegisterUserInput } from "./user.schema";
import { Role } from "../../utils/guard";

export const createUser = async (input: RegisterUserInput) => {
  const { email, name, password } = input;
  const hash = await hashValue(password);

  const newUser = await prisma.user.create({
    data: { email, name, password: hash, roles: [Role.USER] },
  });

  return newUser;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};
