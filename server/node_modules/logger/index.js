const {createLogger, format, transports} = require('winston');
const {combine, timestamp, prettyPrint} = format;

const logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new transports.Console({
      colorize: true,
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: format.json(),
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: 'logs/exceptions.log',
    }),
  ],
});

module.exports = logger;
