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
    logger.info('WS Service stopped');
}

function startService({ port, zmqUrl, uid }) {
    try {
        const app = express();
        sock.bind(zmqUrl);

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

        app.get('/', async (req, res) => {
            res.send(`Hello, my uid: ${uid}`);
        })

        app.get('/send_msg', async (req, res) => {
            const message = `#notify  {uid: ${uid}, message: ${JSON.stringify(req.query)}}`;
            console.log(message);
            await sock.send(message);
            res.send(`Sent successfully: ${uid}`);
        })

        service = app;

    } catch (err) {
        logger.error('Bot Service try init');
        logger.error('Bot Service connection', err);
        if (connectionAttempt <= CONNECT_ATTEMPTS) {
            connectionAttempt += 1;
            setTimeout(function () {
                startService({ port, zmqUrl, uid });
            }, 5000 * connectionAttempt);
        } else {
            logger.info(`Stop trying connect to Bot Service after ${connectionAttempt} attempts`);
        }
    }
}
