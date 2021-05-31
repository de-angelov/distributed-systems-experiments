import  { Request, NextFunction, Response} from 'express';
import {  AppError } from './appError';
import { loggerT }  from './loggers';


const apiErrorHandler = 
    (logger: loggerT ) => 
    (err: Error, req: Request, res: Response , next: NextFunction) => {

    if (err instanceof AppError) {
      logger.error(err.message);
      res.status(err.code).json(err.message);
      return;
    }
    logger.error("NON ApiError " + err.message); 
    res.status(500).json('something went wrong');

   
}
  
export {
    apiErrorHandler,
}