# Microservice Architecture with Express.js and RabbitMQ

## Overview

This project demonstrates a microservice architecture using:

- **User Service:** REST API built with **Express.js** (Node.js) for user registration.
- **Email Service:** Background worker consuming messages from RabbitMQ to simulate sending welcome emails.
- **RabbitMQ:** Message broker enabling asynchronous, event-driven communication between services.
- **Docker & Docker Compose:** Containerization and orchestration for easy local development.
- **Deployment:** Ready for cloud deployment on platforms like Render.com using Docker containers and managed RabbitMQ.

---

## Architecture Diagram

User Service (Express.js)
|
publishes
v
RabbitMQ (Message Broker)
|
consumes
v
Email Service (Worker)


---

## Features

- Asynchronous communication between microservices via RabbitMQ using AMQP protocol.
- Durable queues with message acknowledgments for reliable messaging.
- Decoupled, scalable microservices following event-driven design.
- Containerized services for consistent environments and easy deployment.
- Deployment-ready configuration using environment variables and dynamic ports.
- Deployed on Render.com with Docker containers and integrated managed RabbitMQ service.

---

## Technologies Used

- **Node.js** with **Express.js** for REST API development.
- **RabbitMQ** with `amqplib` library for messaging.
- **Docker** for containerizing microservices.
- **Docker Compose** for local multi-container orchestration.
- **Render.com** for cloud deployment and managed RabbitMQ service.

---

## Setup and Run Locally

1. **Prerequisites:**

   - Docker and Docker Compose installed
   - Git installed

2. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd microservice-project
## start and stop service
docker-compose up --build
docker-compose down

## test api
curl -X POST http://localhost:3000/register \
-H "Content-Type: application/json" \
-d '{"name":"Alice","email":"alice@example.com"}'
