import { loggerT } from "../../helpers/loggers";
import { LETTERS_TOPIC, NUMBER_TOPIC } from "./kafka";

import { createProducer } from './producer';

export type dbMessagesT = {
    sendLetters: (value: string) => void;
    sendNumber: (value: string) => void;
};

export const initDBMessages = async (logger: loggerT): Promise<dbMessagesT> => {
    const producer = await createProducer(logger);

    
    return {

        sendLetters: async (value: string) => {

            const payload = 
            {
                messages:  [ { value }],
                topic: LETTERS_TOPIC
            }

            logger.info("todo: better send letters message to kafka");

            await 
            producer
            .send(payload)
            .catch(logger.error);

        },

        sendNumber:async (value: string) => {

            const payload = 
            {
                messages:  [ { value }],
                topic: NUMBER_TOPIC
            }

            logger.info("todo: better send numbers message to kafka");

            await 
            producer
            .send(payload)
            .catch(logger.error);

        }

    }   
}

