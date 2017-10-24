interface Config {

    twitter: {
        consumerKey: string;
        consumerSecret: string;
    };

    sessionKey: string;

}

const config: Config = require('../../resources/config.json');

export default config;
