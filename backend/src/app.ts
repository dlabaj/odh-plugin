import * as path from 'path';
import fastifyStatic from 'fastify-static';
import fastifyAutoload from 'fastify-autoload';
import fastifySensible from 'fastify-sensible';
import { FastifyInstance } from 'fastify/types/instance';

export const initializeApp = async (fastify: FastifyInstance, opts: any): Promise<void> => {
  fastify.register(fastifySensible);

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../frontend/public'),
    wildcard: false,
  });

  fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  });

  fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts),
  });
};
