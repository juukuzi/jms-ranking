import * as express from 'express';
import * as session from 'express-session';
import * as passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { ConfigKeys as TwitConfig } from "twit";
import { Request, Response } from 'express';
import logger from "./logger";
import crawl from "./crawl";
import { insertUserIfNotExists } from "./datastore";


const app = express();


// publicフォルダの中身をwebに公開
app.use(express.static('resources/public'));

// passport用各種設定
app.use(session({
    secret: 'hogemoge',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


const twitConfig = require('../../resources/twit.config.json') as TwitConfig;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new TwitterStrategy(
    {
        consumerKey: twitConfig.consumer_key,
        consumerSecret: twitConfig.consumer_secret,
        callbackURL: '/auth/twitter/callback'
    },
    (token, tokenSecret, profile, done) => {
        insertUserIfNotExists(profile.id, profile.username, token, tokenSecret)
            .then(() => done(null, profile))
            .catch(err => logger.error(err));
    }
));

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/my-page',
    passport.authenticate(
        'twitter',
        {
            failureRedirect: '/fail-auth',
        }),
    (req: Request, res: Response) => {

    }
);


// クローリングを開始するリクエストに対応。
// cron.yamlで設定してあるタイミングでこれが呼び出されるはず。
app.get('/crawl', async (req: Request, res: Response) => {

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


// ポートはデフォルトで8080つかうらしい
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}`);
});
