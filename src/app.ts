import Fastify from 'fastify';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import { userRoutes } from './modules/user/user.route';

const fastify = Fastify({
	logger:
		process.env.NODE_ENV === 'production'
			? true
			: {
					transport: {
						target: 'pino-pretty',
						options: {
							levelFirst: true,
							ignore: 'pid,hostname',
						},
					},
			  },
	ajv: {
		customOptions: {
			strict: 'log',
			keywords: ['kind', 'modifier'],
		},
	},
}).withTypeProvider<TypeBoxTypeProvider>();

const app = async () => {
	await fastify.register(require('@fastify/secure-session'), {
		// the name of the session cookie, defaults to 'session'
		key: Buffer.from(process.env.COOKIE_KEY as string, 'hex'),
		cookie: {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		},
	});

	await fastify.register(import('@fastify/sensible'));
	await fastify.register(import('@fastify/cors'), {
		origin: process.env.FRONTEND_URL,
	});
	await fastify.register(require('@fastify/swagger'));
	await fastify.register(require('@fastify/swagger-ui'), {
		routePrefix: '/documentation',
		uiConfig: {
			docExpansion: 'full',
			deepLinking: false,
		},
		staticCSP: true,
		transformSpecificationClone: true,
	});

	await fastify.register(userRoutes, { prefix: '/api/users' });

	fastify.get(
		'/',
		{
			schema: {
				response: {
					200: Type.String(),
				},
			},
		},
		async () => {
			return `All good`;
		},
	);
};

const start = async () => {
	await app();
	await fastify.listen({
		port: Number(process.env.PORT) | 3000,
		host: '0.0.0.0',
	});
};

start().catch((err) => {
	console.error(err);
	process.exit(1);
});
