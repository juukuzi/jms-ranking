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

    if (fromCron) {

        logger.info('tweet request at ' + new Date().getHours());

        try {

            const users: User[] = await User.findAll();

            for (const user of users) {

                if (matchTime(user)) {
                    const message = tweetMessage(user);

                    if (message) {
                        // 呟きたくないときは空文字列が入っているので、こう
                        tweet(user, message);

                    } else {
                        logger.debug('skip for', user);
                    }
                }
            }

            res.sendStatus(200);

        } catch (err) {
            logger.error(err);
            res.sendStatus(500);
        }

    } else {
        res.sendStatus(403);
    }

});


export default cronRouter;
