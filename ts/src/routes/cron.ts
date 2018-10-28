import { Request, Response, Router } from 'express';
import logger from '../logger';
import scraping from '../scraping/scraping';
import User from '../datastore/User';
import tweetMessage from './tweetMessage';
import tweet from '../tweet';

const cronRouter = Router();

// クローリングを開始するリクエストに対応。
// cron.yamlで設定してあるタイミングでこれが呼び出されるはず。
cronRouter.get('/crawl', async (req: Request, res: Response) => {

    // GCPのcronからリクエストがきたときは、このヘッダーがついてるらしいです
    const fromCron = req.get('X-Appengine-Cron') === 'true';

    if (fromCron) {
        try {
            logger.info('get crawl request');
            res.sendStatus(200);
            await scraping();

        } catch (err) {
            logger.error(err);
        }

    } else {
        // なんかサービス外からクローリングリクエストが来たとき
        res.sendStatus(403);
    }

});


function matchTime(user: User): boolean {
    const time: number = new Date().getHours();
    // 今が指定した時刻か、未設定かつ7時設定であればtrue
    return (time === user.tweetAt) || (time === 7 && typeof user.tweetAt === 'undefined');
}


// ツイートを行うリクエストに対応
cronRouter.get('/tweet', async (req: Request, res: Response) => {

    const fromCron = req.get('X-Appengine-Cron') === 'true';

    if (!fromCron) {
        // なんか外部からリクエストが飛んできたとき
        res.sendStatus(403);
        return;
    }

    // 正常なリクエスト時
    logger.info('tweet request at ' + new Date().getHours());

    try {

        // 全ユーザーを取得
        const users: User[] = await User.findAll();

        for (const user of users) {

            // この時間にツイートしてほしい人以外はスキップするよ。
            if (!matchTime(user)) continue;

            const message = tweetMessage(user);

            if (message) {
                // 呟くことがあるとき Twitterに送信
                try {
                    if (user.tweetBy === 'botMention') {
                        // Botからのメンション選択時
                        await tweet(tweet.BOT, `@${user.userName}\r\n${message}`);
                    } else {
                        // 自分のアカウント
                        await tweet(user, message);
                    }

                } catch (err) {
                    // ツイート送信時に何らかのエラーが発生したとき
                    logger.error(err);

                    if (err.message.match('Invalid or expired token')) {
                        // なんかトークンの有効期限切れだったとき
                        // 多分アプリケーション認証を無効化しているので、こちらからもツイート停止
                        logger.info(`to disable user @${user.userName}`);
                        user.disabled = true;
                        await User.update(user);
                    }
                }

            } else {
                // 呟くことがなければスキップ
                logger.debug(`skip for ${user.characterName}`);
            }

        }

        res.sendStatus(200);

    } catch (err) {
        logger.error(err);
        res.sendStatus(500);
    }

});


export default cronRouter;
