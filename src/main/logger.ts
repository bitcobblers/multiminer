import winston from 'winston';
import electron from 'electron';
import { isDevelopment } from './globals';

function getLogger() {
  const MAX_LOG_SIZE = 2 ** 20 * 5; // 5MB
  const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.splat(), winston.format.simple());
  const fileFormat = winston.format.combine(winston.format.splat(), winston.format.simple());

  const logger = winston.createLogger({
    level: isDevelopment ? 'debug' : 'info',
    transports: [
      new winston.transports.Console({ format: consoleFormat }),
      new winston.transports.File({ dirname: electron.app.getPath('userData'), filename: 'multiminer.log', maxsize: MAX_LOG_SIZE, tailable: true, format: fileFormat }),
    ],
  });

  return logger;
}

export const logger = getLogger();
