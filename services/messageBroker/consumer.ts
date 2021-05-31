import { ConsumerRunConfig, Kafka } from 'kafkajs';
import { kafkaSettings } from './kafka';


type consumerOptionT = {
    topic: string,
    groupId: string
    config?: ConsumerRunConfig 
}


const createConsumers = async (consumerData: consumerOptionT[]) => {
    const kafka = new Kafka(kafkaSettings);

    const consumers = consumerData.map( ({ groupId }) =>  kafka.consumer({ groupId }));
    
    const consumerConnections = consumers.map(x => x.connect());
    await Promise.all(consumerConnections);
    
    
    const topicSubscriptions = 
        consumerData
        .map(({topic}, i) =>  {
            const currentConsumer = consumers[i];
            
            if(!currentConsumer) return Promise.resolve();


            currentConsumer.subscribe({ topic })
        });

    await Promise.all(topicSubscriptions);

    consumers
    .forEach((x, i) => {
        const { config } = consumerData[i];
        x.run(config)
    })


}

export { createConsumers, consumerOptionT }; 
