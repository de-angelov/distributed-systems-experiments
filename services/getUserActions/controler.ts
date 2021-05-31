// todo: get user input

import { match, __ } from "ts-pattern";
import { cacheT } from "../cache";
import { dbMessagesT } from "../messageBroker/dbMessages";

type postUserResultT =
    | "empty user and content"  
    | "empty user" 
    | "empty content" 
    | "success" 
    | "error posting content";

type postUserContentT =  (user: string,  content: string | number) =>  Promise<postUserResultT>;

type getUserResultT = 
    | "empty user" 
    | "no user found" 
    | "error getting content"
    | string[];

type getUserContentT =  (user: string ) => Promise<getUserResultT>;

type controllerT = { get: getUserContentT, post: postUserContentT } 
type initConterollerT = (cache: cacheT, dbMessages: dbMessagesT) => controllerT;

const initConteroller: initConterollerT = (cache, messageBroker)  => {
    const { setCache, getCache } = cache;
    const { stringify, parse } =  JSON;
    const { isArray } = Array;
    const { resolve } = Promise;

    const get: getUserContentT = async (user) => {
        if(user.trim() === "" ) {
            return resolve("empty user" as const);
        }

        const content = await getCache(user);
         
        if(content === null) {
            return [];
        }

        try {
            const parsedContent = parse(content);

            return isArray(parsedContent)
                ? parsedContent
                : "error getting content" as const;

        } catch (error) {
            return resolve("error getting content" as const)
        }

    };
    
    const post: postUserContentT = async (user, content) => {
    
        const setContent = async (oldContent: unknown[] = []) => {

            // todo correct flow send msg to kafka
            if(typeof content === "number"){
                messageBroker.sendNumber(content + "")
            } else {
                messageBroker.sendLetters(content)
            }
       
            const result = 
                setCache(
                    user, 
                    stringify([...oldContent, content]) 
                )
                .then(() => "success" as const )
                .catch(() => "error posting content" as const );

            return result;
        }
           
    
        const trySetContent = async (oldContent: string) => { 
    
            try{
                const parsedContent = parse(oldContent);

                return isArray(parsedContent) 
                    ? setContent([...parsedContent])
                    : setContent();
    
            } catch {
                return  setContent();
            }
    
        }
    
        const setValue = async () => {
            return getCache(user)
            .then(result =>
    
                match(result)
                .with(null, () => setContent())
                .with(__.string, trySetContent)
                .exhaustive()
              
            )
            .catch(() => "error posting content" as const)
        }
    
        const emptyUser = user.trim() === "";
        let emptyContent = false;
        if(typeof content === "string") {
            emptyContent = content.trim() === "";
        }

        return  match([emptyUser, emptyContent])
            .with([true, true], () => resolve('empty user and content' as const))
            .with([true, __], () => resolve('empty user' as const ))
            .with([__, true], () => resolve('empty content' as const) )
            .with(__, setValue)
            .exhaustive();
    
    }

    return { get,  post }
    
}

export { initConteroller, controllerT, postUserResultT, getUserResultT}