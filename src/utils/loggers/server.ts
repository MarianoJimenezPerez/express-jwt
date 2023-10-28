import winston from 'winston';
import { format } from 'winston';
import path from 'path';
import { logDirectory } from './directory';


const serverStartFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, message }) => {
      return `[${timestamp}] ${message}`;
    })
);

export const serverStartLogger = winston.createLogger({
    level: 'info',
    format: serverStartFormat,
    defaultMeta: { service: 'api-service' },
    transports: [
      new winston.transports.Console({ level: 'verbose' }),
      new winston.transports.File({ filename: path.join(logDirectory, 'server-start.log') }),
    ],
  });