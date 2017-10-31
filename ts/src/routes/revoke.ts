import { Router, Request, Response } from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import User from '../datastore/User';
import logger from '../logger';

const revokeRouter = Router();

revokeRouter.get('/',
    (req: Request, res: Response) => {

        const user: User | undefined = req.user;

        res.render('revoke', {
            title: 'Revoke',
            user
        });
    });

revokeRouter.post('/', ensureLoggedIn('/auth/twitter'),
    async (req: Request, res:Response) => {

        const user: User = req.user;

        try {
            await User.revoke(user);

            logger.debug('user revoked', user);

            res.render('revoke', {
                title: 'Revoke',
                revoked: true
            });

        } catch (err) {

            logger.error('fail revoke', err);

            res.render('revoke', {
                title: 'Revoke',
                err: true
            });
        }
    });

export default revokeRouter;
