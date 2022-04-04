import express from 'express';
import logger from '../logger.mjs';

let service = null;
const CONNECT_ATTEMPTS = 10;
let connectionAttempt = 0;

export function startServer({ port }) {
    service = startService({ port });
}

export async function stopServer() {
    if (!service) return;

    service.close();
    logger.info('WS Service stopped');
}

function startService({ port }) {
    try {
        const app = express();

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

        app.get('/', (req, res) => {
            res.send('Hello world');
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
