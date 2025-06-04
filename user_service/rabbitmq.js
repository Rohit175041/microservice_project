const amqp = require('amqplib');
const logger = require('./logger');

let channel;

async function connectRabbitMQ(rabbitUrl, retries = 10, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect(rabbitUrl);
      channel = await connection.createChannel();
      await channel.assertQueue('user_registered', { durable: true });
      logger.info('User service connected to RabbitMQ and queue initialized.');
      return; // success
    } catch (error) {
      logger.error(`RabbitMQ connection failed (attempt ${i + 1}): ${error.message}`);
      if (i < retries - 1) {
        logger.info(`Retrying in ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        logger.error('All RabbitMQ connection attempts failed.');
        throw error;
      }
    }
  }
}

function publishToQueue(queue, message) {
  if (!channel) {
    logger.error('Cannot publish, RabbitMQ channel not initialized.');
    return;
  }

  try {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    logger.debug(`Message published to queue '${queue}': ${JSON.stringify(message)}`);
  } catch (error) {
    logger.error(`Failed to publish message to '${queue}': ${error.message}`);
  }
}

module.exports = { connectRabbitMQ, publishToQueue };
