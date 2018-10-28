interface Config {

    twitter: {
        consumerKey: string;
        consumerSecret: string;
    };

    bot: {
        token: string;
        tokenSecret: string;
    };

    sessionKey: string;

    daysToKeepExpData: number;

    maxRetry: number;

}

const config: Config = require('../../resources/config.json') as Config;

export default config;
