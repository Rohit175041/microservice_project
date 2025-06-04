const express = require('express');
const bodyParser = require('body-parser');
const { connectRabbitMQ, publishToQueue } = require('./rabbitmq');
const logger = require('./logger');

const app = express();
app.use(bodyParser.json());

async function start() {
  await connectRabbitMQ(process.env.RABBITMQ_URL);

  app.post('/register', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
      logger.warn('Missing name or email');
      return res.status(400).send('Name and email are required');
    }

    logger.info(`User registered: ${name} <${email}>`);
    publishToQueue('user_registered', { name, email });

    res.status(201).send('User registered and event published');
  });

  app.listen(3000, () => {
    logger.info('User service running on http://localhost:3000');
  });
}

start().catch(err => logger.error(err.message));
