import * as express from 'express';
import { Request, Response } from 'express';
import logger from "./logger";
import crawl from "./crawl";


const app = express();


app.use(express.static('public'));


app.get('/', (req: Request, res: Response) =>
    res.send('IN DEVELOPMENT'));


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

app.listen(8080, () =>
    console.log('server listening on port 8080.'));
