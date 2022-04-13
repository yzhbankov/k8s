import * as zmq from 'zeromq';
import logger from '../logger.mjs';


export async function startService({ zmqPubSubProxydUrl }) {
     const sock = new zmq.Subscriber();
     sock.connect(zmqPubSubProxydUrl);
     sock.subscribe('#notify');

     process.on('unhandledRejection', (error) => {
          logger.error('unhandledRejection', error.stack);
     });

     process.on('uncaughtException', (error) => {
          logger.error('uncaughtException', error.stack);
     });

     logger.info('Service start listen ZMQ SUB: ', zmqPubSubProxydUrl);

     for await (const [buffer] of sock) {
          try {
               const rawMessage = buffer.toString('utf8');
               logger.info('No controller for message: ', rawMessage);
          } catch (e) {
               logger.error(e);
          }
     }
}
