import { Kafka } from "kafkajs";

import { kafkaSettings } from "./kafka";

const topicOptions =  { numPartitions: 2, replicationFactor: 1 };
const createOptions = (topic: string) =>  ({topic, ...topicOptions });

export const createTopics = async (topicsNames: string[]) => {
    const kafka = new Kafka(kafkaSettings);

    const admin = kafka.admin();

    await admin.connect();

    const topics = topicsNames.map(createOptions);

    await admin.createTopics({ topics });

    await admin.disconnect();


}




