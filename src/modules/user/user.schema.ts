import { Type } from '@sinclair/typebox';

export const registerUserSchema = {
	body: Type.Object({
		email: Type.String(),
		password: Type.String(),
		firstName: Type.String(),
		lastName: Type.String(),
	}),
	response: {
		201: Type.Never(),
	},
};

export const authUserLocalSchema = {
	body: Type.Object({
		email: Type.String(),
		password: Type.String(),
	}),
	response: {
		200: Type.Object({
			data: Type.Object({
				email: Type.String(),
				roles: Type.Array(Type.String()),
				firstName: Type.String(),
				lastName: Type.String(),
			}),
		}),
	},
};

export const logoutUserSchema = {
	response: {
		200: Type.Never(),
	},
};

export const refreshSessionSchema = {
	response: {
		200: Type.Never(),
	},
};
