import * as winston from 'winston';
import gcloudTransport = require('@google-cloud/logging-winston');

winston.configure({
    level: 'debug'
});
winston.add(gcloudTransport);

export default winston;
