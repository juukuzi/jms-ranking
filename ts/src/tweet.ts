import * as Twit from 'twit';
import User from "./datastore/User";
import config from './config';


/**
 * twit.config.json（gitignoreしてるよ）に記述されている設定情報を利用して、
 * 引数で与えられた文字列をツイートします。
 *
 * @param user ツイートするユーザー
 * @param message ツイートする文字列
 */
function tweet(user: User, message: string): Promise<Twit.Response> {

    const twit = new Twit({
        consumer_key: config.twitter.consumerKey,
        consumer_secret: config.twitter.consumerSecret,
        access_token: user.token,
        access_token_secret: user.tokenSecret
    });

    return new Promise<Twit.Response>((resolve, reject) => {
        twit.post(
            'statuses/update',
            {status: message},
            (err, data) => {
                if (err) reject(err);
                else resolve(data);
            }
        );
    });
}

namespace tweet {
    export const BOT: User = {
        id: "0",
        userName: "JMSExpTweetBot",
        disabled: false,
        expData: [],
        token: config.bot.token,
        tokenSecret: config.bot.tokenSecret,
    };
}

export default tweet;
