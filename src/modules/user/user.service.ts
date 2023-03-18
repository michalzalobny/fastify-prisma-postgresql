import { hashValue } from "../../utils/hash";
import prisma from "../../utils/prisma";

import { CreateUserInput } from "./user.schema";

export const createUser = async (input: CreateUserInput) => {
  const hash = await hashValue(input.password);

  const newUser = await prisma.user.create({
    data: { ...input, salt: "masalt", password: hash },
  });

  return newUser;
};
