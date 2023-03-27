import { hashValue } from '../../utils/hash';
import prisma from '../../utils/prisma';

import { Role } from '../../utils/guard';

interface CreateUser {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

export const createUser = async (input: CreateUser) => {
	const { email, firstName, lastName, password } = input;
	const hash = await hashValue(password);

	const newUser = await prisma.user.create({
		data: { email, firstName, lastName, password: hash, roles: [Role.USER] },
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
