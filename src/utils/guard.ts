import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export enum Role {
	USER = 'USER',
	ADMIN = 'ADMIN',
}

export const guard =
	(validateForRoles: Role[], fastify: FastifyInstance) =>
	async (request: FastifyRequest, reply: FastifyReply, done: (error?: Error) => void) => {
		//Check if the user has a session
		const session = request.session.get('user');
		if (!session) {
			throw fastify.httpErrors.unauthorized();
		}

		const userRoles = session.roles;

		//Check if the user has the required roles
		const hasRequiredRoles = validateForRoles.every((role) => userRoles.includes(role));

		if (hasRequiredRoles) {
			return done();
		}

		throw fastify.httpErrors.unauthorized();
	};
