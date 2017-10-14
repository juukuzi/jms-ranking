import * as winston from 'winston';
import gcloudTransport = require('@google-cloud/logging-winston');

const logger = new winston.Logger({
    level: 'debug',
    transports: [
        gcloudTransport
    ]
});

export default logger;
