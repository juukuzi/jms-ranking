import * as winston from 'winston';
import transport = require('@google-cloud/logging-winston');

const logger = new winston.Logger({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            level: 'debug'
        })
    ]
});

logger.add(transport);

export default logger;
