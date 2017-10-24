import { Request, Response, Router } from 'express';
import * as passport from 'passport';
import { Profile } from 'passport-twitter';

const setting = Router();

type URequest = Request & { user: Profile };

setting.get('/',
    passport.authenticate(
        'twitter',
        {
            failureRedirect: '/fail-auth',
        }),
    (req: URequest, res: Response) => {
        res.render('setting', {
            title: 'Setting'
        });
    }
);

export default setting;
