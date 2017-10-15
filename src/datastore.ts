import Datastore = require('@google-cloud/datastore');
import Category from "./Category";
import World from "./World";
import PlayerCharacterData from "./PlayerCharacterData";
import RankingList from "./RankingList";
import {DatastoreTransaction} from "@google-cloud/datastore/transaction";


const datastore = Datastore();


/**
 * @param dateString
 * @param worldKey
 * @param categoryKey
 * @param character
 * @returns Datastoreに保存する用のエンティティ
 */
function toEntity(dateString: string, worldKey: string, categoryKey: string, character: PlayerCharacterData) {
    return {
        key: datastore.key([
            'Date', dateString,
            'World', worldKey,
            'Category', categoryKey,
            'Character', character.name,
        ]),
        data: {
            level: character.level,
            exp: character.exp
        }
    };
}


/**
 * @param ranking
 */
export async function saveRankingList(ranking: RankingList): Promise<void> {

    const {
        characters,
        dateString,
        worldKey,
        categoryKey
    } = ranking;

    const complete = characters
        .map(character => toEntity(dateString, worldKey, categoryKey, character))
        .map(entity => datastore.save(entity));

    await Promise.all(complete);

}


/**
 * 指定した日付の全ランキング情報を削除します。
 *
 * @param dateString 削除する日付の Date.prototype.toDateString() の値
 * @returns 終わったとき用Promise
 */
export async function deleteRankingLists(dateString: string): Promise<void> {

    // トランザクションつかうよ
    const transaction: DatastoreTransaction = datastore.transaction();
    await transaction.run();

    // 指定された日付の全キャラクターデータを検索！
    const query = datastore.createQuery('Character')
        .select('__key__')
        .hasAncestor(datastore.key(['Date', dateString]));

    const targetKeys = await transaction.runQuery(query);

    transaction.delete(targetKeys);

    await transaction.commit();

}
