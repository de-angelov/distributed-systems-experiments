import express from 'express';
import { logger } from '../../helpers/loggers';
import { apiErrorHandler } from '../../helpers/errorHandler';
import { initRouter } from './routes';
import { apiLogHandler } from '../../helpers/logHandler';
import { initCache } from '../cache';
import { initConteroller } from './controler';
import { initDBMessages } from '../messageBroker/dbMessages';

import nodeCleanup from 'node-cleanup';

(async () => {

    const port = 3000; //todo get from enviorment
    const name = "getUserActions"; //todo get from enviorment

    const subscribeToEvent = (event: string) =>  
        {
            process.on(
                event, 
                error =>  { 
                    logger.error(event + " " + error);
                
                    //fix for extending process.emit types
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    // (process.emit as Function)("exit");
                    process.exit(1);
                }
            );
        }

    const startMsg = () => 
        logger.info(`starting "getUserActions" service: ${name} on port: ${port}`);



    const errorMiddleware = apiErrorHandler(logger);
    const requestLogMiddleware = apiLogHandler(logger);

    const cache = initCache(logger);
    const dbMessages = await initDBMessages(logger);

    const controller = initConteroller(cache, dbMessages);
    const router = initRouter(logger, controller);

    const onServerClose = 
        [
            cache.closeCache,

        ]

    const server = 
        express()
            .use(requestLogMiddleware)
            .use(express.json())
            .use("/", router)
            .use(errorMiddleware)
            .listen(port, startMsg);

    nodeCleanup((exitCode, signal) => {
            // release resources here before node exits
            logger.info(`nodeCleanup exitCode: ${exitCode} signal: ${signal ?? null}`);
        
            
            server.close(error =>  {   
                if(error) {
                    logger.error(error);
                    process.exit(1);
                } 
            });

            
            onServerClose
            .map(closeFunc =>
                closeFunc()
                .then(logger.info)
                .catch(logger.error)
            );

            logger.info("END!");
        });


    ["uncaughtException","unhandledRejection"].forEach(subscribeToEvent);
})()



    


