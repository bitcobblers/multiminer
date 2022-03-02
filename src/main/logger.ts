import { pino } from 'pino';

export const logger = pino({
  name: 'multiminer-app',
  level: 'debug',
});
