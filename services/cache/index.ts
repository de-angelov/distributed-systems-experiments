import  redis  from "redis";
import { promisify } from 'util';
import { loggerT } from "../../helpers/loggers";



type cacheT = {
    getCache: (arg1: string) => Promise<string | null>,
    setCache:  (arg1: string, arg2: string) => Promise<unknown>,
    closeCache: (flush?: boolean | undefined) => Promise<unknown>
}

const initCache = (logger: loggerT): cacheT => {
    const redisPort = 6379
    const client = redis.createClient(redisPort);

    //log error to the console if any occurs
    client.on("error", e => logger.error("Cache " + e));

    const setCache = promisify(client.set).bind(client);
    const getCache = promisify(client.get).bind(client);
    const closeCache = promisify(client.end).bind(client);

    client.end
    return (
        {
            getCache,
            setCache,
            closeCache
        }
    )
} 

export {
    initCache,
    cacheT
}

