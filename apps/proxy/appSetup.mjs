import { createLogger, LoggerTypes } from '@rtls-platform/logger/index.mjs';
import { v4 as uuidv4 } from 'uuid';
import * as App from './lib/api/index.mjs';
import * as ServerApi from './lib/api/server-api/app.mjs';
import * as ConfigContainer from './lib/config.cjs';


export async function main() {
    const uid = uuidv4();

    // Init Logger
    const logger = createLogger({
        type: LoggerTypes.Winston,
        context: {
            logLevel: ConfigContainer.config.logLevel,
            serviceName: ConfigContainer.config.serviceName,
        },
    });
    App.setLogger(logger);

    // Init Controllers Layer (API)
    ServerApi.startServer({
        port: ConfigContainer.config.serverPort,
        zmqPullUrl: ConfigContainer.config.zmqPullUrl,
        zmqPushUrl: ConfigContainer.config.zmqPushUrl,
        uid,
    });

    // Add Global Unhandled Errors Handlers
    async function exit() {
        await ServerApi.stopServer();
        logger.info('Exit');
        
        process.exit(0);
    }
    
    process.on('SIGTERM', async () => {
        logger.error('SIGTERM signal caught');
        await exit();
    });
    
    process.on('SIGINT', async () => {
        logger.error('SIGINT signal caught');
        await exit();
    });
    
    process.on('unhandledRejection', (error) => {
        logger.error('unhandledRejection', error.stack);
    });
    
    process.on('uncaughtException', (error) => {
        logger.error('uncaughtException', error.stack);
    });
}
