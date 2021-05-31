import  express, { Express } from 'express';
import { match, __ } from 'ts-pattern';
import { AppError } from '../../helpers/appError';
import { loggerT } from '../../helpers/loggers';
import { controllerT } from './controler';


const initRouter = (logger: loggerT, controler: controllerT): Express =>  {
    const router = express();
    const { post: postUserContent, get: getUserContent} = controler;

    router
        .get("/api/:user/:content", async (req, res, next) =>
            {
                const { params } = req;
                const { user, content } = params;
                
                logger.info("params api/:user/:content", { params });
                
                const result = await postUserContent(user, content);
                // const result = "empty user" as postUserResultT;

                if(result === "error posting content" ){
                    next(AppError.internal("problem with cache"))
                    return;
                }
                
                const msg = 
                    match(result)
                        .with("empty user and content", () => "user and content fields are required and must be non blank")
                        .with("empty user", () => "user field is required and must be non blank")
                        .with("empty content", () => "content field is required and must be non blank")
                        .with("success", () => "")
                        .exhaustive();

                if (msg !== "" ) {
                    next(AppError.badRequest(msg));
                    return;
                }


                const status = 201;

                logger.info("response api/:user/:content", { status });
                
                res.sendStatus(status);
            }
        )
        .get("/api/:user", async (req, res, next) => {
            const  { params } = req;
            const { user } = params;

            logger.info("params api/:user", { params });

            const result = await getUserContent(user);

            const validRes=  () => 
                {
                    const body = { user,  content: result }   
                    logger.info("response api/:user", { body });

                    res.json(body);
                }

            const emptyUserRes= () => 
                next(AppError.badRequest('user field is required and must be non blank'));
            
            const noUserRes=  () =>   
                {
                    const status = 404;
                    
                    logger.info("response api/:user", { status });

                    res.sendStatus(status);
                };

            if(result === "error getting content" ){
                next(AppError.internal("problem with cache"))
                return;
            }

            
            match(result)
                .with("empty user",  emptyUserRes)
                .with("no user found", noUserRes )
                .with([__.string], validRes)
                .exhaustive();

        })
        .get("*", (rec, res) => {

            const status = 404;
            logger.info("response", { status });

            res.sendStatus(status);
        })

    return router;
}
    

export { initRouter };