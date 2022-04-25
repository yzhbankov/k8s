import express from 'express';
import * as zmq from 'zeromq';
import logger from '../logger.mjs';

let service = null;
const CONNECT_ATTEMPTS = 10;
let connectionAttempt = 0;
const sockPush = new zmq.Push();
const sockSub = new zmq.Subscriber();


export function startServer({ port, zmqSubUrl, zmqPushUrl, uid }) {
    service = startService({ port, zmqSubUrl, zmqPushUrl, uid });
}

export async function stopServer() {
    if (!service) return;

    service.close();
    logger.info('WS Service stopped');
}

function startService({ port, zmqSubUrl, zmqPushUrl, uid }) {
    try {
        const app = express();

        app.listen(port, async () => {
            console.log(`Proxy app listening on port ${port}`);
            console.log(`Proxy push ${zmqPushUrl}`);
            console.log(`Proxy sub ${zmqSubUrl}`);
            
            await sockPush.bind(zmqPushUrl);
            await sockSub.bind(zmqSubUrl);
            sockSub.subscribe();

            for await (const [message] of sockSub) {
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
                startService({ port, zmqSubUrl, zmqPushUrl, uid });
            }, 5000 * connectionAttempt);
        } else {
            logger.info(`Stop trying connect to Service after ${connectionAttempt} attempts`);
        }
    }
}
