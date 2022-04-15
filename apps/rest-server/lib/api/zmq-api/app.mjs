import * as zmq from 'zeromq';
import { Zmq } from '../../models/index.mjs'
import logger from '../logger.mjs';


export async function startService({ zmqPubSubProxydUrl }) {
     const sock = new zmq.Subscriber();
     sock.connect(`tcp://${zmqPubSubProxydUrl}:7001`);
     sock.subscribe('#notify');

     process.on('unhandledRejection', (error) => {
          logger.error('unhandledRejection', error.stack);
     });

     process.on('uncaughtException', (error) => {
          logger.error('uncaughtException', error.stack);
     });

     logger.info('Service start listen ZMQ SUB: ', `tcp://${zmqPubSubProxydUrl}:7001`);

     for await (const [buffer] of sock) {
          try {
               const rawMessage = buffer.toString('utf8');
               logger.info('No controller for message: ', rawMessage);
               await new Zmq().save({ msg: rawMessage });
          } catch (e) {
               logger.error(e);
          }
     }
}
