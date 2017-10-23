import * as winston from 'winston';
import gcloudTransport = require('@google-cloud/logging-winston');

const logger = new winston.Logger({
    level: 'debug',
    transports: [
        // new winston.transports.Console(),
        gcloudTransport()
    ]
});

export default logger;
