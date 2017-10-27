import { Request, Response, Router } from 'express';
import { ensureLoggedIn } from "connect-ensure-login";
import World from "../scraping/World";
import Category from "../scraping/Category";
import User from "../datastore/User";
import {tweet} from "../tweet";

interface WorldNames {
    [index: string]: string;
}

interface Params {
    title: string;
    world: [string, World][];
    worldName: WorldNames;
    category: [string, Category][];
    user?: User;
    updated?: boolean;
    err?: Error;
}

const edit = Router();

const params: Params = {
    title: 'Edit',
    world: [...World.map.entries()],
    worldName: {
        KAEDE: 'かえで',
        YUKARI: 'ゆかり',
        KURUMI: 'くるみ',
        REBOOT: 'リブート'
    },
    category: [...Category.map.entries()]
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
        const user: User = req.user;

        user.category = req.body.category;
        user.world = req.body.world;
        user.characterName = req.body.characterName;
        user.disabled = false;

        const world: string = World.name(user.world!);
        const category: string = Category.map.get(user.category!)!;

        User.update(user)
            .then(() => {

                // 情報更新したよツイート
                tweet(user, `キャラクター情報を設定しました。\r\n${user.characterName}（${world} / ${category}）\r\n#JMSRankingTweet`);

                // 更新しました表示
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
