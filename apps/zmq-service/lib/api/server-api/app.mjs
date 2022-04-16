import express from 'express';
import * as zmq from 'zeromq';
import logger from '../logger.mjs';

let service = null;
const CONNECT_ATTEMPTS = 10;
let connectionAttempt = 0;
const sock = new zmq.Publisher();


export function startServer({ port, zmqUrl }) {
    service = startService({ port, zmqUrl });
}

export async function stopServer() {
    if (!service) return;

    service.close();
    logger.info('WS Service stopped');
}

function startService({ port, zmqUrl }) {
    try {
        const app = express();
        sock.bind(zmqUrl);

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

        app.get('/', async (req, res) => {
            res.send('Hello');
        })

        app.get('/send_msg', async (req, res) => {
            await sock.send(`#notify  {message: ${JSON.stringify(req.query)}}`);
            res.send('Sent successfully');
        })

        service = app;

    } catch (err) {
        logger.error('Bot Service try init');
        logger.error('Bot Service connection', err);
        if (connectionAttempt <= CONNECT_ATTEMPTS) {
            connectionAttempt += 1;
            setTimeout(function () {
                startService({ port });
            }, 5000 * connectionAttempt);
        } else {
            logger.info(`Stop trying connect to Bot Service after ${connectionAttempt} attempts`);
        }
    }
}
