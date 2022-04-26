import express from 'express';
import logger from '../logger.mjs';
import { User, ZmqMessage } from '../../models/index.mjs'

let service = null;
const CONNECT_ATTEMPTS = 10;
let connectionAttempt = 0;

export function startServer({ port, uid }) {
    service = startService({ port, uid });
}

export async function stopServer() {
    if (!service) return;

    service.close();
    logger.info('HTTP Server stopped');
}

function startService({ port, uid }) {
    try {
        const app = express();

        app.listen(port, () => {
            logger.info(`HTTP server listening on port ${port}`)
        })

        app.get('/', async (req, res) => {
            res.send(`Hello, my uid: ${uid}`);
        })

        app.get('/save_usr_msgs', async (req, res) => {
            const id = uid + ': ' + Math.floor(Math.random() * 1000_000_000);
            await new User().save({ id });
            res.send(`${id}`);
        })

        app.get('/read_usr_msgs', async (req, res) => {
            const data = await new User().read();
            res.json(data);
        })

        app.get('/clear_usr_msgs', async (req, res) => {
            await new User().clear();
            res.send('Cleared successfully');
        })

        app.get('/read_zmq_msgs', async (req, res) => {
            const data = await new ZmqMessage().read();
            res.json(data);
        })

        app.get('/clear_zmq_msgs', async (req, res) => {
            await new ZmqMessage().clear();
            res.send('Cleared successfully');
        })

        service = app;

    } catch (err) {
        logger.error('REST Service try init');
        logger.error('REST Service connection', err);
        if (connectionAttempt <= CONNECT_ATTEMPTS) {
            connectionAttempt += 1;
            setTimeout(function () {
                startService({ port, uid });
            }, 5000 * connectionAttempt);
        } else {
            logger.info(`Stop trying connect to REST Service after ${connectionAttempt} attempts`);
        }
    }
}
