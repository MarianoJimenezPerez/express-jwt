import winston from 'winston';
import { format } from 'winston';
import path from 'path';
import { logDirectory } from './directory';

const requestFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, message, userAgent, ip }) => {
        return `[${timestamp}] IP: ${ip} - User-Agent: ${userAgent} - ${message}`;
    })
);

export const requestLogger = winston.createLogger({
    level: 'info', 
    format: requestFormat,
    defaultMeta: { service: 'api-service' },
    transports: [
        new winston.transports.Console({ level: 'verbose' }),
        new winston.transports.File({ filename: path.join(logDirectory, 'api.log') }),
    ],
});