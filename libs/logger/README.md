# logger Service

A generic logger service that standardises a format on how console logs errors, info and warning logs

## Improvements

- Adjust log() to work more like console.log() and accept any length of arguments each with any possible type
- Ability to set a LOG_LEVEL — CRITICAL, INFO, WARNING, ERROR, DEBUG — e.g. setting it to DEBUG shows everything
- Ability to easily disable logging dependent on the NODE_ENV value, e.g. if NODE_ENV=production then logging is quiet

## Technology

- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/docs/home.html)

## Prerequisites

Ensure your projects `.env` file contains the following parameters:

```
PROJECT='name-of-project'
ENVIRONMENT='the-current-env'
```

## Usage

Import the logger service

```js
import { logger } from 'logger.service';
```

to log an error

```js
try {
  throw new Error('An errrooor');
} catch (error) {
  Logger.error(error);
}
```

To log info and warnings

```js
// Info
Logger.info('Koalas sleep for up to 22 hours a day');
Logger.info(
  'Koalas sleep for up to 22 hours a day',
  {
    name: 'Tigerlily',
    strategy: 'Death by annoyance'
  },
  ['apples', 'oranges']
);

// Warn
Logger.warn('Dont eat the yellow snow');
Logger.warn(
  'Koalas sleep for up to 22 hours a day',
  {
    name: 'Tigerlily',
    strategy: 'Death by annoyance'
  },
  ['apples', 'oranges']
);
```

### Output

Error

```js
{
  type: 'error',
  environment: 'dev',
  project: 'project-name',
  errorType: 'Error',
  message: 'Error message',
  stack: the stack trace....
}
```

Info Or Warn

```js
{
  type: 'warn',
  environment: 'dev',
  project: 'project-name',
  message: 'My kitten will destroy you',
}
```

## Logging Levels

The environment determines the logs that are displayed

| Environment | Logs                  |
| ----------- | --------------------- |
| prod        | `error`               |
| preprod     | `error` `warn`        |
| test        | `error` `warn` `info` |
| test-auto   | `error` `warn` `info` |
| dev         | `error` `warn` `info` |

## Testing

Unit testing

```sh
npm run test
```

test the logger live

```sh
// From the root of the lib folder
npm install
npm run logger

// To test the log levels
npm run logger-dev
npm run logger-prod
npm run logger-preprod
```

## Contributors

- Ross Dowthwaite
