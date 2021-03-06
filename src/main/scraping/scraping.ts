import User from "../datastore/User";
import World from "./World";
import Category from "./Category";
import requestRanking from "./requestRanking";
import RankingList from "./RankingList";
import logger from '../logger';

/**
 * 指定されたユーザーのキャラクターを含むランキングリストを取得してきます。
 */
async function rankingFor(user: User): Promise<RankingList> {
    logger.debug(`world: ${user.world}, category: ${user.category}`);
    return requestRanking(
        World.map.get(user.world!)!,
        Category.map.get(user.category!)!
    );
}

/**
 * 同じ日かどうか
 */
function sameDate(date1: Date, date2: Date): boolean {
    return date1 && date2 &&
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

/**
 * バーっと必要な分を取得してきて情報を取得するよ。
 */
export default async function scraping(): Promise<void> {

    // とりあえず有効な全ユーザーをDatastoreから取得してくる。
    // ワールド・職業別にソートされているよ。
    const users = await User.findAll();

    // だれも登録されていないとき：おやすみ
    if (users.length === 0) { logger.warn('no user.'); return; }

    const today = new Date();

    // 各ユーザーに対して
    for (const user of users) {
        // このユーザーが今日分のデーターをもう取得していたらスキップするよ。
        const last = user.expData[user.expData.length - 1];
        if (sameDate(last.date, today)) {
            continue;
        }

        // ランキング取得
        const ranking = await rankingFor(user);

        // ランキングリストからそのユーザーのキャラクターを探す
        const data = ranking.characters.find(data => data.name === user.characterName);

        if (data) {
            // のっていたとき
            User.pushExpData(user, {
                date: ranking.date,
                level: data.level,
                exp: data.exp
            });
        } else {
            // のっていなかったとき
            User.pushExpData(user, {
                date: ranking.date
            });
        }

        // そのユーザーの情報を更新
        await User.update(user);
    }

}
