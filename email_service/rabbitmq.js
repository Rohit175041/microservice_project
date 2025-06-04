const amqp = require('amqplib');
const logger = require('./logger');

async function connectAndConsume(queueName, callback, retries = 10, delay = 5000) {
  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

  for (let i = 0; i < retries; i++) {
    try {
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

      return; // success
    } catch (err) {
      logger.error(`RabbitMQ connection failed (attempt ${i + 1}): ${err.message}`);
      if (i < retries - 1) {
        logger.info(`Retrying RabbitMQ connection in ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        logger.error('All attempts to connect to RabbitMQ failed.');
        throw err;
      }
    }
  }
}

module.exports = { connectAndConsume };
