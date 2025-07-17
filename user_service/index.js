const cluster = require('cluster');
const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { connectRabbitMQ, publishToQueue } = require('./rabbitmq');
const logger = require('./logger');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  logger.info(`Master ${process.pid} is running`);
  logger.info(`Forking ${numCPUs} workers...`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Optional: Restart workers on exit
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died. Spawning a new one...`);
    cluster.fork();
  });

} else {
  const app = express();
  app.use(bodyParser.json());

  // Rate limiter for /register
  const registerLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many registration attempts. Please try again later.'
  });

  async function start() {
    await connectRabbitMQ(process.env.RABBITMQ_URL);

    app.post('/register', registerLimiter, (req, res) => {
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
      logger.info(`Worker ${process.pid} started on http://localhost:3000`);
    });
  }

  start().catch(err => logger.error(err.message));
}
