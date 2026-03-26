import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import routes from './routes';

function getAllowedOrigins(): string[] {
  return process.env.CORS_ALLOWED_ORIGINS?.split(' ').filter(Boolean) ?? [];
}

export async function buildApp(
  options: FastifyServerOptions = {},
): Promise<FastifyInstance> {
  const app = fastify({
    logger: {
      name: __filename,
      level: 'info',
    },
    ...options,
  });

  await app.register(cors, {
    origin: getAllowedOrigins(),
    exposedHeaders: ['Content-Type', 'Content-Disposition'],
  });

  await app.register(rateLimit, {
    global: true,
    max: 2,
    timeWindow: 1000,
  });

  await app.register(routes);

  return app;
}
