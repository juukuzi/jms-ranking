import { Request, Response, Router } from 'express';
import logger from "../logger";

const crawlRouter = Router();

// クローリングを開始するリクエストに対応。
// cron.yamlで設定してあるタイミングでこれが呼び出されるはず。
crawlRouter.get('/', async (req: Request, res: Response) => {

    // GCPのcronからリクエストがきたときは、このヘッダーがついてるらしいです
    const fromCron = req.get('X-Appengine-Cron') === 'true';

    if (fromCron) {
        try {
            // await crawl();
            logger.info('get crawl request');
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


export default crawlRouter;
