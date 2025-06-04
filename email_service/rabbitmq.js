const amqp = require('amqplib');
const logger = require('./logger');

async function connectAndConsume(queueName, callback) {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    logger.info(`Email service connected to RabbitMQ. Listening on queue '${queueName}'`);

    channel.consume(
      queueName,
      msg => {
        if (msg !== null) {
          try {
            const data = JSON.parse(msg.content.toString());
            callback(data);
            logger.debug(`Message received from '${queueName}': ${JSON.stringify(data)}`);
            channel.ack(msg);
          } catch (err) {
            logger.error(`Failed to process message: ${err.message}`);
            channel.nack(msg, false, false); // discard on failure
          }
        }
      },
      { noAck: false }
    );
  } catch (err) {
    logger.error(`RabbitMQ error in email-service: ${err.message}`);
    throw err;
  }
}

module.exports = { connectAndConsume };
