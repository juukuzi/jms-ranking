interface Config {

    twitter: {
        consumerKey: string;
        consumerSecret: string;
    };

    sessionKey: string;

    daysToKeepExpData: number;

    maxRetry: number;

}

const config: Config = require('../../resources/config.json');

export default config;
