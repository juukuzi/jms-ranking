import * as winston from 'winston';

const logger = new winston.Logger({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            level: 'debug',
            colorize: true,
            timestamp: true
        })
    ]
});

export default logger;
