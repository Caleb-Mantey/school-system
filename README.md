<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A School Management application built with NestJs framework TypeScript starter repository.

## Installation

```bash
npm install
```

## Dependencies

- [Grunt](https://gruntjs.com/) - Cli tooling for automating various task
- [Mysql](https://www.mysql.com/) - Main database for storing application data
- [Redis](https://redis.io/) - In memory caching service
- [TypeOrm](https://typeorm.io/) - Database Orm for communicating with database
- [Socket.io](https://socket.io/) - Real time connection with driver and rider mobile apps
- [OneSignal](https://onesignal.com) - For sending push notifications
- ([Hubtel](https://hubtel.com/) / [Paystack](https://paystack.com/) ) - Payment providers used for accepting payments.
- ([Hellio](https://app.helliomessaging.com/login) / [Msmpusher](https://msmpusher.net/signin) ) - Sms providers used for sending sms.
- [AdminJS](https://adminjs.co/) - Admin Panel tool
- [Swagger](https://swagger.io/) - OpenAPI generator tool
- [Compodoc](https://compodoc.app/) - For generating code documentation

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Generating App Docs

```bash
# Generate API Doc
$ npm run compodoc

# Run the App
$ npm run start

# View Code Documentation in the browser - http://localhost:4000
# View Api Documentation in the browser - http://localhost:4000/api-docs
```

## Generators

We make use of grunt for executing some cli commands and generating various files according to how the project structure is organized.

```bash
# Install grunt cli globally
$ npm install -g grunt-cli
```

### Commands for NestJS Generators

- Controller - `grunt exec:controller:<Name>`
- Service - `grunt exec:service:<Name>`
- module - `grunt exec:module:<Name>`
- gateway - `grunt exec:gateway:<Name>`
- guard - `grunt exec:guard:<Name>`
- decorator - `grunt exec:decorator:<Name>`
- interceptor - `grunt exec:interceptor:<Name>`
- interface - `grunt exec:interface:<Name>`

## Database

```bash
# Generate a new database migration
$ grunt exec:create_migration:<MIGRATION_NAME>

# Run the database migration
$ npm run db:migrate

# Rollback the database migration
$ npm run db:rollback

# Create an empty migration
$ npm run migration:create <MIGRATION_NAME>
```

## CI / CD

We make use of grunt and npm for auto deployment on the staging server and github actions for prod server.

- Setup Server - `npm run setup:staging`
- Deploy on Server - `npm run deploy:staging`
- View Server logs - `npm run logs:staging`
- Rollback Release - `npm run rollback:staging`
- Download DB from Server - `npm run db:backup:staging`
- Backup DB on Server - `npm run db:download:staging`


### FIX EOF Error on Windows
```
npm i -g prettier

prettier --end-of-line lf --write src/ test/ datasource.ts Gruntfile.js ormconfig.ts

git config core.autocrlf false 
git rm --cached -r . 
git reset --hard
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
