import { connect } from 'amqplib';

// Define all MQTT environment variables needed
const amqpEnabled = process.env.AMQP_ENABLED == "true" || false
const amqpHost = process.env.AMQP_HOST || "localhost"
const amqpPort = process.env.AMQP_PORT || 1883
const amqpQueueName = process.env.AMQP_QUEUE_NAME || "queue"

export async function setupAmqp(handleEvent: any) {
    if (amqpEnabled) {
        const connection = await connect(`amqp://${amqpHost}:${amqpPort}`);

        const channel = await connection.createChannel();

        await channel.assertQueue(amqpQueueName);
        await channel.consume(amqpQueueName, (message: any) => {
            if (message !== null) {
                console.log('Received message:', message.content.toString());
                handleEvent(message.content.toString());
                channel.ack(message);
            }
        });
    }
}
