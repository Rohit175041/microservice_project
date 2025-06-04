// const { connectAndConsume } = require('./rabbitmq');
// const logger = require('./logger');

// function sendWelcomeEmail(user) {
//   logger.info(`Sending welcome email to ${user.name} <${user.email}>`);
//   // Simulate real email service here
// }

// connectAndConsume('user_registered', sendWelcomeEmail);


const { connectAndConsume } = require('./rabbitmq');
const logger = require('./logger');
const nodemailer = require('nodemailer');

// Create transporter using SMTP (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'utube175041@gmail.com',        // your gmail address
    pass: 'higgwtlbumzkavuk',     // use App Password if 2FA enabled
  },
});

async function sendWelcomeEmail(user) {
  logger.info(`Sending welcome email to ${user.name} <${user.email}>`);

  const mailOptions = {
    from: 'utube175041@gmail.com',
    to: user.email,
    subject: 'Welcome to Our Service!',
    text: `Hi ${user.name},\n\nThank you for registering with us!`,
    html: `<p>Hi <strong>${user.name}</strong>,</p><p>Thank you for registering with us!</p>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
  } catch (err) {
    logger.error(`Failed to send email: ${err.message}`);
  }
}

// Start consuming messages from RabbitMQ queue and call sendWelcomeEmail
connectAndConsume('user_registered', sendWelcomeEmail);
