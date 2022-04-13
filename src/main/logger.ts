import winston from 'winston';
import electron from 'electron';
import path from 'path';
import { isDevelopment, isJestTest } from './globals';

export function getLoggingPath() {
  return path.join(electron.app.getPath('userData'), 'logs');
}

function getLogger() {
  const MAX_LOG_SIZE = 2 ** 20 * 5; // 5MB
  const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.splat(), winston.format.simple());
  const fileFormat = winston.format.combine(winston.format.splat(), winston.format.simple());

  const logger = winston.createLogger({
    // TODO: Hard-coding this to 'debug' for pre-release.  Will switch back to 'info' for official release.
    level: 'debug',
    // level: isDevelopment ? 'debug' : 'info',
    transports: [new winston.transports.Console({ format: consoleFormat })],
  });

  if (!isDevelopment && !isJestTest) {
    logger.add(new winston.transports.File({ dirname: getLoggingPath(), filename: 'multiminer.log', maxsize: MAX_LOG_SIZE, tailable: true, format: fileFormat }));
  }

  return logger;
}

export const logger = getLogger();
