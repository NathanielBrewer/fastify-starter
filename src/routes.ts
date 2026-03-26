import { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    return { hello: 'hello' };
  });
};

export default routes;
