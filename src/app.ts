import * as express from 'express';
import { Request, Response } from 'express';
import logger from "./logger";
import crawl from "./crawl";


const app = express();


// publicフォルダの中身をwebに公開
app.use(express.static('public'));


// クローリングを開始するリクエストに対応。
// cron.yamlで設定してあるタイミングでこれが呼び出されるはず。
app.get('/crawl', async (req: Request, res: Response) => {

    // GCPのcronからリクエストがきたときは、このヘッダーがついてるらしいです
    const fromCron = req.get('X-Appengine-Cron') === 'true';

    if (fromCron) {
        try {
            await crawl();
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


// ポートはデフォルトで8080つかうらしい
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}`);
});
