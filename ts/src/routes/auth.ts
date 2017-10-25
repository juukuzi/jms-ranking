import { Router } from 'express';
import * as passport from "passport";

const authRouter = Router();

authRouter.get('/twitter/', passport.authenticate('twitter'));
authRouter.get('/twitter/callback',
    passport.authenticate('twitter',
        { successRedirect: '/', failureRedirect: '/err' }));

export default authRouter;
