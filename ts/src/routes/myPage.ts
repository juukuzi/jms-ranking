import { Request, Response, Router } from "express";
import * as passport from "passport";

const myPageRouter = Router();

myPageRouter.get('/',
    passport.authenticate(
        'twitter',
        {
            failureRedirect: '/fail-auth',
        }),
    (req: Request, res: Response) => {

    }
);

export default myPageRouter;
