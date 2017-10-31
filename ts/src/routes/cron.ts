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
            await scraping();
            res.sendStatus(200);

        } catch (err) {
            logger.error(err);
            res.sendStatus(500);
        }

    } else {
        // なんかサービス外からクローリングリクエストが来たとき
        res.sendStatus(403);
    }

});


// ツイートを行うリクエストに対応
cronRouter.get('/tweet', async (req: Request, res: Response) => {

    const fromCron = req.get('X-Appengine-Cron') === 'true';

    if (fromCron) {

        try {

            const users: User[] = await User.findAll();

            for (const user of users) {
                const message = tweetMessage(user);

                if (message) {
                    // 呟きたくないときは空文字列が入っているので、こう
                    tweet(user, message);
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
