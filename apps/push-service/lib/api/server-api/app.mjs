import express from 'express';
import * as zmq from 'zeromq';
import logger from '../logger.mjs';

let service = null;
const CONNECT_ATTEMPTS = 10;
let connectionAttempt = 0;
const sock = new zmq.Push();


export function startServer({ port, zmqUrl, uid }) {
    service = startService({ port, zmqUrl, uid });
}

export async function stopServer() {
    if (!service) return;

    service.close();
    logger.info('Service stopped');
}

function startService({ port, zmqUrl, uid }) {
    try {
        const app = express();
        sock.connect(zmqUrl);
        logger.info(`ZMQ listening on ${zmqUrl}`);

        app.listen(port, () => {
            logger.info(`HTTP server listening on port ${port}`);
        })

        app.get('/', async (req, res) => {
            res.send(`Hello, my uid: ${uid}`);
        })

        app.get('/send_msg', async (req, res) => {
            const message = `#notify  { pushServiceUid: ${uid}, message: ${JSON.stringify(req.query)} }`;
            await sock.send(message);
            res.send(`Service ${uid} successfully sent a message`);
        })

        service = app;

    } catch (err) {
        logger.error('Service try init');
        logger.error('Service connection', err);
        if (connectionAttempt <= CONNECT_ATTEMPTS) {
            connectionAttempt += 1;
            setTimeout(function () {
                startService({ port, zmqUrl, uid });
            }, 5000 * connectionAttempt);
        } else {
            logger.info(`Stop trying connect Service after ${connectionAttempt} attempts`);
        }
    }
}
