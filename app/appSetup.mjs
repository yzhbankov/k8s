import { createRepository } from '@rtls-platform/repository/index.mjs';
import { createLogger, LoggerTypes } from '@rtls-platform/logger/index.mjs';
import * as App from './lib/api/index.mjs';
import * as ServerApi from './lib/api/server-api/app.mjs';
import * as ConfigContainer from './lib/config.cjs';
import { createMariaDbConnection } from './lib/db/index.mjs';
import ModelBase from './lib/models/ModelBase.mjs';


export async function main() {
    // Init Logger
    const logger = createLogger({
        type: LoggerTypes.Winston,
        context: {
            logLevel: ConfigContainer.config.logLevel,
            serviceName: ConfigContainer.config.serviceName,
        },
    });
    App.setLogger(logger);

    // Init Repository Layer
    const repository = createRepository({
        db: createMariaDbConnection({
            port: ConfigContainer.config.db.port,
            host: ConfigContainer.config.db.host,
            user: ConfigContainer.config.db.user,
            database: ConfigContainer.config.db.database,
            password: ConfigContainer.config.db.password,
        })
    });

    // Init Domain Model Layer
    ModelBase.setRepository(repository);

    // Init Controllers Layer (API)
    ServerApi.startServer({
        port: ConfigContainer.config.port,
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
