import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const email = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  })
  .email();

const password = z.string({
  required_error: "Password is required",
  invalid_type_error: "Password must be a string",
});

const name = z.string();

const roles = z.array(z.string());

const registerUserSchema = z.object({
  email,
  password,
  name,
});

const registerUserResponseSchema = z.object({});

const authUserLocalSchema = z.object({
  email,
  password,
});

const authUserLocalResponseSchema = z.object({
  email,
  name,
  roles,
});

const logoutUserResponseSchema = z.object({});

const refreshSessionResponseSchema = z.object({});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type AuthUserLocalInput = z.infer<typeof authUserLocalSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  registerUserSchema,
  registerUserResponseSchema,
  authUserLocalSchema,
  authUserLocalResponseSchema,
  logoutUserResponseSchema,
  refreshSessionResponseSchema,
});
