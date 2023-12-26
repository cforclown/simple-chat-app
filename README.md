# Chat App

Simple chat app

## Requirements

- Node ^20
- Npm ^10
- Docker (mandatory for [Quick Start](#quick-start-docker))
- MongoDB (Optional, for running on local machine. Ignore this if you use Docker)
- RabbitMQ (Optional, for running on local machine. Ignore this if you use Docker)

## Tech stack

- NodeJS
- ExpressJS
  - 3 Layer architecture (controller, service, data-access-object)
  - Dependency injection (Awilix)
  - [cexpress-utils](https://github.com/cforclown/cexpress-utils)  - [npm](https://www.npmjs.com/package/cexpress-utils) ( i built this)
  - Unit test coverage ^80%
- Swagger API Documentation
- SocketIO
- RabbitMQ
- ReactJS
- Redux, Redux Toolkit, Redux Saga
- MongoDB

## Quick Start (Docker)

- clone this repo
- `cp env-example .env`
- `docker compose -f docker-compose.dev.yaml up -d`
- open [http://localhost:8080](http://localhost:8080) on your favorite browser
- open [http://localhost:8090/api/v1/docs](http://localhost:8090/api/v1/docs) for API Documentation
- Enjoy!

## How to run API only

- `cd chat-app`
- `cp env-example .env`
- adjust `.env` file or leave as it is
- `docker compose -f docker-compose.dev.yaml up -d` or
  To run API on local machine
  - `npm install`
  - adjust `.env`
    - change `DB_HOST` value to `localhost`
    - change `AMQP_HOST` value to `localhost`
  - `npm start` to run it on local machine
- open [http://localhost:8090/api/v1/docs](http://localhost:8090/api/v1/docs) for API Documentation
- Enjoy!

## How to run UI only

- `cd chat-app.ui`
- `cp env-example .env`
- `docker compose -f docker-compose.dev.yaml up -d` or
  - `npm install`
  - `npm start` to run it on local machine
- open [http://localhost:8080](http://localhost:8080) on your favorite browser (You will not be able to log in or register if the API is not running)
- Enjoy!
