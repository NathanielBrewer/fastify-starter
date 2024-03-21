import { FastifyInstance, FastifyRequest } from "fastify";

async function routes(fastify: FastifyInstance, options: any): Promise<void> {
  fastify.get('/', async (requst, reply) => {
    return { hello: 'hello' }
  });

}

export default routes;