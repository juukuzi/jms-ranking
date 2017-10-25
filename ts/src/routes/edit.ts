import { Request, Response, Router } from 'express';
import { ensureLoggedIn } from "connect-ensure-login";
import World from "../scraping/World";
import Category from "../scraping/Category";

const edit = Router();

edit.get('/',
    ensureLoggedIn(),
    (req: Request, res: Response) => {
        res.render('edit', {
            title: 'Edit',
            user: req.user,
            world: [...World.map.keys()],
            category: [...Category.map.keys()]
        });
    }
);

export default edit;
