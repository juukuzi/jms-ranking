import * as winston from 'winston';
import gcloudTransport = require('@google-cloud/logging-winston');

winston.add(gcloudTransport);

export default winston;
