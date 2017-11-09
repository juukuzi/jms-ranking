import * as winston from 'winston';
import LoggingWinston = require('@google-cloud/logging-winston');

const logger = new winston.Logger({
    level: 'debug',
    transports: [
        new winston.transports.Console(),
        new LoggingWinston()
    ]
});

export default logger;
