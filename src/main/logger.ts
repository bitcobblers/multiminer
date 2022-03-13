import { pino } from 'pino';

function getLogger() {
  if (process.env.NODE_ENV === 'development') {
    return pino({
      name: 'multiminer-app',
      level: 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    });
  }

  return pino({
    name: 'multiminer-app',
    level: 'info',
  });
}

export const logger = getLogger();
