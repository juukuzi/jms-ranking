import * as Twit from 'twit';


/**
 * twit.config.json（gitignoreしてるよ）に記述されている設定情報を利用して、
 * 引数で与えられた文字列をツイートします。
 *
 * @param message ツイートする文字列
 */
export function tweet(message: string) {

    const twitConfig = require('../../twit.config.json');
    const twit = new Twit(twitConfig);

    twit.post(
        'statuses/update',
        { status: message },
        (err, data) => {
            if (err) console.log(err);
            else console.log(data);
        }
    );

}
