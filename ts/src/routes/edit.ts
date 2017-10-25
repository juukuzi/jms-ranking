import { Request, Response, Router } from 'express';
import * as passport from 'passport';
import World from "../scraping/World";
import Category from "../scraping/Category";

const edit = Router();

edit.get('/',
    passport.authenticate(
        'twitter',
        (req: Request, res: Response) => {
            res.render('edit', {
                title: 'Edit',
                user: req.user,
                world: [...World.map.keys()],
                category: [...Category.map.keys()]
            });
        }
    )
);

export default edit;
