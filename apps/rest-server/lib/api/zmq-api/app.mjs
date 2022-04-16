import * as zmq from 'zeromq';
import { ZmqMessage } from '../../models/index.mjs'
import logger from '../logger.mjs';


export async function startService({ zmqPubSubProxydUrl, uid }) {
     const sock = new zmq.Pull();
     sock.connect(zmqPubSubProxydUrl);

     process.on('unhandledRejection', (error) => {
          logger.error('unhandledRejection', error.stack);
     });

     process.on('uncaughtException', (error) => {
          logger.error('uncaughtException', error.stack);
     });

     logger.info('Service start listen ZMQ SUB: ', zmqPubSubProxydUrl);

     for await (const [buffer] of sock) {
          try {
               const rawMessage = uid + ': ' + buffer.toString('utf8');
               logger.info('No controller for message: ', rawMessage);
               await new ZmqMessage().save({ msg: rawMessage });
          } catch (e) {
               logger.error(e);
          }
     }
}
