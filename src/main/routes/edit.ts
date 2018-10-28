import { Request, Response, Router } from 'express';
import { ensureLoggedIn } from "connect-ensure-login";
import World from "../scraping/World";
import Category from "../scraping/Category";
import User from "../datastore/User";
import tweet from "../tweet";
import requestRanking from "../scraping/requestRanking";
import PlayerCharacterData from "../scraping/PlayerCharacterData";
import logger from '../logger';

interface WorldNames {
    [index: string]: string;
}

interface ViewParams {
    title: string;
    world: [string, World][];
    worldName: WorldNames;
    category: [string, Category][];
    user?: User;
    updated?: boolean;
    notFound?: boolean;
    countStop?: boolean;
    err?: Error;
}
const params: ViewParams = {
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


const edit = Router();


// 画面表示時
edit.get('/',
    ensureLoggedIn('/auth/twitter'),
    (req: Request, res: Response) => {

        res.render('edit', {
            ...params,
            user: req.user
        });

    }
);


//
edit.post('/',
    ensureLoggedIn('/auth/twitter'),
    async (req: Request, res: Response) => {

        // POSTパラメーターから情報を取得
        const category = req.body.category;
        const world = req.body.world;
        const characterName = req.body.characterName;

        // ログイン中のユーザー情報を取得
        const user: User = req.user;

        try {

            if (req.query.force === 'true') {
                // ランキングにのっているかどうかに関わらず強制登録するとき。
                mergeParamsToUser(user, req.body);
                user.disabled = false;
                User.pushExpData(user, { date: new Date() });

                await User.update(user);

                const worldName: string = World.name(user.world!);
                const categoryName: string = Category.map.get(user.category!)!;

                await tweet(user, `キャラクター情報を登録しました。\r\n${user.characterName}（${worldName} / ${categoryName}\r\n#JMSRankingTweet`);

                res.render('edit', {
                    ...params,
                    user,
                    updated: true
                });

            } else {
                // ランキングサイトにアクセスしてみて、該当キャラクターのデータがあるか確認
                const data = await check(world, category, characterName);

                if (data) {
                    // ランキングにのっていたとき

                    if (data.level === 250) {
                        // レベル250のとき
                        res.render('edit', {
                            ...params,
                            user,
                            countStop: true
                        });

                    } else {
                        // いちばん正常系

                        if (user.expData.length > 0 && user.characterName !== req.body.characterName) {
                            // キャラクター変更時
                            // 前のキャラの経験値データが残ってると変な動作になるので、消去
                            user.expData = [];
                        }

                        // ユーザー情報の必要な部分を書き換える。
                        mergeParamsToUser(user, req.body);
                        user.disabled = false;

                        if (user.expData.length === 0) {
                            // 初回登録時のみの処理
                            User.pushExpData(user, {
                                date: new Date(),
                                level: data.level,
                                exp: data.exp
                            });
                            const worldName: string = World.name(user.world!);
                            const categoryName: string = Category.map.get(user.category!)!;

                            // Botツイートが選択されていたら、Botからユーザーのアカウントにメンションを飛ばす。
                            const bot = user.tweetBy === 'botMention';
                            const menthion = bot ? `@${user.userName}\r\n` : '';
                            const account = bot ? tweet.BOT : user;

                            // 情報更新したよツイート
                            await tweet(account, `${menthion}キャラクター情報を登録しました。\r\n${user.characterName}（${worldName} / ${categoryName}）\r\n現在のレベルは ${data.level} です。\r\n#JMSRankingTweet`);
                        }

                        // Datastoreに上書き保存。
                        await User.update(user);

                        res.render('edit', {
                            ...params,
                            user,
                            updated: true,
                        });

                    }

                } else {
                    // なかったとき
                    res.render('edit', {
                        ...params,
                        user,
                        notFound: true,
                        updated: false
                    });
                }
            }

        } catch (err) {
            logger.error(err);
            res.render('edit', {
                ...params,
                err
            });
        }
    });


async function check(world: string, category: string, characterName: string): Promise<PlayerCharacterData | undefined> {

    // 受け取った情報をもとにランキング情報を取得
    const ranking = await requestRanking(
        World.map.get(world)!,
        Category.map.get(category)!
    );

    return ranking.characters.find(c => c.name === characterName);

}


function mergeParamsToUser(user: User, body: any): void {
    user.category = body.category;
    user.world = body.world;
    user.characterName = body.characterName;
    user.tweetBy = body.tweetBy;
    user.tweetAt = parseInt(body.tweetAt);
    user.interval = body.interval;
    user.tweetOnlyActiveDay = body.tweetOnlyActiveDay;
    user.threshold = {
        value: parseInt(body.thresholdValue),
        order: parseInt(body.thresholdOrder)
    };
}


export default edit;
