import winston from 'winston';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, splat } = format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (metadata && Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

const level = process.env.LOG_LEVEL || 'info';

export const logger = createLogger({
  level: level,
  format: combine(
    colorize(),
    splat(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV === 'production') {
  logger.add(new transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: combine(
      timestamp(),
      format.json()
    ),
  }));
  logger.add(new transports.File({
    filename: 'logs/combined.log',
    format: combine(
      timestamp(),
      format.json()
    ),
  }));
}
