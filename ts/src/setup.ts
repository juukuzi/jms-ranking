import * as path from 'path';
import * as express from 'express';
import { Application, NextFunction, Request, Response} from "express";
import * as session from 'express-session';
import connectDatastore = require('@google-cloud/connect-datastore');
import * as passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { ConfigKeys as TwitConfig } from 'twit';
import index from './routes/index';
import myPage from './routes/myPage';
import crawl from './routes/crawl';
import auth from './routes/auth';
import onAuth from './onAuth';
import {datastore} from "./datastore/datastore";

// 設定ファイル（JSON）をよみこむ。.gitignoreされてるよ。
const twitConfig = require('../../resources/twit.config.json') as TwitConfig;


export default function setup(): Application {

    // expressでやってく。
    const app = express();

    // テンプレートエンジンはとりあえずpugをつかってるよ。
    app.set('views', path.join(__dirname, '..', '..', 'resources', 'views'));
    app.set('view engine', 'pug');

    // publicフォルダの中身をwebに公開
    app.use(express.static(path.join(__dirname, '..', '..', 'resources', 'public')));

    // passport用各種設定
    const DatastoreStore = connectDatastore(session);

    app.use(session({
        store: new DatastoreStore({
            dataset: datastore
        }),
        secret: 'hogemoge',
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));

    passport.use(new TwitterStrategy(
        {
            consumerKey: twitConfig.consumer_key,
            consumerSecret: twitConfig.consumer_secret,
            callbackURL: 'https://jms-ranking-tweet.appspot.com/myPage'
        },
        onAuth
    ));

    // 各パスに対するリクエストのルーティング設定
    app.use('/', index);
    app.use('/myPage', myPage);
    app.use('/crawl', crawl);
    app.use('/auth', auth);

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
