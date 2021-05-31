import { Kafka, ProducerRecord } from "kafkajs";
import { loggerT } from "../../helpers/loggers";
import { kafkaSettings } from "./kafka";



export const createProducer = async ( logger: loggerT ) => {
    const kafka = new Kafka(kafkaSettings);
    
    const producer = kafka.producer();
    await producer.connect();

    return producer
}
