import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';


// Define all MQTT environment variables needed
const kafkaenabled = process.env.KAFKA_ENABLED == "true" || false
const kafkaHost = process.env.KAFKA_HOST || "localhost"
const kafkaPort = process.env.KAFKA_PORT || 1883
const kafkaGroupId = process.env.KAFKA_GROUP_ID || "group"
const kafkaClientId = process.env.KAFKA_CLIENT_ID || "consumer"
const kafkaTopic = process.env.KAFKA_TOPIC || "topic"


const kafka = new Kafka({
  clientId: kafkaClientId,
  brokers: [`${kafkaHost}:${kafkaPort}`],
});


export function setupKafka(handleEvent: any) {
    if(kafkaenabled) {
        console.log("Starting Kafka client")
        const consumer = kafka.consumer({ groupId: kafkaGroupId });

        const run = async (): Promise<void> => {
        await consumer.connect();
        await consumer.subscribe({ topic: kafkaTopic, fromBeginning: true });

        await consumer.run({
                eachMessage: async ({ topic, partition, message }: EachMessagePayload): Promise<void> => {
                if (message.value) {
                    console.log({
                    value: message.value.toString(),
                    partition,
                    offset: message.offset,
                    });

                    // Process the message here
                    handleEvent({ topic: topic }, message.value.toString());
                }
                },
            });
        };

        run().catch((error) => {
        console.error('Error connecting to Kafka:', error);
        });
    }
}
