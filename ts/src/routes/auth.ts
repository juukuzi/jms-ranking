import { Router } from 'express';
import * as passport from "passport";

const authRouter = Router();

authRouter.get('/twitter', passport.authenticate('twitter'));

export default authRouter;
