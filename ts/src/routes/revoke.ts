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
            // ユーザー情報を削除
            await User.revoke(user);

            if (req.session) {
                // セッションを削除
                req.session.destroy(err => {
                    if (err) {
                        logger.error(err);
                        res.render('revoke', {
                            title: 'Revoke',
                            err: true
                        });
                    } else {
                        logger.debug('user revoked', user);

                        res.render('revoke', {
                            title: 'Revoke',
                            revoked: true
                        });
                    }
                });
            }

        } catch (err) {

            logger.error('fail revoke', err);

            res.render('revoke', {
                title: 'Revoke',
                err: true
            });
        }
    });

export default revokeRouter;
