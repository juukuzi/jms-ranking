import User from "../datastore/User";
import World from "./World";
import Category from "./Category";
import requestRanking from "./requestRanking";
import RankingList from "./RankingList";

/**
 * 指定されたユーザーのキャラクターを含むランキングリストを取得してきます。
 */
async function rankingFor(user: User): Promise<RankingList> {
    return requestRanking(
        World.map.get(user.world!)!,
        Category.map.get(user.category!)!
    );
}

/**
 * ユーザーとランキングが一致してるか
 */
function suitable(ranking: RankingList, user: User): boolean {
    return ranking.categoryKey === user.category &&
        ranking.worldKey === user.world;
}

/**
 *
 */
export default async function scraping(): Promise<void> {

    // とりあえず有効な全ユーザーをDatastoreから取得してくる。
    // ワールド・職業別にソートされているよ。
    const users = await User.findAll();

    // だれも登録されていないとき：おやすみ
    if (users.length === 0) return;

    // とりあえず最初のユーザーの分のランキングを取得
    let ranking = await rankingFor(users[0]);

    // 各ユーザーに対して
    for (const user of users) {

        if (!suitable(ranking, user)) {
            // ランキングがちがったら取得しなおす
            ranking = await rankingFor(user);
        }

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
