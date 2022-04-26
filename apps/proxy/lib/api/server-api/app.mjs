import express from 'express';
import * as zmq from 'zeromq';
import logger from '../logger.mjs';

let service = null;
const CONNECT_ATTEMPTS = 10;
let connectionAttempt = 0;
const sockPush = new zmq.Push();
const sockPull = new zmq.Pull();


export function startServer({ port, zmqPullUrl, zmqPushUrl, uid }) {
    service = startService({ port, zmqPullUrl, zmqPushUrl, uid });
}

export async function stopServer() {
    if (!service) return;

    service.close();
    logger.info('Service stopped');
}

function startService({ port, zmqPullUrl, zmqPushUrl, uid }) {
    try {
        const app = express();

        app.listen(port, async () => {
            logger.info(`HTTP server listening on port ${port}`);
            logger.info(`ZMQ push ${zmqPushUrl}`);
            logger.info(`ZMQ pull ${zmqPullUrl}`);
            
            await sockPush.bind(zmqPushUrl);
            await sockPull.bind(zmqPullUrl);

            for await (const [message] of sockPull) {
                await sockPush.send(message.toString('utf8'));
            }
        });

        app.get('/', async (req, res) => {
            res.send(`Hello, my uid: ${uid}`);
        });

        service = app;

    } catch (err) {
        logger.error('Service try init');
        logger.error('Service connection', err);
        if (connectionAttempt <= CONNECT_ATTEMPTS) {
            connectionAttempt += 1;
            setTimeout(function () {
                startService({ port, zmqPullUrl, zmqPushUrl, uid });
            }, 5000 * connectionAttempt);
        } else {
            logger.info(`Stop trying connect to service after ${connectionAttempt} attempts`);
        }
    }
}
