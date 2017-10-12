import * as express from 'express';
import { Request, Response } from 'express';

const app = express();
app.get('/', (req: Request, res: Response) =>
    res.send('Hello World!'));

app.listen(8080, () =>
    console.log('server listening on port 8080.'));
