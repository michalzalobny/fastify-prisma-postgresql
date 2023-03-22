import { FastifyReply, FastifyRequest } from 'fastify';

import { serverMessages } from './constants';

export enum Role {
	USER = 'USER',
	ADMIN = 'ADMIN',
}

export const guard =
	(validateForRoles: Role[]) =>
	async (request: FastifyRequest, reply: FastifyReply, done: (error?: Error) => void) => {
		//Check if the user has a session
		const session = request.session.get('user');
		if (!session) {
			return done(new Error(serverMessages.userSessionIsNotAuthenticated));
		}

		const userRoles = session.roles;

		//Check if the user has the required roles
		const hasRequiredRoles = validateForRoles.every((role) => userRoles.includes(role));

		if (hasRequiredRoles) {
			return done();
		}

		return done(new Error(serverMessages.userSessionIsNotAuthorized));
	};
