import { ConsumerRunConfig, Producer } from 'kafkajs';
import { loggerT } from '../../helpers/loggers';
import { consumerOptionT } from './consumer';
import { FAILURE_TOPIC, LETTERS_TOPIC, NUMBER_TOPIC, SUCCESS_TOPIC } from './kafka';




export const getDbConsumerOptions = (producer: Producer, logger: loggerT): consumerOptionT[] =>  {
    

    const configNumbers: ConsumerRunConfig = 
    {
        eachMessage: async ({ topic, partition, message }) => {
            const value = `topic: ${topic}, partition: ${partition}, message: ${message} `;
            const messages = [ { value} ];

            logger.info("send to kafka msg 'Failure'")
            producer.send( { topic: FAILURE_TOPIC , messages});
        }
    };
    
    const configLetters: ConsumerRunConfig = 
    {
        eachMessage: async ({ topic, partition, message }) => {
            const value = `topic: ${topic}, partition: ${partition}, message: ${message} `;
            const messages = [ { value} ];

            logger.info("send to kafka 'Success'")
            producer.send( { topic: SUCCESS_TOPIC, messages});
        }
    };

    const options = 
        [
            { topic: NUMBER_TOPIC, groupId: "numbers", config: configNumbers },
            { topic: LETTERS_TOPIC, groupId: "letters", config: configLetters },

        ];
    
    return options;
}
    

export const getUserConsumerOptions = (logger: loggerT): consumerOptionT[] =>  {
    
    
    const configSuccess: ConsumerRunConfig = 
    {
        eachMessage: async ({ topic, partition, message }) => {
            const value = `topic: ${topic}, partition: ${partition}, message: ${message} `;
     

            logger.info("Notify user 'Success' " + value);
        }
    };
    
    const configFailure: ConsumerRunConfig = 
    {
        eachMessage: async ({ topic, partition, message }) => {
            const value = `topic: ${topic}, partition: ${partition}, message: ${message} `;


            logger.info("Notify user 'Failure'" + value);
        }
    };

    const options: consumerOptionT[] = 
    [
        { topic: "processSuccess", groupId: "success", config: configSuccess },
        { topic: "processFailure", groupId: "failure", config: configFailure }
    ]

    return options;
}
