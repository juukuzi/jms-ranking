import * as express from 'express';
import { Request, Response } from 'express';
import { CronJob } from "cron";
import { tweet } from "./tweet";
import { getAll, saveToDatastore } from "./datastore";
import {requestRanking} from "./requestRanking";


const app = express();
app.get('/', (req: Request, res: Response) =>
    res.send('IN DEVELOPMENT'));

app.listen(8080, () =>
    console.log('server listening on port 8080.'));


const tweetTimer = new CronJob(
    '00 00 08 * * *',
    () => {
        tweet('8時です！ （プログラムから定時ツイートさせるテストです）')
    },
    () => console.log('tweet timer stopped.'),
    false,
    'Asia/Tokyo'
);

tweetTimer.start();
