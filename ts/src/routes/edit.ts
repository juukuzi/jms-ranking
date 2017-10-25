import { Request, Response, Router } from 'express';
import { ensureLoggedIn } from "connect-ensure-login";
import World from "../scraping/World";
import Category from "../scraping/Category";
import User from "../datastore/User";

interface Params {
    title: string;
    world: string[];
    category: string[];
    user?: User;
    updated?: boolean;
    err?: Error;
}

const edit = Router();

const params: Params = {
    title: 'Edit',
    world: [...World.map.keys()],
    category: [...Category.map.keys()]
};

edit.get('/',
    ensureLoggedIn(),
    (req: Request, res: Response) => {

        res.render('edit', {
            ...params,
            user: req.user
        });

    }
);

edit.post('/',
    ensureLoggedIn(),
    (req: Request, res: Response) => {
        const user = req.user;

        user.category = req.body.category;
        user.world = req.body.world;
        user.characterName = req.body.characterName;

        User.update(user)
            .then(() => {
                res.render('edit', {
                    ...params,
                    user,
                    updated: true
                });
            })
            .catch(err => {
                res.render('edit', {
                    ...params,
                    err
                });
            });
    });

export default edit;
