import * as path from 'path';
import * as express from 'express';
import { Application, NextFunction, Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import connectDatastore = require('@google-cloud/connect-datastore');
import * as passport from 'passport';
import { Strategy as TwitterStrategy} from 'passport-twitter';
import index from './routes/index';
import edit from './routes/edit';
import crawl from './routes/crawl';
import auth from './routes/auth';
import config from './config';
import datastore from './datastore/datastore';
import User from './datastore/User';
import logger from './logger';


export default function setup(): Application {

    // expressでやってく。
    const app = express();

    // テンプレートエンジンはとりあえずpugをつかってるよ。
    app.set('views', path.join(__dirname, '..', '..', 'resources', 'views'));
    app.set('view engine', 'pug');

    // publicフォルダの中身をwebに公開
    app.use(express.static(path.join(__dirname, '..', '..', 'resources', 'public')));

    // POSTパラメーター処理するようのやつ
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // passport用各種設定
    const DatastoreStore = connectDatastore(session);

    app.use(session({
        store: new DatastoreStore({
            dataset: datastore
        }),
        secret: config.sessionKey,
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user: User, done) => {
        done(null, user.id)
    });
    passport.deserializeUser((id: string, done) => {
        User.findById(id)
            .then(user => done(null, user))
            .catch(err => {
                logger.error(err);
                done(err);
            });
    });

    passport.use(new TwitterStrategy(
        {
            consumerKey: config.twitter.consumerKey,
            consumerSecret: config.twitter.consumerSecret,
            callbackURL: 'https://jms-ranking-tweet.appspot.com/auth/twitter/callback'
        },
        (token, tokenSecret, profile, done) => {
            User.signUp(profile.id, profile.username, token, tokenSecret)
                .then(user => done(null, user))
                .catch(err => {
                    logger.error(err);
                    done(err, null);
                });
        }
    ));

    // 各パスに対するリクエストのルーティング設定
    app.use('/', index);
    app.use('/edit', edit);
    app.use('/crawl', crawl);
    app.use('/auth', auth);
    app.get('/error', (req, res) => res.render('error'));

    // catch 404 and forward to error handler
    type SError = Error & { status?: number };
    app.use((req: Request, res: Response, next: NextFunction) => {
        const err: SError = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // error handler
    app.use((err: SError, req: Request, res: Response) => {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    });

    return app;

}
