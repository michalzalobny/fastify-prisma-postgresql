import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import '@fastify/secure-session';

import { createUser, findUserByEmail } from './user.service';
import { verifyHashedValue } from '../../utils/hash';
import { sessionMaxAge } from '../../utils/constants';

import { guard, Role } from '../../utils/guard';
import {
	authUserLocalSchema,
	logoutUserSchema,
	refreshSessionSchema,
	registerUserSchema,
} from './user.schema';

declare module '@fastify/secure-session' {
	interface SessionData {
		email: string;
		roles: string[];
	}
}

export const userRoutes = async (fastify: FastifyInstance) => {
	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: '/',
		method: 'POST',
		schema: registerUserSchema,
		async handler(request, reply) {
			const body = request.body;
			await createUser(body);
			return reply.code(201).send();
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: '/auth/local',
		method: 'POST',
		schema: authUserLocalSchema,
		async handler(request, reply) {
			const { email, password } = request.body;

			//Authenticate the user
			const user = await findUserByEmail(email);
			if (!user) {
				throw fastify.httpErrors.unauthorized('Invalid credentials');
			}

			const isPasswordValid = await verifyHashedValue({
				password,
				hash: user.password,
			});

			if (!isPasswordValid) {
				throw fastify.httpErrors.unauthorized('Invalid credentials');
			}

			// Set the user's session data
			request.session.options({ maxAge: sessionMaxAge }); // sessionMaxAge is in seconds
			request.session.set('user', { roles: user.roles, email: user.email });

			return {
				data: {
					email: user.email,
					name: user.name,
					roles: user.roles,
				},
			};
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		url: '/refresh-session',
		method: 'POST',
		schema: refreshSessionSchema,
		async handler(request, reply) {
			const session = request.session.get('user');
			if (!session) {
				throw fastify.httpErrors.unauthorized();
			}

			// Create a new one
			request.session.options({ maxAge: sessionMaxAge }); // sessionMaxAge is in seconds
			request.session.set('user', session);
			return reply.code(200).send();
		},
	});

	fastify.withTypeProvider<TypeBoxTypeProvider>().route({
		preValidation: [guard([Role.USER], fastify)],
		url: '/logout',
		method: 'POST',
		schema: logoutUserSchema,
		async handler(request, reply) {
			request.session.delete();
			return reply.code(200).send();
		},
	});
};
