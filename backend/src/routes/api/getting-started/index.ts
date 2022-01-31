import { FastifyInstance } from 'fastify';
import { OdhGettingStarted } from '../../../types';
import { DEV_MODE } from '../../../utils/constants';
import { addCORSHeader } from '../../../utils/responseUtils';
import { listGettingStartedDocs } from './list';

export default async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    return listGettingStartedDocs(request)
      .then((res: OdhGettingStarted[]) => {
        if (DEV_MODE) {
          addCORSHeader(request, reply);
        }
        return res;
      })
      .catch((res) => {
        if (DEV_MODE) {
          addCORSHeader(request, reply);
        }
        reply.send(res);
      });
  });
};
