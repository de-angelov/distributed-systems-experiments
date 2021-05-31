import { NextFunction, Response, Request} from "express";
import { loggerT } from "./loggers";

const apiLogHandler = 
    (logger: loggerT ) => 
    (req: Request, res: Response , next: NextFunction) => {
        
        logger.info("Incomming request", { method: req.method });

        logger.debug("Incomming request verbose", {
            headers: req.headers,
            query: req.query,
            body: req.body 
        });

        return next();
    }

export { apiLogHandler };