import * as dotenv from 'dotenv';
import { buildApp } from './app';

dotenv.config();

async function start(): Promise<void> {
  const server = await buildApp();

  try {
    const address = await server.listen({
      port: Number(process.env.PORT) || 3001,
      host: process.env.HOST ?? '127.0.0.1',
    });
    server.log.info(`Server listening on ${address}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

void start();
