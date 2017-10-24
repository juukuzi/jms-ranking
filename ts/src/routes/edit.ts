import { Request, Response, Router } from 'express';
import * as passport from 'passport';
import User from "../datastore/User";

const edit = Router();

type URequest = Request & { user: User };

edit.get('/',
    passport.authenticate(
        'twitter',
        (req: URequest, res: Response) => {
            res.render('edit', {
                title: 'Edit'
            });
        }
    )
);

export default edit;
