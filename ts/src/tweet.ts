import * as Twit from 'twit';
import logger from "./logger";
import User from "./datastore/User";
import config from './config';


/**
 * twit.config.json（gitignoreしてるよ）に記述されている設定情報を利用して、
 * 引数で与えられた文字列をツイートします。
 *
 * @param user ツイートするユーザー
 * @param message ツイートする文字列
 */
export function tweet(user: User, message: string): void {

    const twit = new Twit({
        consumer_key: config.twitter.consumerKey,
        consumer_secret: config.twitter.consumerSecret,
        access_token: user.token,
        access_token_secret: user.tokenSecret
    });

    twit.post(
        'statuses/update',
        { status: message },
        (err, data) => {
            if (err) logger.error('twit err.', err);
            else logger.debug('twit data.', data);
        }
    );

}
